export interface User {
  role: string;
  email: string;
  userId: string;
  accessToken?: string;
}

export type Opt<T> = T | null | undefined;
