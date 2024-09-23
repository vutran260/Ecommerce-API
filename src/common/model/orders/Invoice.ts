export interface CreateInvoiceRequest {
  id: number;
  orderId: number;
  invoiceDate: Date;
  totalAmount: number;
  taxAmount: number;
  toEmail: string;
}
