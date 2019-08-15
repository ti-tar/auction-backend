export class LotDto {
  readonly id: number;
  readonly title: string;
  readonly image?: string;
  readonly description?: string;
  readonly status: string;
  readonly current_price: number;
  readonly estimated_price: number;
  readonly start_time: Date;
  readonly end_time: Date;
}