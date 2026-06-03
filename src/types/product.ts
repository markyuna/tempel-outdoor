export type ProductCategory =
  | "spa"
  | "sauna"
  | "baby-foot"
  | "billard"
  | "fitness";

export type ProductStatus = "draft" | "active" | "archived";

export type ProductImage = {
  id: string;
  productId: string;
  url: string;
  alt: string | null;
  isFeatured: boolean;
  position: number;
};

export type ProductOption = {
  id: string;
  productId: string;
  name: string;
  values: string[];
  required: boolean;
  position: number;
};

export type ProductSpecItem = {
  id: string;
  sectionId: string;
  label: string | null;
  value: string;
  position: number;
};

export type ProductSpecSection = {
  id: string;
  productId: string;
  title: string;
  position: number;
  items: ProductSpecItem[];
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string | null;
  description: string | null;
  category: ProductCategory;
  price: number;
  compareAtPrice: number | null;
  featured: boolean;
  status: ProductStatus;
  stock: number;
  deliveryTime: string | null;
  warranty: string | null;
  images: ProductImage[];
  options: ProductOption[];
  specSections: ProductSpecSection[];
  createdAt: string;
  updatedAt: string;
};