export type AppointmentStatus = "pending" | "confirmed" | "completed" | "cancelled" | "no_show";

export type Appointment = {
  id: string;
  business_id: string;
  customer_id?: string | null;
  service_id?: string | null;
  starts_at: string;
  ends_at?: string | null;
  status: AppointmentStatus;
  notes?: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateAppointmentInput = Omit<Appointment, "id" | "created_at" | "updated_at">;

export type UpdateAppointmentInput = Partial<CreateAppointmentInput> & {
  id: string;
};
