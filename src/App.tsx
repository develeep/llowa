import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CreateInvitation from "./pages/CreateInvitation";
import ApplyVisitor from "./pages/ApplyVisitor";
import InvitationList from "./pages/InvitationList";
import CreateVisitorRequest from "./pages/CreateVisitorRequest";
import VisitorRequestList from "./pages/VisitorRequestList";
import RespondToVisitor from "./pages/RespondToVisitor";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/create-invitation" element={<CreateInvitation />} />
          <Route path="/invitations" element={<InvitationList />} />
          <Route path="/apply/:invitationId" element={<ApplyVisitor />} />
          <Route path="/create-visitor-request" element={<CreateVisitorRequest />} />
          <Route path="/visitor-requests" element={<VisitorRequestList />} />
          <Route path="/respond/:requestId" element={<RespondToVisitor />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
