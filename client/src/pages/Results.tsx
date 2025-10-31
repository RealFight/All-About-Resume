import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ScoreDisplay } from "@/components/ScoreDisplay";
import { CategoryResults } from "@/components/CategoryResults";
import { ActionItems } from "@/components/ActionItems";
import { EmailCapture } from "@/components/EmailCapture";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { AnalysisResult } from "@shared/schema";

export default function Results() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();

  const { data, isLoading, error } = useQuery<{ analysis: AnalysisResult }>({
    queryKey: ["/api/results", id],
  });

  const handleEmailSubmit = async (email: string) => {
    await apiRequest("POST", `/api/results/${id}/email`, { email });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg text-muted-foreground">Loading your results...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="rounded-full bg-destructive/10 p-4 w-fit mx-auto">
            <FileText className="h-12 w-12 text-destructive" />
          </div>
          <h2 className="text-2xl font-bold">Results Not Found</h2>
          <p className="text-muted-foreground">
            The analysis you're looking for doesn't exist or has expired.
          </p>
          <Button onClick={() => setLocation("/")} data-testid="button-back-home">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const analysis = data.analysis;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation("/")}
              data-testid="button-back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="All About Resume Logo" className="h-10 w-10" />
              <h1 className="text-xl font-bold">Resume Analysis Results</h1>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-12">
          <section>
            <ScoreDisplay
              atsScore={analysis.atsScore}
              writingScore={analysis.writingScore}
              overallGrade={analysis.overallGrade}
            />
          </section>

          <section>
            <CategoryResults categories={analysis.categories} />
          </section>

          <section>
            <ActionItems items={analysis.actionItems} />
          </section>

          <section>
            <EmailCapture onSubmit={handleEmailSubmit} />
          </section>

          <div className="text-center pt-8 border-t">
            <Button
              variant="outline"
              onClick={() => setLocation("/")}
              data-testid="button-analyze-another"
            >
              Analyze Another Resume
            </Button>
          </div>
        </div>
      </main>

      <footer className="border-t py-12 bg-muted/30 mt-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="All About Resume Logo" className="h-8 w-8" />
              <div>
                <p className="font-semibold">All About Resume</p>
                <p className="text-sm text-muted-foreground">
                  Built by RDS to help job seekers succeed
                </p>
              </div>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">
                About
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
