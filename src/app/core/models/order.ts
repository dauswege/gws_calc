/* eslint-disable @typescript-eslint/no-unused-vars */

import { OrderItem } from './order-item';

export type OrderKind = 'table' | 'bar' | 'takeaway' | 'custom';

export interface Order {
  id: string;
  label: string;
  kind: OrderKind;
  items: OrderItem[];
  checkoutTotalOverride?: number;
  receivedAmount?: number;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export interface CreateOrderInput {
  label?: string;
  kind?: OrderKind;
  notes?: string;
  items?: OrderItem[];
  activate?: boolean;
}

export interface OrdersStorageV1 {
  version: 1;
  activeOrderId: string | null;
  orders: Order[];
}


