// queue name = job namespace
export enum QUEUE_NAMES {
  LOTS = 'lotsQueue',
  EMAILS = 'emailsQueue',
}

export enum JOBS {
  LOT_END_TIME_JOB = 'setEndLotTimeJob',
  LOT_BUY_IT_NOW_JOB = 'setBuyItNowJob',
}

export enum EMAILS {
  EMAIL_BUY_IT_NOW_BETTING_USER = 'sendBuyItNowToBuyer',
  EMAIL_BUY_IT_NOW_LOT_OWNER = 'sendBuyItNowToOwner',
}
