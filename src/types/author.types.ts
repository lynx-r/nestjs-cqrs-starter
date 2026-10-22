export type User = {
  id: UserId;
} & { [key: string]: any };

export type UserId = string;
