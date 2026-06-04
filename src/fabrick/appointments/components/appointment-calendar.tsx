import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { Appointment } from "../types";

type AppointmentCalendarProps = {
  appointments: Appointment[];
};

export function AppointmentCalendar({ appointments }: AppointmentCalendarProps) {
  if (appointments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border bg-muted/20 p-8 text-center">
        <h3 className="font-semibold text-lg">Agenda Libre</h3>
        <p className="mt-1 text-muted-foreground text-sm">No tienes citas programadas para mostrar.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {appointments.map((appointment) => {
        const dateObj = new Date(appointment.starts_at);
        return (
          <Card key={appointment.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle className="text-lg">
                    {dateObj.toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "short" })}
                  </CardTitle>
                  <p className="mt-1 font-medium text-muted-foreground text-sm">
                    {dateObj.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
                <Badge variant={appointment.status === "confirmed" ? "default" : "secondary"}>
                  {appointment.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-muted-foreground text-sm">
                <div className="flex justify-between border-b pb-2">
                  <span>Cliente ID:</span>
                  <span className="max-w-[120px] truncate" title={appointment.customer_id || "N/A"}>
                    {appointment.customer_id || "Sin asignar"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Servicio ID:</span>
                  <span className="max-w-[120px] truncate" title={appointment.service_id || "N/A"}>
                    {appointment.service_id || "N/A"}
                  </span>
                </div>
                {appointment.notes && <div className="mt-2 border-t pt-2 text-xs italic">"{appointment.notes}"</div>}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
