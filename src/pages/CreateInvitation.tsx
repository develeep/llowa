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
  const [loading, setLoading] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
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
            <p className="text-muted-foreground">
              로컬 가이드로서 방문자들을 초대해보세요
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

            <div className="space-y-2">
              <Label htmlFor="time">시간</Label>
              <Input
                id="time"
                type="datetime-local"
                value={formData.time}
                onChange={(e) =>
                  setFormData({ ...formData, time: e.target.value })
                }
                required
              />
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
                placeholder="어떤 활동을 함께 할 예정인가요?"
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
                    <SelectItem value="any">무관</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="languages">구사 가능 언어</Label>
              <Input
                id="languages"
                value={formData.languages}
                onChange={(e) =>
                  setFormData({ ...formData, languages: e.target.value })
                }
                required
                placeholder="예: 영어, 한국어, 일본어"
              />
            </div>

            <div className="border-t pt-6 mt-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">선호하는 비지터</h3>
              
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

            <div className="space-y-2">
              <Label htmlFor="contact">연락수단</Label>
              <Input
                id="contact"
                value={formData.contact}
                onChange={(e) =>
                  setFormData({ ...formData, contact: e.target.value })
                }
                required
                placeholder="예: 전화번호, 인스타그램, 이메일"
              />
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
                type="button"
                variant="outline"
                onClick={() => navigate("/visitor-requests")}
                className="flex-1"
              >
                비지터 요청 보기
              </Button>
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
