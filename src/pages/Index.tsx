import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Users, FileText } from "lucide-react";
import llowa_logo from "@/../public/llowa_icon.png";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30">
      {/* Header */}
      <div className="bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="px-4 py-4">
          <h1 className="text-2xl font-bold text-foreground text-center">
            <div className="flex flex-col justify-center items-center">
              <img src={llowa_logo} alt="LOWA" className=" h-full max-h-32 w-auto" />
              <p className="text-xs sm:text-sm text-muted-foreground text-center mt-3 sm:max-w-md px-2 leading-relaxed break-keep">
                안녕하세요! 저희는 삼성청년SW·AI아카데미의 창업팀 LOWA입니다. 외국인과 현지인의 문화교류 플랫폼 서비스 LOWA의 창업을 위해 시범 운영 중입니다. 많은 참여 부탁드립니다.
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground text-center mt-3 sm:max-w-md px-2 leading-relaxed break-keep">문의사항 연락처 : <span className="text-primary">llowa.official@gmail.com</span></p>
            </div>
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-8 pb-24 max-w-md mx-auto">
        <h2 className="text-lg font-semibold text-foreground mb-6 text-center">
          <span className="text-primary">로컬</span> 서비스 이용하기 (한국인)
        </h2>

        <div className="space-y-4">
          {/* Create Invitation Button */}
          <Card
            className="p-8 active:scale-[0.98] transition-all duration-200 cursor-pointer border-2 border-primary/20 bg-card/95 backdrop-blur hover:border-primary/40"
            onClick={() => navigate("/create-invitation")}
          >
            <div className="text-center space-y-3">
              <div className="w-16 h-16 rounded-full flex items-center justify-center bg-primary/10 mx-auto">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-2">초대장 작성</h3>
                <p className="text-xs text-muted-foreground text-center sm:text-sm px-2 leading-relaxed break-keep">
                  원하는 시간, 장소, 활동 등을 적어 방문자를 초대 해 보세요. 초대에 맞는 방문자를 찾으면 작성해 주신 연락처로 연락드립니다.
                </p>
              </div>
            </div>
          </Card>

          {/* Visitor Requests Button */}
          <Card
            className="p-8 active:scale-[0.98] transition-all duration-200 cursor-pointer border-2 border-primary/20 bg-card/95 backdrop-blur hover:border-primary/40"
            onClick={() => navigate("/visitor-requests")}
          >
            <div className="text-center space-y-3">
              <div className="w-16 h-16 rounded-full flex items-center justify-center bg-primary/10 mx-auto">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-2">방문자 요청 확인</h3>
                <p className="text-sm text-muted-foreground">
                  방문자의 원하는 시간, 장소, 활동 등을 확인하고 초대 신청 해 보세요
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
