import { Card } from "@/components/ui/card";

interface ScoreDisplayProps {
  atsScore: number;
  writingScore: number;
  overallGrade: string;
}

export function ScoreDisplay({ atsScore, writingScore, overallGrade }: ScoreDisplayProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-chart-1";
    if (score >= 60) return "text-chart-3";
    return "text-chart-4";
  };

  const getGradeColor = (grade: string) => {
    if (grade === "A" || grade === "A+") return "text-chart-1 border-chart-1";
    if (grade === "B" || grade === "B+") return "text-chart-2 border-chart-2";
    if (grade === "C" || grade === "C+") return "text-chart-3 border-chart-3";
    return "text-chart-4 border-chart-4";
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div
          className={`inline-flex items-center justify-center rounded-full border-4 ${getGradeColor(overallGrade)} bg-background px-8 py-4`}
          data-testid="text-overall-grade"
        >
          <span className="text-5xl font-bold font-mono">{overallGrade}</span>
        </div>
        <p className="mt-4 text-lg font-semibold">Overall Grade</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <div className="flex flex-col items-center gap-4">
            <div className="flex flex-col items-center">
              <span
                className={`text-5xl font-bold font-mono ${getScoreColor(atsScore)}`}
                data-testid="text-ats-score"
              >
                {atsScore}
              </span>
              <span className="text-2xl font-mono text-muted-foreground">/100</span>
            </div>
            <div className="text-center">
              <p className="font-semibold">ATS Parseability</p>
              <p className="text-sm text-muted-foreground mt-1">
                How well systems can read your resume
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex flex-col items-center gap-4">
            <div className="flex flex-col items-center">
              <span
                className={`text-5xl font-bold font-mono ${getScoreColor(writingScore)}`}
                data-testid="text-writing-score"
              >
                {writingScore}
              </span>
              <span className="text-2xl font-mono text-muted-foreground">/100</span>
            </div>
            <div className="text-center">
              <p className="font-semibold">Writing Quality</p>
              <p className="text-sm text-muted-foreground mt-1">
                Impact and effectiveness of content
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
