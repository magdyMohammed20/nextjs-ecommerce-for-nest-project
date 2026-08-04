export interface Product {
  id: number;
  name: string;
  price: number;
  description: string | null;
  quantity: number;
  imageUrl?: string | null;
}

export interface CreateProductPayload {
  name: string;
  price: number;
  description?: string;
  quantity?: number;
  imageUrl?: string;
}

export type UpdateProductPayload = Partial<CreateProductPayload>;
