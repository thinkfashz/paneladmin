export type Product = {
  id: string;
  business_id: string;
  name: string;
  description?: string | null;
  price: number;
  image_url?: string | null;
  category?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type CreateProductInput = Omit<Product, "id" | "created_at" | "updated_at">;

export type UpdateProductInput = Partial<CreateProductInput> & {
  id: string;
};
