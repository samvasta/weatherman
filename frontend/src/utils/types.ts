export type WithNonNullKey<T, K extends keyof T> = {
  [P in keyof T]: P extends K ? NonNullable<T[P]> : T[P];
};
export type KeyOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];