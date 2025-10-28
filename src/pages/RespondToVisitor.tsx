import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Calendar, MapPin, Users, Languages } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type VisitorRequest = Tables<"visitor_requests">;

const RespondToVisitor = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [request, setRequest] = useState<VisitorRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [formData, setFormData] = useState({
    interestedLocation: "",
    contact: "",
    age_range: "20s",
    gender: "any",
    languages: "",
  });

  const fetchRequest = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("visitor_requests")
        .select("*")
        .eq("id", requestId)
        .single();

      if (error) throw error;
      setRequest(data);
    } catch (error) {
      console.error("Error fetching visitor request:", error);
    } finally {
      setLoading(false);
    }
  }, [requestId]);

  useEffect(() => {
    fetchRequest();
  }, [fetchRequest]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // 1. UUID를 미리 생성
      const contactId = crypto.randomUUID();

      // 2. contact 정보를 별도 테이블에 저장 (UUID 직접 지정)
      const { error: contactError } = await supabase
        .from("contacts")
        .insert({ 
          id: contactId,
          contact_info: formData.contact,
          contact_type: 'application' 
        });

      if (contactError) throw contactError;

      // 3. contact_id를 사용하여 application 저장
      const { error: applicationError } = await supabase
        .from("local_applications")
        .insert({
          visitor_request_id: requestId,
          interested_location: formData.interestedLocation,
          contact_id: contactId,
          participants: request.participants,
          age_range: formData.age_range,
          gender: formData.gender,
          languages: formData.languages,
        });

      if (applicationError) throw applicationError;

      toast({
        title: "초대가 전송되었습니다!",
        description: "초대장이 전송되었습니다. 외국인을 찾으면 연락처로 연락드립니다.",
      });

      navigate("/");
    } catch (error) {
      console.error("Error submitting response:", error);
      toast({
        title: "오류가 발생했습니다",
        description: "다시 시도해주세요.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30 flex items-center justify-center">
        <p className="text-muted-foreground">로딩 중...</p>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30 flex items-center justify-center">
        <p className="text-muted-foreground">요청을 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          뒤로가기
        </Button>

        <Card className="p-8 border-none bg-card/95 backdrop-blur mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-6">
            {request.title}
          </h1>

          <div className="space-y-4 mb-4">
            <div className="flex items-start gap-3 text-muted-foreground">
              <Calendar className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground mb-1">희망 일시</p>
                <p className="text-foreground">
                  {new Date(request.time).toLocaleString("ko-KR")}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-muted-foreground">
              <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground mb-1">희망 지역</p>
                <p className="text-foreground">{request.location}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-muted-foreground">
              <Users className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground mb-1">인원</p>
                <p className="text-foreground">{request.companion_genders}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 text-muted-foreground">
              <Users className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground mb-1">나이대</p>
                <p className="text-foreground">{request.age_range}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 text-muted-foreground">
              <Languages className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground mb-1">구사 언어</p>
                <p className="text-foreground">{request.languages}</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-8 border-none bg-card/95 backdrop-blur">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            초대 신청하기
          </h2>
          <p className="text-muted-foreground mb-6">
            이 방문자에게 제안하고 싶은 내용을 작성해주세요
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="interestedLocation">제안하는 장소/활동</Label>
              <Textarea
                id="interestedLocation"
                value={formData.interestedLocation}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    interestedLocation: e.target.value,
                  })
                }
                placeholder="추천하는 장소나 활동을 설명해주세요"
                required
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
                placeholder="1~5의 언어 수준을 함께 입력해주세요 (예: 영어 3, 한국어 4, 일본어 5)"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact">연락처</Label>
              <Textarea
                id="contact"
                value={formData.contact}
                onChange={(e) =>
                  setFormData({ ...formData, contact: e.target.value })
                }
                placeholder="예: 전화번호, 인스타그램, 이메일"
                required
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

            <Button
              type="submit"
              className="w-full"
              style={{ background: "var(--gradient-warm)" }}
              disabled={submitting || !privacyAccepted}
            >
              {submitting ? "전송 중..." : "응답 보내기"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default RespondToVisitor;
