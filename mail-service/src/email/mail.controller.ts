import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { MailService } from './mail.service';

@Controller('email')
export class MailController {
  constructor(private readonly emailService: MailService) {}

  @Post('send')
  async sendEmail(@Body() body: { to: string; subject: string }) {
    const { to, subject } = body;
    const link = uuidv4();
    await this.emailService.sendEmail(to, subject, link);
    return { message: 'Email sent successfully!' };
  }
  @Get('verify/:subject')
  async verifyUser(@Param('subject') subject: string) {
    return subject;
  }
}
