export interface MailOptions {
  to: string;
  subject: string;
  text?: string;
  templateName: string;
  params?: TemplateParams;
}

export interface TemplateParams {
  [key: string]: string | number | boolean | object;
}

export interface OrderSuccessOptions extends MailOptions {
  params: {
    buyerFirstNameKanji: string;
    buyerLastNameKanji: string;
    companyName: string;
    orderId: string | number;
    orderCreatedAt: string;
    products: {
      productName: string;
      unitPrice: string;
      quantity: number;
      subTotal: string;
    }[];
    subTotal: number | string;
    shippingCode: number | string;
    total: number | string;
    postCode: string;
    address: string;
    phoneNumber: string;
  };
}
