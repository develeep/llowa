import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";

const CreateVisitorRequest = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    time: "",
    location: "",
    participants: 1,
    contact: "",
    age_range: "20s",
    gender: "any",
    languages: "",
    preferred_gender: "any",
    preferred_age_range: "any",
    companion_genders: "",
  });

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
          contact_type: 'visitor_request' 
        });

      if (contactError) throw contactError;

      // 3. contact_id를 사용하여 visitor_request 저장
      const { contact, ...requestData } = formData;
      const { error: requestError } = await supabase
        .from("visitor_requests")
        .insert({ 
          ...requestData,
          contact_id: contactId 
        });

      if (requestError) throw requestError;

      toast({
        title: "Request submitted successfully!",
        description: "Local guides will contact you soon.",
      });

      navigate("/invitations");
    } catch (error) {
      console.error("Error creating visitor request:", error);
      toast({
        title: "Error occurred",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <Card className="p-8 border-none bg-card/95 backdrop-blur">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Create Visitor Request
          </h1>
          <p className="text-muted-foreground mb-8">
            Describe your desired travel experience
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="e.g. Seoul Local Food Tour"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Desired Date & Time</Label>
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
              <Label htmlFor="location">Desired Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                placeholder="e.g. Seoul Gangnam District"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="activity">Activity Details</Label>
              <Textarea
                id="activity"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Describe what you'd like to experience"
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age_range">My Age Range</Label>
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
                    <SelectItem value="20s">20s</SelectItem>
                    <SelectItem value="30s">30s</SelectItem>
                    <SelectItem value="40s">40s</SelectItem>
                    <SelectItem value="50+">50+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">My Gender</Label>
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
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="any">Any</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="languages">Languages Spoken</Label>
              <Input
                id="languages"
                value={formData.languages}
                onChange={(e) =>
                  setFormData({ ...formData, languages: e.target.value })
                }
                required
                placeholder="e.g., English, Korean, Japanese"
              />
            </div>

            <div className="border-t pt-6 mt-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Preferred Local Guide</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="preferred_gender">Preferred Gender</Label>
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
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="any">Any</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preferred_age_range">Preferred Age Range</Label>
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
                      <SelectItem value="20s">20s</SelectItem>
                      <SelectItem value="30s">30s</SelectItem>
                      <SelectItem value="40s">40s</SelectItem>
                      <SelectItem value="50+">50+</SelectItem>
                      <SelectItem value="any">Any</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="participants">Number of Companions</Label>
                <Input
                  id="participants"
                  type="number"
                  min="1"
                  max="20"
                  value={formData.participants}
                  onChange={(e) =>
                    setFormData({ ...formData, participants: parseInt(e.target.value) })
                  }
                  placeholder="How many people?"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="companion_genders">Companion Genders</Label>
                <Input
                  id="companion_genders"
                  value={formData.companion_genders}
                  onChange={(e) =>
                    setFormData({ ...formData, companion_genders: e.target.value })
                  }
                  placeholder="e.g. 2 males, 1 female"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact">Contact Information</Label>
              <Textarea
                id="contact"
                value={formData.contact}
                onChange={(e) =>
                  setFormData({ ...formData, contact: e.target.value })
                }
                placeholder="e.g., Phone, Instagram, Email"
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

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/invitations")}
                className="flex-1"
              >
                Browse Invitations
              </Button>
              <Button
                type="submit"
                className="flex-1"
                style={{ background: "var(--gradient-warm)" }}
                disabled={loading || !privacyAccepted}
              >
                {loading ? "Submitting..." : "Submit Request"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default CreateVisitorRequest;
