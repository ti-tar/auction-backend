// queue name = job namespace
export enum QUEUE_NAMES {
  LOTS = 'lotsQueue',
  EMAILS = 'emailsQueue',
}

export enum JOBS {
  LOT_END_TIME_JOB = 'setEndLotTimeJob',
}

export enum EMAILS {
  SEND_APPROVAL_EMAIL = 'sendApprovalEmail',
  SEND_VERIFICATION_EMAIL = 'sendVerificationEmail',
  SEND_FORGOT_PASSWORD_MAIL = 'sendForgotPasswordMail',

  BUY_IT_NOW_EMAIL_TO_CUSTOMER = 'sendBuyItNowToCustomer',
  BUY_IT_NOW_EMAIL_TO_SELLER = 'sendBuyItNowToSeller',
  LOT_END_TIME_TO_CUSTOMER = 'sendLotEndTimeToCustomer',
  LOT_END_TIME_TO_SELLER = 'sendLotEndTimeToSeller',

  ORDER_CREATED_EMAIL_TO_SELLER = 'orderCreatedEmail',
  ORDER_UPDATED_EMAIL_TO_SELLER = 'orderUpdatedEmail',
  ORDER_EXECUTED_EMAIL_TO_CUSTOMER = 'orderExecutedEmail',
  ORDER_RECEIVED_EMAIL_TO_SELLER = 'orderReceivedEmail',
}
