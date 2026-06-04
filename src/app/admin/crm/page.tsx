import { Button } from "@/components/ui/button";
import { AppointmentCalendar } from "@/fabrick/appointments/components/appointment-calendar";
import { getAppointments } from "@/fabrick/appointments/services/appointment-service";
import { CustomerTable } from "@/fabrick/crm/components/customer-table";
import { getCustomers } from "@/fabrick/crm/services/customer-service";

export const dynamic = "force-dynamic";

export default async function CRMPage() {
  // Simulando obtención del businessId desde el Auth Context.
  const businessId = "00000000-0000-0000-0000-000000000000";
  const [appointments, customers] = await Promise.all([getAppointments(businessId), getCustomers(businessId)]);

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 p-6">
      <section className="flex flex-col justify-between gap-4 rounded-2xl border bg-background p-6 shadow-sm md:flex-row md:items-center">
        <div className="flex flex-col gap-2">
          <p className="font-medium text-muted-foreground text-sm">Administración</p>
          <h1 className="font-semibold text-3xl tracking-tight">CRM y Agenda General</h1>
          <p className="max-w-xl text-muted-foreground">
            Vista global operativa para gestionar la relación con el cliente y sus reservas.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Nuevo Cliente</Button>
          <Button>Agendar Cita</Button>
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-12">
        <section className="flex flex-col gap-4 lg:col-span-8">
          <h2 className="font-semibold text-xl">Directorio de Clientes</h2>
          <CustomerTable customers={customers} />
        </section>

        <section className="flex flex-col gap-4 lg:col-span-4">
          <h2 className="font-semibold text-xl">Próximas Citas</h2>
          <AppointmentCalendar appointments={appointments} />
        </section>
      </div>
    </main>
  );
}
