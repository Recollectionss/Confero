import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
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

  async sendEmail(
    to: string,
    subject: string,
    text: string,
    html?: string,
  ): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: `"Confero" <${process.env.SMTP_USERNAME}>`,
        to,
        subject,
        text,
        html,
      });
      console.log('Email sent');
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
