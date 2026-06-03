export type CustomerStatus = "new" | "active" | "inactive" | "lead";

export type Customer = {
  id: string;
  business_id: string;
  name: string;
  phone?: string | null;
  email?: string | null;
  notes?: string | null;
  source?: string | null;
  status: CustomerStatus;
  tags?: string[] | null;
  last_visit_at?: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateCustomerInput = Omit<Customer, "id" | "created_at" | "updated_at">;

export type UpdateCustomerInput = Partial<CreateCustomerInput> & {
  id: string;
};
