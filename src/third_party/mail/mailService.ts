import nodemailer, { Transporter } from 'nodemailer';
import { mailConfig } from '../../Config';
import Logger from '../../lib/core/Logger';
import path from 'path';
import handlebars from 'handlebars';
import fs from 'fs';

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

export interface OrderSubscriptionSuccessOptions extends MailOptions {
  params: {
    buyerFirstNameKanji: string;
    buyerLastNameKanji: string;
    companyName: string;
    orderId: string | number;
    orderCreatedAt: string;
    nextDeliveryDate: string;
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

export class MailService {
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport(mailConfig);
  }

  public async sendMail(options: MailOptions): Promise<void> {
    const mailOptions = {
      from: `<${mailConfig.auth?.user}>`,
      to: options.to,
      subject: options.subject,
      text: options.text || '',
      html: this.loadTemplate(options.templateName, options.params),
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      Logger.info(`Message sent: ${info.messageId}`);
    } catch (error) {
      Logger.error(`Error sending email:, ${error}`);
      throw error;
    }
  }

  private loadTemplate(templateName: string, data: any): string {
    const templatePath = path.join(
      __dirname,
      '../../third_party/mail/templates',
      `${templateName}.hbs`,
    );
    const templateSource = fs.readFileSync(templatePath, 'utf-8');
    const template = handlebars.compile(templateSource);
    return template(data);
  }
}
