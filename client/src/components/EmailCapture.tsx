import { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EmailCaptureProps {
  onSubmit: (email: string) => Promise<void>;
}

export function EmailCapture({ onSubmit }: EmailCaptureProps) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(email);
      setIsSubmitted(true);
      toast({
        title: "Email sent!",
        description: "Check your inbox for your detailed resume analysis",
      });
    } catch (error) {
      toast({
        title: "Failed to send email",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <Card className="border-chart-1/50 bg-chart-1/5">
        <CardContent className="flex items-center gap-3 py-6">
          <div className="rounded-full bg-chart-1/20 p-2">
            <CheckCircle2 className="h-6 w-6 text-chart-1" />
          </div>
          <div>
            <p className="font-semibold text-chart-1">Email sent successfully!</p>
            <p className="text-sm text-muted-foreground">
              Check your inbox for your detailed resume report
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <Mail className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">Get Detailed Report via Email</h3>
            <p className="text-sm text-muted-foreground">
              Receive a comprehensive analysis with personalized improvement tips
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="email"
            placeholder="your.email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting}
            className="flex-1"
            data-testid="input-email"
          />
          <Button
            type="submit"
            disabled={isSubmitting}
            data-testid="button-send-email"
          >
            {isSubmitting ? "Sending..." : "Send Report"}
          </Button>
        </form>
        <p className="text-xs text-muted-foreground mt-3">
          We respect your privacy. Your email will only be used to send your resume analysis.
        </p>
      </CardContent>
    </Card>
  );
}
