import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Users, MapPinned, Heart, FileText } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="px-4 py-4">
          <h1 className="text-2xl font-bold text-foreground text-center">
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "var(--gradient-warm)" }}
            >
              LOWA
            </span>
          </h1>
          <p className="text-sm text-muted-foreground text-center mt-1">
            Share unique experiences
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-8 pb-24 max-w-md mx-auto">
        <h2 className="text-lg font-semibold text-foreground mb-6 text-center">
          Choose your role
        </h2>

        <div className="space-y-4">
          {/* Local Guide Button */}
          <Card
            className="p-8 active:scale-[0.98] transition-all duration-200 cursor-pointer border-2 border-primary/20 bg-card/95 backdrop-blur hover:border-primary/40"
            onClick={() => navigate("/create-invitation")}
          >
            <div className="text-center space-y-3">
              <div className="w-16 h-16 rounded-full flex items-center justify-center bg-primary/10 mx-auto">
                <MapPinned className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-2">로컬 가이드</h3>
                <p className="text-sm text-muted-foreground">
                  여행자에게 특별한 경험을 제안하고<br />함께 시간을 보내세요
                </p>
              </div>
              <div className="pt-2 space-y-2 text-xs text-muted-foreground">
                <p>• 초대장 작성</p>
                <p>• 비지터 요청 확인</p>
              </div>
            </div>
          </Card>

          {/* Visitor Button */}
          <Card
            className="p-8 active:scale-[0.98] transition-all duration-200 cursor-pointer border-2 border-primary/20 bg-card/95 backdrop-blur hover:border-primary/40"
            onClick={() => navigate("/create-visitor-request")}
          >
            <div className="text-center space-y-3">
              <div className="w-16 h-16 rounded-full flex items-center justify-center bg-primary/10 mx-auto">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-2">Visitor</h3>
                <p className="text-sm text-muted-foreground">
                  Request unique local experiences<br />and connect with guides
                </p>
              </div>
              <div className="pt-2 space-y-2 text-xs text-muted-foreground">
                <p>• Create requests</p>
                <p>• Browse invitations</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
