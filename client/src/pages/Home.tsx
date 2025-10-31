import { useState } from "react";
import { useLocation } from "wouter";
import { FileUpload } from "@/components/FileUpload";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Layout,
  Target,
  FileStack,
  Sparkles,
  CheckCircle2,
  Upload,
  Zap,
  Shield,
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [, setLocation] = useLocation();
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = async (file: File) => {
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await apiRequest("POST", "/api/analyze", formData);
      const result = await response.json();
      
      setLocation(`/results/${result.id}`);
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="All About Resume Logo" className="h-10 w-10" />
            <h1 className="text-xl font-bold">All About Resume</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background">
          <div className="container mx-auto px-4 py-24 md:py-32">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <div className="space-y-4">
                <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
                  Free AI-Powered
                  <br />
                  <span className="text-primary">Resume Analysis</span>
                </h2>
                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                  Get instant feedback on your resume's ATS compatibility, content quality, and overall effectiveness. Built by RDS to help you land your dream job.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>No signup required</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-primary" />
                  <span>Results in seconds</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  <span>100% secure</span>
                </div>
              </div>

              <div className="max-w-2xl mx-auto">
                <FileUpload onFileSelect={handleFileSelect} isUploading={isUploading} />
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto space-y-16">
              <div className="text-center space-y-4">
                <h3 className="text-3xl md:text-4xl font-bold">How It Works</h3>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Our AI evaluates your resume across 16 key checks in 5 categories
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                <Card className="p-6 space-y-4 hover-elevate">
                  <div className="rounded-full bg-primary/10 p-3 w-fit">
                    <Upload className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2">1. Upload Resume</h4>
                    <p className="text-muted-foreground text-sm">
                      Drag and drop your PDF or DOCX file. We support files up to 2MB.
                    </p>
                  </div>
                </Card>

                <Card className="p-6 space-y-4 hover-elevate">
                  <div className="rounded-full bg-primary/10 p-3 w-fit">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2">2. AI Analysis</h4>
                    <p className="text-muted-foreground text-sm">
                      Our AI performs 16 comprehensive checks across 5 key categories instantly.
                    </p>
                  </div>
                </Card>

                <Card className="p-6 space-y-4 hover-elevate">
                  <div className="rounded-full bg-primary/10 p-3 w-fit">
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2">3. Get Feedback</h4>
                    <p className="text-muted-foreground text-sm">
                      Receive detailed scores and actionable tips to improve your resume.
                    </p>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto space-y-12">
              <div className="text-center space-y-4">
                <h3 className="text-3xl md:text-4xl font-bold">What We Check</h3>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Comprehensive analysis across all aspects of your resume
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    icon: FileText,
                    name: "Content",
                    description: "ATS parsing, grammar, quantified achievements, and keyword usage",
                  },
                  {
                    icon: Layout,
                    name: "Format",
                    description: "File type, size, length, bullet points, and readability",
                  },
                  {
                    icon: Target,
                    name: "Skills",
                    description: "Hard skills, soft skills, and industry relevance",
                  },
                  {
                    icon: FileStack,
                    name: "Sections",
                    description: "Contact info, experience, education, and essential sections",
                  },
                  {
                    icon: Sparkles,
                    name: "Style",
                    description: "Design, layout, active voice, and professional tone",
                  },
                ].map((category, idx) => {
                  const Icon = category.icon;
                  return (
                    <Card key={idx} className="p-6 space-y-3">
                      <div className="rounded-lg bg-primary/10 p-2 w-fit">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">{category.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {category.description}
                        </p>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Card className="p-8 md:p-12 bg-gradient-to-br from-primary/5 to-background border-primary/20">
                <div className="space-y-6 text-center">
                  <h3 className="text-3xl md:text-4xl font-bold">
                    Why It Matters
                  </h3>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Most resumes are first screened by Applicant Tracking Systems (ATS) before a human ever sees them. Our tool helps ensure your resume passes ATS filters and impresses recruiters.
                  </p>
                  <div className="grid gap-4 md:grid-cols-2 text-left pt-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                        ATS Compatibility
                      </h4>
                      <p className="text-sm text-muted-foreground pl-7">
                        We simulate how ATS systems parse your resume and identify potential issues
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                        Writing Quality
                      </h4>
                      <p className="text-sm text-muted-foreground pl-7">
                        Get insights on impact, clarity, and professional presentation
                      </p>
                    </div>
                  </div>
                  <Button
                    size="lg"
                    onClick={() => {
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="mt-6"
                    data-testid="button-upload-cta"
                  >
                    Upload Your Resume Now
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-12 bg-muted/30">
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
