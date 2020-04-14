export interface MsAuthCacheConnection {
  connections?: Connection[];
  username?: string;
}

export interface Connection {
  state?: string;
  updated?: Date;
  username?: string;
}
