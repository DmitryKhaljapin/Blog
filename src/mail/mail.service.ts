import { inject, injectable } from 'inversify';
import { IMailService } from './mail.service.interface';
import { createTransport, Transporter } from 'nodemailer';
import { IConfigService } from '../config/config.service.interface';
import { TYPES } from '../types';

@injectable()
export class MailService implements IMailService {
  private transporter: Transporter;

  constructor(
    @inject(TYPES.ConfigService) private configService: IConfigService,
  ) {
    this.transporter = createTransport({
      host: this.configService.get('SMTP_HOST'),
      secure: false, // fix for prod
      auth: {
        user: this.configService.get('SMTP_USER'),
        pass: this.configService.get('SMTP_PASSWORD'),
      },
    });
  }

  public async sendActivationLink(to: string, link: string): Promise<void> {
    await this.transporter.sendMail({
      from: this.configService.get('SMTP_USER'),
      to,
      subject: 'User activation',
      text: '',
      html: `
       <div>
        <h1>Click the link to activate the user</h1>
        <a href="${link}">${link}</a>
       </div>
      `,
    });
  }
}
