import { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  Layout,
  Target,
  FileStack,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import type { CategoryResult, Check } from "@shared/schema";

const categoryIcons = {
  content: FileText,
  format: Layout,
  skills: Target,
  sections: FileStack,
  style: Sparkles,
};

interface CategoryResultsProps {
  categories: Record<string, CategoryResult>;
}

export function CategoryResults({ categories }: CategoryResultsProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Detailed Analysis</h2>
      
      <div className="grid gap-4 md:grid-cols-2">
        {Object.entries(categories).map(([key, category]) => (
          <CategoryCard key={key} category={category} categoryKey={key} />
        ))}
      </div>
    </div>
  );
}

function CategoryCard({ category, categoryKey }: { category: CategoryResult; categoryKey: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const Icon = categoryIcons[categoryKey as keyof typeof categoryIcons];
  const passRate = category.totalCount > 0 ? (category.passedCount / category.totalCount) * 100 : 0;

  return (
    <Card className="overflow-hidden" data-testid={`card-category-${categoryKey}`}>
      <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 pb-2">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="rounded-lg bg-primary/10 p-2 flex-shrink-0">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold capitalize">{category.name}</h3>
            <p className="text-sm text-muted-foreground">
              {category.passedCount} / {category.totalCount} checks passed
            </p>
          </div>
        </div>
        <Badge
          variant={passRate >= 80 ? "default" : passRate >= 60 ? "secondary" : "destructive"}
          className="flex-shrink-0"
          data-testid={`badge-category-score-${categoryKey}`}
        >
          {Math.round(passRate)}%
        </Badge>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full transition-all ${
              passRate >= 80
                ? "bg-chart-1"
                : passRate >= 60
                ? "bg-chart-3"
                : "bg-chart-4"
            }`}
            style={{ width: `${passRate}%` }}
          />
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-between"
          onClick={() => setIsExpanded(!isExpanded)}
          data-testid={`button-expand-${categoryKey}`}
        >
          <span>{isExpanded ? "Hide" : "View"} checks</span>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
          />
        </Button>

        {isExpanded && (
          <div className="space-y-2 pt-2 border-t">
            {category.checks.map((check, idx) => (
              <CheckItem key={idx} check={check} index={idx} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function CheckItem({ check, index }: { check: Check; index: number }) {
  const [showImprovement, setShowImprovement] = useState(false);

  const StatusIcon =
    check.status === "pass"
      ? CheckCircle2
      : check.status === "warning"
      ? AlertTriangle
      : XCircle;

  const iconColor =
    check.status === "pass"
      ? "text-chart-1"
      : check.status === "warning"
      ? "text-chart-3"
      : "text-chart-4";

  return (
    <div
      className="space-y-2 rounded-md border p-3 text-sm"
      data-testid={`check-item-${index}`}
    >
      <div className="flex items-start gap-3">
        <StatusIcon className={`h-5 w-5 flex-shrink-0 mt-0.5 ${iconColor}`} />
        <div className="flex-1 min-w-0 space-y-1">
          <p className="font-medium">{check.name}</p>
          <p className="text-muted-foreground">{check.explanation}</p>
          
          {check.improvement && check.status !== "pass" && (
            <Button
              variant="link"
              size="sm"
              className="h-auto p-0 text-primary"
              onClick={() => setShowImprovement(!showImprovement)}
              data-testid={`button-show-improvement-${index}`}
            >
              {showImprovement ? "Hide" : "Show"} how to improve
            </Button>
          )}

          {showImprovement && check.improvement && (
            <div className="mt-2 rounded-md bg-muted/50 p-3 text-sm">
              <p className="font-medium mb-1">How to improve:</p>
              <p className="text-muted-foreground">{check.improvement}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
