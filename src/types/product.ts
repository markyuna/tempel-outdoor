export type ProductStatus = "active" | "draft" | "archived";

export type ProductMediaType = "image" | "video";

export interface ProductMedia {
  id: string;
  product_id: string;
  url: string;
  type: ProductMediaType;
  alt: string | null;
  is_featured: boolean;
  position: number;
  created_at?: string;
}

export interface ProductOption {
  id: string;
  product_id: string;
  name: string;
  values: string[];
  required: boolean;
  position: number;
  created_at?: string;
}

export interface ProductSpecSection {
  id: string;
  product_id: string;
  title: string;
  position: number;
  created_at?: string;
  items?: ProductSpecItem[];
}

export interface ProductSpecItem {
  id: string;
  section_id: string;
  label: string | null;
  value: string;
  position: number;
  created_at?: string;
}

export interface Product {
  id: string;

  slug: string;
  name: string;

  universe: string | null;
  category: string | null;

  short_description: string | null;
  description: string | null;

  price: number;
  compare_at_price: number | null;

  featured: boolean;
  status: ProductStatus;

  stock: number;
  delivery_time: string | null;
  warranty: string | null;

  media?: ProductMedia[];
  options?: ProductOption[];
  spec_sections?: ProductSpecSection[];

  created_at?: string;
  updated_at?: string;
}

export interface CreateProductInput {
  slug: string;
  name: string;

  universe?: string;
  category?: string;

  short_description?: string;
  description?: string;

  price: number;
  compare_at_price?: number;

  featured?: boolean;
  status?: ProductStatus;

  stock?: number;
  delivery_time?: string;
  warranty?: string;
}

export interface UpdateProductInput extends Partial<CreateProductInput> {
  id: string;
}