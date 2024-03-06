export interface User {
  id?: number;
  email: string;
  fName: string;
  lName: string;
  phone: string;
  roles?: string;
  addresses: {
    id?: number;
    userId?: number;
    houseNumber?: string;
    street?: string;
    city?: string;
    district?: string;
    pincode?: string;
    landmark?: string;
  }
}