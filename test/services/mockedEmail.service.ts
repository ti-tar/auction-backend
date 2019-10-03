import { EmailService } from '../../src/email/email.service';

export default () => {
  return class MockedEmailService extends EmailService {
    answer = { envelope: { to: []}};
    async sendVerificationEmail(): Promise<any> { return this.answer; }
    async sendApprovalEmail(): Promise<any> { return this.answer; }
    async sendForgotPasswordMail(): Promise<any> { return this.answer; }
  };
};
