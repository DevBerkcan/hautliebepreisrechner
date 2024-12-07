export type Pricing = {
  [key: string]: number;
};

export type Treatment = {
  name: string;
  pricing: Pricing;
};

export type Category = {
  [treatmentName: string]: Treatment[]; // Maps treatment categories (e.g., "Kopf | Einzelbehandlung") to a list of treatments
};

export type Service = {
  [categoryName: string]: Category; // Maps service types (e.g., "Haarentfernung") to treatment categories
};

export type GenderPricingData = {
  [gender: string]: Service; // Maps genders (e.g., "Frau" or "Mann") to services
};

export type Gender = "Frau" | "Mann";
