import { OrderRepository } from '../repository/OrderRepository';

import { MailOptions, MailService } from '../../third_party/mail/mailService';
import { formatDateJp } from '../../lib/helpers/dateTimeUtil';
import {
  formatBusinessRegistrationNumber,
  formatCurrency,
  formatDiscountAmount,
  formatName,
  formatPhoneNumber,
} from '../../lib/helpers/commonFunction';
import { PdfService, TemplateParams } from '../../third_party/pdf/pdfService';
import { InvoiceRepository } from '../repository/InvoiceRepository';

export class InvoiceUseCase {
  private orderRepo: OrderRepository;
  private invoiceRepository: InvoiceRepository;
  private mailService: MailService;
  private pdfService: PdfService;

  constructor(
    orderRepo: OrderRepository,
    invoiceRepository: InvoiceRepository,
    mailService: MailService,
    pdfService: PdfService,
  ) {
    this.orderRepo = orderRepo;
    this.invoiceRepository = invoiceRepository;
    this.mailService = mailService;
    this.pdfService = pdfService;
  }

  public issueInvoice = async (params: {
    email: string;
    businessRegistrationNumber: string;
    orderId: string;
  }) => {
    const { email, businessRegistrationNumber, orderId } = params;
    const order = await this.orderRepo.getOrderFullAttrById(Number(orderId));
    if (!order) {
      throw new Error(`Order with ID ${orderId} not found`);
    }

    const createdInvoice = await this.invoiceRepository.createInvoice({
      id: Date.now(),
      orderId: order.id,
      invoiceDate: new Date(),
      totalAmount: order.totalAmount,
      taxAmount: 0,
      toEmail: email,
    });

    const { lpOrderAddressBuyer: orderAddress } = order;
    const templateParams: TemplateParams = {
      receiptNo: createdInvoice.id,
      issueDate: formatDateJp(createdInvoice.createdAt),
      businessRegistrationNumber: formatBusinessRegistrationNumber(
        businessRegistrationNumber,
      ),
      customerName: formatName(
        orderAddress.firstNameKanji,
        orderAddress.lastNameKanji,
      ),
      shipmentFee: `${formatCurrency(order.shipmentFee)}円`,
      totalAmount: `${formatCurrency(order.totalAmount)}円`,
      storeName:
        order?.store?.lpStoreSso?.storeShortName ||
        order?.store?.storeName ||
        '',
      postalCode: orderAddress?.postCode,
      address: `${orderAddress.prefectureName || ''} ${orderAddress.cityTown} ${orderAddress.streetAddress} ${orderAddress.buildingName}`,
      phoneNumber: formatPhoneNumber(orderAddress?.telephoneNumber),
      fax: '',
      email: orderAddress?.email,
      items: order.lpOrderItems.map((item) => ({
        description: item.productName,
        quantity: item.quantity,
        unitPrice: `${item.originalPrice}円`,
        discountPrice: `${formatDiscountAmount(item.price, item.originalPrice)}`,
        amount: `${formatCurrency(item.quantity * (item.price || 0))}円`,
      })),
    };

    const buffer = await this.pdfService.generatePdf(
      'orderInvoicePdfTemplate',
      templateParams,
    );

    const mailOptions: MailOptions = {
      to: email,
      subject:
        'ECパレット｜[ご購入いただきありがとうございます] 領収書の発行について\n',
      templateName: 'orderInvoiceTemplate',
      params: {
        buyerFirstNameKanji: order?.lpOrderAddressBuyer?.firstNameKanji || '',
        buyerLastNameKanji: order?.lpOrderAddressBuyer?.lastNameKanji || '',
        purchaseDate: formatDateJp(order?.createdAt),
        orderId: order.id,
        totalAmount: `${formatCurrency(order.totalAmount)}円`,
      },
    };

    this.mailService.sendMail(mailOptions, [
      {
        filename: `invoice_${createdInvoice.id}.pdf`,
        content: buffer,
      },
    ]);

    return createdInvoice;
  };
}
