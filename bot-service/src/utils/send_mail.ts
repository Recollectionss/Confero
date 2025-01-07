import nodemailer from 'nodemailer';
import { ENV_CONSTANTS } from '../constants/env_constants';

export interface MailOptionsInterface {
  from: string;
  to: string;
  subject: string;
  html?: string;
  text?: string;
}

const transporter = nodemailer.createTransport({
  host: ENV_CONSTANTS.smtp.host,
  port: ENV_CONSTANTS.smtp.port,
  secure: false,
  auth: {
    user: ENV_CONSTANTS.smtp.user,
    pass: ENV_CONSTANTS.smtp.pass,
  },
});

export const sendMail = async (options: MailOptionsInterface) => {
  try {
    const info = await transporter.sendMail(options);
    console.log('Email sent: ', info.response);
    return info;
  } catch (error) {
    console.log('Error occurred while sending email: ', error);
  }
};
