interface PaginationResultInterface<PaginationEntity> {
  data: PaginationEntity[];
  total: number;
  next?: string;
  previous?: string;
}

export class Pagination<PaginationEntity> {
  public data: PaginationEntity[];
  public total: number;

  constructor(paginationResults: PaginationResultInterface<PaginationEntity>) {
    this.data = paginationResults.data;
    this.total = paginationResults.total;
  }
}
