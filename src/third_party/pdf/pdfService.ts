import puppeteer, { PDFOptions, PaperFormat } from 'puppeteer';
import ejs from 'ejs';
import path from 'path';

export interface TemplateParams {
  receiptNo: number;
  issueDate: string;
  customerName: string;
  totalAmount: string;
  shipmentFee: string;
  storeName: string;
  postalCode: string;
  address: string;
  phoneNumber: string;
  fax: string;
  email: string;
  items: {
    description: string;
    quantity: number;
    unitPrice: string;
    amount: string;
  }[];
}

export interface PdfOptions extends Partial<PDFOptions> {
  format?: PaperFormat;
}

export class PdfService {
  // Generate PDF with dynamic template, params, and config
  public async generatePdf(
    template: string,
    templateParams: TemplateParams,
    pdfOptions?: PdfOptions,
  ): Promise<Buffer> {
    try {
      let html: string;
      pdfOptions = pdfOptions || {
        format: 'A4',
        margin: { top: '20mm', bottom: '20mm', left: '15mm', right: '15mm' },
      };

      // Check if the template is a file path or raw HTML
      if (template.includes('<html>')) {
        html = template; // Raw HTML string passed
      } else {
        const templatePath = path.join(
          __dirname,
          '../../third_party/pdf/templates',
          `${template}.ejs`,
        );
        html = await ejs.renderFile(templatePath, templateParams);
      }

      // Launch Puppeteer
      const browser = await puppeteer.launch();
      const page = await browser.newPage();

      // Set HTML content
      await page.setContent(html, { waitUntil: 'domcontentloaded' });

      // Generate PDF
      const pdfUint8Array = await page.pdf({
        format: pdfOptions.format || 'A4', // Default to 'A4'
        printBackground: true,
        margin: pdfOptions.margin || {
          top: '10mm',
          right: '10mm',
          bottom: '10mm',
          left: '10mm',
        },
        ...pdfOptions,
      });

      await browser.close();

      return Buffer.from(pdfUint8Array);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error('Error generating PDF: ' + error.message);
      } else {
        throw new Error('Unknown error occurred while generating PDF');
      }
    }
  }
}
