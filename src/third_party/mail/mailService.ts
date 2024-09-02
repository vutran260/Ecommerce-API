import nodemailer, { Transporter } from 'nodemailer';
import { MailOptions } from './MailTypes';
import { mailConfig } from 'src/Config';
import Logger from 'src/lib/core/Logger';
import path from 'path';
import handlebars from 'handlebars';
import fs from 'fs';

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
      './templates',
      `${templateName}.hbs`,
    );
    const templateSource = fs.readFileSync(templatePath, 'utf-8');
    const template = handlebars.compile(templateSource);
    return template(data);
  }
}
