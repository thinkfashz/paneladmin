export type BusinessStatus = "demo" | "active" | "expired" | "blocked";

export type BusinessType =
  | "generic"
  | "beauty"
  | "barber"
  | "food"
  | "hardware"
  | "dental"
  | "real-estate"
  | "construction";

export type Business = {
  id: string;
  name: string;
  slug: string;
  type: BusinessType;
  status: BusinessStatus;
  owner_user_id?: string | null;
  demo_expires_at?: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateBusinessInput = Omit<Business, "id" | "created_at" | "updated_at">;

export type UpdateBusinessInput = Partial<CreateBusinessInput> & {
  id: string;
};
