import type { Product } from "@/data/demo-menu";
import type { CartItem } from "@/lib/pricing";
/** Future adapter contracts only. No live or sandbox Square connection is implemented. */
export interface CatalogGateway {
  sync(): Promise<Product[]>;
}
export interface OrderGateway {
  create(input: {
    items: CartItem[];
    idempotencyKey: string;
  }): Promise<{ id: string }>;
  status(id: string): Promise<string>;
}
export interface PaymentGateway {
  confirm(input: {
    orderId: string;
    token: string;
    idempotencyKey: string;
  }): Promise<{ id: string; status: string }>;
}
export interface WebhookVerifier {
  verify(
    rawBody: string,
    signature: string,
    notificationUrl: string,
  ): Promise<boolean>;
}
