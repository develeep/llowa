import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Calendar, MapPin, Activity, Users, Languages } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Invitation = Tables<"invitations">;

const InvitationList = () => {
  const navigate = useNavigate();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvitations();
  }, []);

  const fetchInvitations = async () => {
    try {
      const { data, error } = await supabase
        .from("invitations")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setInvitations(data || []);
    } catch (error) {
      console.error("Error fetching invitations:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Local Invitations
          </h1>
          <p className="text-lg text-muted-foreground">
            Browse invitations from local guides
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        ) : invitations.length === 0 ? (
          <Card className="p-12 text-center border-none bg-card/95 backdrop-blur">
            <p className="text-muted-foreground text-lg">
              No invitations available yet.
            </p>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {invitations.map((invitation) => (
              <Card
                key={invitation.id}
                className="p-6 hover:shadow-xl transition-all duration-300 border-none bg-card/95 backdrop-blur cursor-pointer"
                onClick={() => navigate(`/apply/${invitation.id}`)}
              >
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  {invitation.title}
                </h3>

                <div className="space-y-3 mb-4">
                  <div className="flex items-start gap-3 text-muted-foreground">
                    <Calendar className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <span>
                      {new Date(invitation.time).toLocaleString("en-US")}
                    </span>
                  </div>

                  <div className="flex items-start gap-3 text-muted-foreground">
                    <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <span>{invitation.location}</span>
                  </div>

                  <div className="flex items-start gap-3 text-muted-foreground">
                    <Activity className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <span className="line-clamp-2">{invitation.activity}</span>
                  </div>

                  <div className="flex items-start gap-3 text-muted-foreground">
                    <Users className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <span>Max {invitation.max_participants} people</span>
                  </div>

                  <div className="flex items-start gap-3 text-muted-foreground">
                    <Languages className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <span>{invitation.languages}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary">
                    {invitation.age_range} years
                  </Badge>
                  <Badge variant="secondary" className="capitalize">
                    {invitation.gender}
                  </Badge>
                  {invitation.preferred_gender !== "any" && (
                    <Badge variant="outline" className="capitalize">
                      Prefers {invitation.preferred_gender}
                    </Badge>
                  )}
                  {invitation.preferred_age_range !== "any" && (
                    <Badge variant="outline">
                      Prefers {invitation.preferred_age_range}
                    </Badge>
                  )}
                </div>

                <Button
                  className="w-full"
                  style={{ background: "var(--gradient-warm)" }}
                >
                  Apply Now
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InvitationList;
