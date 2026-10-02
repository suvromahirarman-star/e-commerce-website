export type AdminRole = 'admin' | 'super_admin';

export interface AdminPayload {
  id: string;
  email: string;
  role: AdminRole;
  name: string;
}

export type ProductStatus = 'draft' | 'published' | 'archived';

export type OrderStatus =
  | 'Pending'
  | 'Processing'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled'
  | 'Returned';

export type PaymentStatus = 'Pending' | 'Paid' | 'Failed' | 'Refunded';

export type CouponType = 'percentage' | 'fixed';

export type ReviewStatus = 'Pending' | 'Approved' | 'Rejected';

export interface OrderItemRecord {
  id?: string;
  orderId?: string;
  productId: string;
  productNameSnapshot: string;
  skuSnapshot: string;
  unitPrice: number;
  price?: number;
  quantity: number;
  lineTotal: number;
  selectedColor?: string | null;
  selectedSize?: string | null;
  color?: string | null;
  size?: string | null;
  image?: string;
  name?: string;
}

export interface OrderRecord {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  customerApartment?: string | null;
  customerCity: string;
  customerDivision: string;
  customerPostalCode: string;
  deliveryNotes?: string | null;
  subtotal: number;
  discountAmount: number;
  deliveryFee: number;
  shippingFee?: number;
  totalAmount: number;
  total?: number;
  couponId?: string | null;
  couponCode?: string | null;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  paymentDetails?: any;
  deliveredAt?: string | null;
  createdAt: string;
  updatedAt: string;
  customer?: any;
  shippingAddress?: any;
  items?: OrderItemRecord[];
  pricing?: any;
}
