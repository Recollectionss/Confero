import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { GET_EMAIL_HTML } from '../utils/get_email_html';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('smtp.host'),
      port: this.configService.get<number>('smtp.port'),
      secure: false,
      auth: {
        user: this.configService.get<string>('smtp.username'),
        pass: this.configService.get<string>('smtp.password'),
      },
    });
  }

  async sendEmail(to: string, subject: string, link: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: `"Confero" <${process.env.SMTP_USERNAME}>`,
        to,
        subject,
        text: '',
        html: GET_EMAIL_HTML(link),
      });
      console.log('Email sent');
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
