import { TrendingDown, TrendingUp } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const subjects = [
  {
    name: "Mathematics",
    score: 88,
    change: +4,
    grade: "B+",
  },
  {
    name: "Science",
    score: 92,
    change: +7,
    grade: "A",
  },
  {
    name: "English",
    score: 75,
    change: -2,
    grade: "C+",
  },
  {
    name: "History",
    score: 81,
    change: +1,
    grade: "B",
  },
  {
    name: "Computer Science",
    score: 95,
    change: +10,
    grade: "A+",
  },
  {
    name: "Physical Education",
    score: 70,
    change: -3,
    grade: "C",
  },
];

export function PerformanceHighlights() {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Performance Highlights</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        {subjects.map((subject) => (
          <div key={subject.name} className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{subject.name}</span>
                {subject.change > 0 ? (
                  <span className="flex items-center gap-0.5 text-xs text-green-600">
                    <TrendingUp className="h-3 w-3" />
                    +{subject.change}%
                  </span>
                ) : (
                  <span className="flex items-center gap-0.5 text-xs text-red-500">
                    <TrendingDown className="h-3 w-3" />
                    {subject.change}%
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-xs">
                  {subject.score}/100
                </span>
                <span className="w-7 text-right text-xs font-semibold">
                  {subject.grade}
                </span>
              </div>
            </div>
            <Progress value={subject.score} className="h-1.5" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
