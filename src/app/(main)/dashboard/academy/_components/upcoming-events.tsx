import { addDays, format } from "date-fns";
import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const now = new Date();

const events = [
  {
    title: "Math Mid-term Exam",
    date: addDays(now, 2),
    type: "Exam",
    color: "destructive" as const,
  },
  {
    title: "Science Fair Submissions",
    date: addDays(now, 4),
    type: "Deadline",
    color: "outline" as const,
  },
  {
    title: "Parent-Teacher Conference",
    date: addDays(now, 7),
    type: "Meeting",
    color: "secondary" as const,
  },
  {
    title: "Final Project Presentations",
    date: addDays(now, 14),
    type: "Event",
    color: "default" as const,
  },
];

export function UpcomingEvents() {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Upcoming Events</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 space-y-3">
        {events.map((event) => (
          <div
            key={event.title}
            className="flex items-center justify-between gap-2"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{event.title}</p>
              <p className="text-muted-foreground text-xs">
                {format(event.date, "MMM d, yyyy")}
              </p>
            </div>
            <Badge variant={event.color} className="shrink-0 text-xs">
              {event.type}
            </Badge>
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <Button variant="ghost" size="sm" className="ml-auto gap-1">
          View calendar <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </CardFooter>
    </Card>
  );
}
