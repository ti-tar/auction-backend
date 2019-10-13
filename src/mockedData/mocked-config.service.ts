export class MockConfigService {

  public get(key: string): string {
    return process.env[key];
  }

  // getEmailOptions() {
  //   return undefined;
  // }

  getVerifyLink(token: string): string {
    return `${this.get('FRONTEND_URL')}auth/verify/email?token=${encodeURIComponent(token)}`;
  }

  getResetPasswordLink(token: string): string {
    return `${this.get('FRONTEND_URL')}auth/reset_email?token=${encodeURIComponent(token)}`;
  }

  getEmailOptions() {
    return {
      host: this.get('MAILTRIP_HOST'),
      port: parseInt(this.get('MAILTRIP_PORT'), 10),
      auth: {
        user: this.get('MAILTRIP_USER'),
        pass: this.get('MAILTRIP_PASS'),
      },
    };
  }

  get pagination() {
    return {
      page: 1,
      perPage: 4,
    };
  }
}
