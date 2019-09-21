import { createHmac } from 'crypto';

export function getPasswordsHash(password: string): string {
  return createHmac('sha256', password).digest('hex');
}
