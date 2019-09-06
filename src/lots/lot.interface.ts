export class LotDto {
  readonly id: number;
  readonly title: string;
  readonly image?: string;
  readonly description?: string;
  readonly status: string;
  readonly currentPrice: number;
  readonly estimatedPrice: number;
  readonly startTime: Date;
  readonly endTime: Date;
}
