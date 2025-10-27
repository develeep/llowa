import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, Calendar, MapPin, Activity, Users, Languages } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Invitation = Tables<"invitations">;

const ApplyVisitor = () => {
  const navigate = useNavigate();
  const { invitationId } = useParams();
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [formData, setFormData] = useState({
    participants: 1,
    interested_location: "",
    contact: "",
  });
  const [loading, setLoading] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  const fetchInvitation = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("invitations")
        .select("*")
        .eq("id", invitationId)
        .single();

      if (error) throw error;
      setInvitation(data);
    } catch (error) {
      console.error("Error fetching invitation:", error);
      toast.error("Unable to load invitation.");
      navigate("/invitations");
    }
  }, [invitationId, navigate]);

  useEffect(() => {
    if (invitationId) {
      fetchInvitation();
    }
  }, [invitationId, fetchInvitation]);

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
          contact_type: 'application' 
        });

      if (contactError) throw contactError;

      // 3. contact_id를 사용하여 application 저장
      const { error: applicationError } = await supabase
        .from("applications")
        .insert({
          invitation_id: invitationId,
          participants: formData.participants,
          interested_location: formData.interested_location,
          contact_id: contactId,
        });

      if (applicationError) throw applicationError;

      toast.success("Application submitted successfully!");
      navigate("/invitations");
    } catch (error) {
      console.error("Error creating application:", error);
      toast.error("Failed to submit application.");
    } finally {
      setLoading(false);
    }
  };

  if (!invitation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30 flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate("/invitations")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to List
        </Button>

        <Card className="p-6 md:p-8 mb-6 shadow-lg border-none bg-card/95 backdrop-blur">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            {invitation.title}
          </h2>
          
          <div className="space-y-3 mb-4">
            <div className="flex items-start gap-3 text-muted-foreground">
              <Calendar className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground">Time</p>
                <p className="text-foreground">{new Date(invitation.time).toLocaleString("en-US")}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-muted-foreground">
              <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="text-foreground">{invitation.location}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-muted-foreground">
              <Activity className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground">Activity</p>
                <p className="text-foreground">{invitation.activity}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-muted-foreground">
              <Users className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground">Max Participants</p>
                <p className="text-foreground">{invitation.max_participants} people</p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-muted-foreground">
              <Languages className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground">Languages</p>
                <p className="text-foreground">{invitation.languages}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
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
        </Card>

        <Card className="p-6 md:p-8 shadow-lg border-none bg-card/95 backdrop-blur">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Apply for Visit
            </h1>
            <p className="text-muted-foreground">
              Ready to join? Fill out your application
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="participants">Number of People</Label>
              <Input
                id="participants"
                type="number"
                min="1"
                max={invitation.max_participants}
                value={formData.participants}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    participants: parseInt(e.target.value),
                  })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="interested_location">Interested Places</Label>
              <Input
                id="interested_location"
                value={formData.interested_location}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    interested_location: e.target.value,
                  })
                }
                required
                placeholder="e.g. Traditional markets, cafe streets, etc."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact">Contact Information</Label>
              <Input
                id="contact"
                value={formData.contact}
                onChange={(e) =>
                  setFormData({ ...formData, contact: e.target.value })
                }
                required
                placeholder="e.g., Phone, Instagram, Email"
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
                    I agree to the Privacy Policy (Required)
                  </label>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        type="button" 
                        variant="link" 
                        className="h-auto p-0 text-xs text-primary"
                      >
                        View Privacy Policy
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Privacy Policy</DialogTitle>
                      </DialogHeader>
                      <div className="mt-4">
                        <iframe
                          src="/privacy.html"
                          className="w-full h-[60vh] border-0"
                          title="Privacy Policy"
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading || !privacyAccepted}
              className="w-full h-12 text-base font-semibold"
              style={{ background: "var(--gradient-warm)" }}
            >
              {loading ? "Submitting..." : "Submit Application"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ApplyVisitor;
