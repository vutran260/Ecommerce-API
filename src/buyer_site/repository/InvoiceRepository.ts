import { LP_INVOICE } from '../../lib/mysql/models/LP_INVOICE';
import { CreateInvoiceRequest } from '../../common/model/orders/Invoice';

export class InvoiceRepository {
  public createInvoice = async (input: CreateInvoiceRequest) => {
    return await LP_INVOICE.create(input);
  };

  public getById = async (id: string) => {
    return await LP_INVOICE.findOne({
      where: {
        id: id,
      },
    });
  };
}
