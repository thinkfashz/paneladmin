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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const assignments = [
  {
    title: "Quadratic Functions Essay",
    subject: "Math",
    due: "Tomorrow",
    status: "pending" as const,
  },
  {
    title: "Cell Division Lab Report",
    subject: "Biology",
    due: "In 3 days",
    status: "in-progress" as const,
  },
  {
    title: "WWI Primary Sources Analysis",
    subject: "History",
    due: "In 5 days",
    status: "not-started" as const,
  },
  {
    title: "Shakespearean Sonnet",
    subject: "English",
    due: "Yesterday",
    status: "submitted" as const,
  },
  {
    title: "Sorting Algorithm Implementation",
    subject: "CS",
    due: "In 2 days",
    status: "in-progress" as const,
  },
];

const statusConfig = {
  pending: { label: "Pending", variant: "outline" as const },
  "in-progress": { label: "In Progress", variant: "default" as const },
  "not-started": { label: "Not Started", variant: "destructive" as const },
  submitted: { label: "Submitted", variant: "secondary" as const },
};

export function AssignmentStatus() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Assignment Status</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Assignment</TableHead>
              <TableHead className="hidden sm:table-cell">Subject</TableHead>
              <TableHead className="hidden md:table-cell">Due</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assignments.map((a) => (
              <TableRow key={a.title}>
                <TableCell className="font-medium">{a.title}</TableCell>
                <TableCell className="text-muted-foreground hidden text-sm sm:table-cell">
                  {a.subject}
                </TableCell>
                <TableCell className="text-muted-foreground hidden text-sm md:table-cell">
                  {a.due}
                </TableCell>
                <TableCell>
                  <Badge variant={statusConfig[a.status].variant}>
                    {statusConfig[a.status].label}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="pt-4">
        <Button variant="ghost" size="sm" className="ml-auto gap-1">
          View all assignments <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </CardFooter>
    </Card>
  );
}
