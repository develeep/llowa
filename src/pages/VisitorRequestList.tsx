import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Calendar, MapPin, Users, Languages } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type VisitorRequest = Tables<"visitor_requests">;

const VisitorRequestList = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<VisitorRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from("visitor_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error("Error fetching visitor requests:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          홈으로
        </Button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            방문자 요청 목록
          </h1>
          <p className="text-muted-foreground">
            방문자들의 원하는 시간, 장소, 활동 등을 확인하고 초대 신청 해 보세요
          </p>
          <p className="text-muted-foreground text-xs">
            현재 번역 기능은 제공되지 않으며 빠른 시일 내에 추가 예정입니다.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">로딩 중...</p>
          </div>
        ) : requests.length === 0 ? (
          <Card className="p-12 text-center border-none bg-card/95 backdrop-blur">
            <p className="text-muted-foreground text-lg">
              아직 요청이 없습니다.
            </p>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {requests.map((request) => (
              <Card
                key={request.id}
                className="p-6 hover:shadow-xl transition-all duration-300 border-none bg-card/95 backdrop-blur cursor-pointer"
                onClick={() => navigate(`/respond/${request.id}`)}
              >
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  {request.title}
                </h3>

                <div className="space-y-3 mb-4">
                  <div className="flex items-start gap-3 text-muted-foreground">
                    <Calendar className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <span>
                      {new Date(request.time).toLocaleString("ko-KR")}
                    </span>
                  </div>

                  <div className="flex items-start gap-3 text-muted-foreground">
                    <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <span>{request.location}</span>
                  </div>

                  <div className="flex items-start gap-3 text-muted-foreground">
                    <Users className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <span>{request.companion_genders}</span>
                  </div>
                  <div className="flex items-start gap-3 text-muted-foreground">
                  <Users className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <span>{request.age_range} 나이대</span>
                  </div>

                  <div className="flex items-start gap-3 text-muted-foreground">
                    <Languages className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <span>{request.languages}</span>
                  </div>
                </div>

                <Button
                  className="w-full"
                  style={{ background: "var(--gradient-warm)" }}
                >
                  초대하기
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VisitorRequestList;
