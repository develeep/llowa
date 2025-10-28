import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

const CreateInvitation = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    time: "",
    location: "",
    activity: "",
    contact: "",
    age_range: "20s",
    gender: "any",
    languages: "",
    preferred_gender: "any",
    preferred_age_range: "any",
    max_participants: 4,
  });
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  const daysOfWeek = [
    { value: "monday", labelKo: "월요일", labelEn: "Monday" },
    { value: "tuesday", labelKo: "화요일", labelEn: "Tuesday" },
    { value: "wednesday", labelKo: "수요일", labelEn: "Wednesday" },
    { value: "thursday", labelKo: "목요일", labelEn: "Thursday" },
    { value: "friday", labelKo: "금요일", labelEn: "Friday" },
    { value: "saturday", labelKo: "토요일", labelEn: "Saturday" },
    { value: "sunday", labelKo: "일요일", labelEn: "Sunday" },
  ];

  const timeSlots = [
    { value: "morning", labelKo: "오전 (6-12시)", labelEn: "Morning (6AM-12PM)" },
    { value: "afternoon", labelKo: "오후 (12-18시)", labelEn: "Afternoon (12PM-6PM)" },
    { value: "evening", labelKo: "저녁 (18-24시)", labelEn: "Evening (6PM-12AM)" },
    { value: "lateNight", labelKo: "심야 (0-6시)", labelEn: "Late Night (12AM-6AM)" },
  ];

  const handleDayToggle = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleTimeSlotToggle = (timeSlot: string) => {
    setSelectedTimeSlots((prev) =>
      prev.includes(timeSlot)
        ? prev.filter((t) => t !== timeSlot)
        : [...prev, timeSlot]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedDays.length === 0 || selectedTimeSlots.length === 0) {
      toast.error("가능한 요일과 시간대를 최소 1개 이상 선택해주세요.");
      return;
    }
    
    setLoading(true);

    try {
      // 선택된 요일과 시간대를 영어로 변환하여 문자열로 저장
      const daysString = selectedDays
        .map((day) => daysOfWeek.find((d) => d.value === day)?.labelEn)
        .join(", ");
      const timeSlotsString = selectedTimeSlots
        .map((slot) => timeSlots.find((t) => t.value === slot)?.labelEn)
        .join(", ");
      const timeString = `${daysString} / ${timeSlotsString}`;

      // 1. UUID를 미리 생성
      const contactId = crypto.randomUUID();

      // 2. contact 정보를 별도 테이블에 저장 (UUID 직접 지정)
      const { error: contactError } = await supabase
        .from("contacts")
        .insert({ 
          id: contactId,
          contact_info: formData.contact,
          contact_type: 'invitation' 
        });

      if (contactError) throw contactError;

      // 3. contact_id를 사용하여 invitation 저장
      const { contact, ...invitationData } = formData;
      const { error: invitationError } = await supabase
        .from("invitations")
        .insert({ 
          ...invitationData,
          time: timeString,
          contact_id: contactId 
        });

      if (invitationError) throw invitationError;

      toast.success("초대장이 성공적으로 작성되었습니다!");
      navigate("/visitor-requests");
    } catch (error) {
      console.error("Error creating invitation:", error);
      toast.error("초대장 작성에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          홈으로
        </Button>

        <Card className="p-6 md:p-8 shadow-lg border-none bg-card/95 backdrop-blur">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              초대장 작성
            </h1>
            <p className="text-muted-foreground text-sm">
              원하는 시간, 장소, 활동 등을 적어 방문자를 초대 해 보세요. 초대에 맞는 방문자를 찾으면 작성해 주신 연락처로 연락드립니다.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">제목</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
                placeholder="예: 서울 야경 투어"
              />
            </div>

            <div className="space-y-4">
              <div className="space-y-3">
                <Label>가능한 요일 (복수 선택 가능)</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {daysOfWeek.map((day) => (
                    <div key={day.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={day.value}
                        checked={selectedDays.includes(day.value)}
                        onCheckedChange={() => handleDayToggle(day.value)}
                      />
                      <label
                        htmlFor={day.value}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {day.labelKo}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label>가능한 시간대 (복수 선택 가능)</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {timeSlots.map((slot) => (
                    <div key={slot.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={slot.value}
                        checked={selectedTimeSlots.includes(slot.value)}
                        onCheckedChange={() => handleTimeSlotToggle(slot.value)}
                      />
                      <label
                        htmlFor={slot.value}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {slot.labelKo}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">장소</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                required
                placeholder="예: 남산타워"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="activity">활동</Label>
              <Textarea
                id="activity"
                value={formData.activity}
                onChange={(e) =>
                  setFormData({ ...formData, activity: e.target.value })
                }
                required
                placeholder="어떤 활동을 함께 할 예정인가요? (예: 서울 야경 투어, 한식 만들기, 영화 보기 등)"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age_range">내 나이대</Label>
                <Select
                  value={formData.age_range}
                  onValueChange={(value) =>
                    setFormData({ ...formData, age_range: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="20s">20대</SelectItem>
                    <SelectItem value="30s">30대</SelectItem>
                    <SelectItem value="40s">40대</SelectItem>
                    <SelectItem value="50+">50+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">내 성별</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) =>
                    setFormData({ ...formData, gender: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">남성</SelectItem>
                    <SelectItem value="female">여성</SelectItem>
                    <SelectItem value="any">선택 안함</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="languages">구사 가능 언어</Label>
              <Textarea
                id="languages"
                value={formData.languages}
                onChange={(e) =>
                  setFormData({ ...formData, languages: e.target.value })
                }
                required
                placeholder="1~5의 언어 수준을 함께 입력해주세요 (예: 영어 3, 한국어 4, 일본어 5)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact">연락수단</Label>
              <Input
                id="contact"
                value={formData.contact}
                onChange={(e) =>
                  setFormData({ ...formData, contact: e.target.value })
                }
                required
                placeholder="예: 인스타그램, 이메일, 카카오톡 등"
              />
            </div>

            <div className="border-t pt-6 mt-6">
              <h3 className="text-lg font-semibold text-foreground">선호하는 방문자</h3>
              <p className="text-muted-foreground text-sm mb-4">선호 요소는 방문자에겐 보이지 않습니다.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="preferred_gender">선호 성별</Label>
                  <Select
                    value={formData.preferred_gender}
                    onValueChange={(value) =>
                      setFormData({ ...formData, preferred_gender: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">남성</SelectItem>
                      <SelectItem value="female">여성</SelectItem>
                      <SelectItem value="any">무관</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preferred_age_range">선호 나이대</Label>
                  <Select
                    value={formData.preferred_age_range}
                    onValueChange={(value) =>
                      setFormData({ ...formData, preferred_age_range: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="20s">20대</SelectItem>
                      <SelectItem value="30s">30대</SelectItem>
                      <SelectItem value="40s">40대</SelectItem>
                      <SelectItem value="50+">50+</SelectItem>
                      <SelectItem value="any">무관</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2 mt-4">
                <Label htmlFor="max_participants">최대 인원</Label>
                <Input
                  id="max_participants"
                  type="number"
                  min="1"
                  max="20"
                  value={formData.max_participants}
                  onChange={(e) =>
                    setFormData({ ...formData, max_participants: parseInt(e.target.value) })
                  }
                  required
                />
              </div>
            </div>

            <div className="border-t pt-6 mt-6">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="privacy"
                  checked={privacyAccepted}
                  onCheckedChange={(checked) => setPrivacyAccepted(checked as boolean)}
                  className="mt-1"
                />
                <div className="space-y-1 leading-none">
                  <label
                    htmlFor="privacy"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    개인정보 처리방침에 동의합니다 (필수)
                  </label>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        type="button" 
                        variant="link" 
                        className="h-auto p-0 text-xs text-primary"
                      >
                        개인정보 처리방침 보기
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>개인정보처리방침</DialogTitle>
                      </DialogHeader>
                      <div className="mt-4">
                        <iframe
                          src="/privacy.html"
                          className="w-full h-[60vh] border-0"
                          title="개인정보처리방침"
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={loading || !privacyAccepted}
                className="flex-1 h-12 text-base font-semibold"
                style={{ background: "var(--gradient-warm)" }}
              >
                {loading ? "작성 중..." : "초대장 작성하기"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default CreateInvitation;
