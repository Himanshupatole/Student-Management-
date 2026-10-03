export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
}

export interface Student {
  id: string;
  name: string;
  gender: 'Male' | 'Female' | 'Other';
  dob: string;
  yearOfAdmission: number;
  course: string;
  address: Address;
  phone: string;
  email: string;
}
