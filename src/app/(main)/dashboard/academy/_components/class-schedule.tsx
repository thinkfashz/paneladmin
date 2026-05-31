import { format, setHours, setMinutes } from "date-fns";
import { ArrowRight, Clock } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const today = new Date();

const schedule = [
  {
    subject: "Algebra II",
    teacher: "Ms. Rivera",
    initials: "MR",
    start: setMinutes(setHours(today, 8), 0),
    end: setMinutes(setHours(today, 8), 50),
    room: "Room 204",
    status: "completed" as const,
    progress: 100,
  },
  {
    subject: "Biology",
    teacher: "Mr. Thompson",
    initials: "MT",
    start: setMinutes(setHours(today, 9), 0),
    end: setMinutes(setHours(today, 9), 50),
    room: "Lab 3",
    status: "in-progress" as const,
    progress: 65,
  },
  {
    subject: "World History",
    teacher: "Dr. Kim",
    initials: "DK",
    start: setMinutes(setHours(today, 10), 10),
    end: setMinutes(setHours(today, 11), 0),
    room: "Room 112",
    status: "upcoming" as const,
    progress: 0,
  },
  {
    subject: "English Literature",
    teacher: "Ms. Patel",
    initials: "MP",
    start: setMinutes(setHours(today, 11), 10),
    end: setMinutes(setHours(today, 12), 0),
    room: "Room 305",
    status: "upcoming" as const,
    progress: 0,
  },
  {
    subject: "Physical Education",
    teacher: "Coach Davis",
    initials: "CD",
    start: setMinutes(setHours(today, 13), 0),
    end: setMinutes(setHours(today, 13), 50),
    room: "Gymnasium",
    status: "upcoming" as const,
    progress: 0,
  },
  {
    subject: "Computer Science",
    teacher: "Mr. Nguyen",
    initials: "MN",
    start: setMinutes(setHours(today, 14), 0),
    end: setMinutes(setHours(today, 14), 50),
    room: "Lab 1",
    status: "upcoming" as const,
    progress: 0,
  },
];

const statusConfig = {
  completed: { label: "Completed", variant: "secondary" as const },
  "in-progress": { label: "In Progress", variant: "default" as const },
  upcoming: { label: "Upcoming", variant: "outline" as const },
};

export function ClassSchedule() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Today&apos;s Class Schedule</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Subject</TableHead>
              <TableHead className="hidden sm:table-cell">Teacher</TableHead>
              <TableHead className="hidden md:table-cell">Time</TableHead>
              <TableHead className="hidden lg:table-cell">Room</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden xl:table-cell">Progress</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {schedule.map((cls) => (
              <TableRow key={cls.subject}>
                <TableCell className="font-medium">{cls.subject}</TableCell>
                <TableCell className="hidden sm:table-cell">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-7 w-7 text-xs">
                      <AvatarFallback>{cls.initials}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{cls.teacher}</span>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex items-center gap-1 text-sm">
                    <Clock className="text-muted-foreground h-3.5 w-3.5" />
                    {format(cls.start, "h:mm a")} – {format(cls.end, "h:mm a")}
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground hidden text-sm lg:table-cell">
                  {cls.room}
                </TableCell>
                <TableCell>
                  <Badge variant={statusConfig[cls.status].variant}>
                    {statusConfig[cls.status].label}
                  </Badge>
                </TableCell>
                <TableCell className="hidden xl:table-cell">
                  {cls.status !== "upcoming" ? (
                    <div className="flex items-center gap-2">
                      <Progress value={cls.progress} className="h-1.5 w-20" />
                      <span className="text-muted-foreground text-xs">
                        {cls.progress}%
                      </span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-xs">—</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="pt-4">
        <Button variant="ghost" size="sm" className="ml-auto gap-1">
          Full schedule <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </CardFooter>
    </Card>
  );
}
