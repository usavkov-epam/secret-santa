export interface TelegramUser {
  telegramId?: number;
  username?: string;
  first_name?: string;
  last_name?: string;
}

export interface ParticipantJoinData {
  fullName: string;
  wish: string;
  sharedLink: string;
}
