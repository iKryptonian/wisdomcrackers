export interface Product {
  category: any;
  id: number;
  name: string;
  content: string;
  image: string;
  images?: string[];
  actualPrice: number;
  price: number;
  unit: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CustomerDetails {
  name: string;
  mobile: string;
  email: string; // If you want email to be optional, you can change this to `email?: string;`
  address: string;
  city: string;
  state: string;
  pincode: string; 
}

export type PageView = 'home' | 'invoice' | 'admin';