// queue name = job namespace
export enum QUEUE_NAMES {
  LOTS = 'lotsQueue',
  EMAILS = 'emailsQueue',
}

export enum JOBS {
  LOT_END_TIME_JOB = 'setEndLotTimeJob',
}

export enum EMAILS {
  EMAIL_BUY_IT_NOW_BETTING_USER = 'sendBuyItNowToBuyer',
  EMAIL_BUY_IT_NOW_LOT_OWNER = 'sendBuyItNowToOwner',
  EMAIL_LOT_END_TIME_BUYER = 'sendLotEndTimeToBuyer',
  EMAIL_LOT_END_TIME_OWNER = 'sendLotEndTimeToOwner',
}
