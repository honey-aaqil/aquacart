// src/types/Address.ts
export interface Address {
  _id: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault?: boolean;
}
