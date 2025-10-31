import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ChevronDown, AlertCircle, Info, CheckCircle } from "lucide-react";
import type { ActionItem } from "@shared/schema";

interface ActionItemsProps {
  items: ActionItem[];
}

export function ActionItems({ items }: ActionItemsProps) {
  const sortedItems = [...items].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Action Items</h2>
      <p className="text-muted-foreground">
        Prioritized list of improvements to make your resume stand out
      </p>

      <div className="space-y-3">
        {sortedItems.map((item, idx) => (
          <ActionItemCard key={idx} item={item} index={idx} />
        ))}
      </div>
    </div>
  );
}

function ActionItemCard({ item, index }: { item: ActionItem; index: number }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const PriorityIcon =
    item.priority === "high"
      ? AlertCircle
      : item.priority === "medium"
      ? Info
      : CheckCircle;

  const priorityColor =
    item.priority === "high"
      ? "bg-chart-4/10 text-chart-4 border-chart-4/30"
      : item.priority === "medium"
      ? "bg-chart-3/10 text-chart-3 border-chart-3/30"
      : "bg-chart-1/10 text-chart-1 border-chart-1/30";

  return (
    <Card className="overflow-hidden" data-testid={`card-action-${index}`}>
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 pb-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="rounded-full bg-muted p-1.5 mt-0.5 flex-shrink-0">
            <span className="text-sm font-bold font-mono">{index + 1}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold leading-tight">{item.task}</p>
          </div>
        </div>
        <Badge
          variant="outline"
          className={`capitalize flex-shrink-0 ${priorityColor}`}
          data-testid={`badge-priority-${index}`}
        >
          <PriorityIcon className="h-3 w-3 mr-1" />
          {item.priority}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-3 pt-0">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-between"
          onClick={() => setIsExpanded(!isExpanded)}
          data-testid={`button-expand-action-${index}`}
        >
          <span>{isExpanded ? "Hide" : "Show"} details</span>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
          />
        </Button>

        {isExpanded && (
          <div className="rounded-md bg-muted/50 p-4 text-sm space-y-2">
            <p className="text-muted-foreground whitespace-pre-line">{item.detail}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
