declare namespace NodeJS {
  export interface ProcessEnv {
    PORT: string;
    DATABASE_URL: string;
    TODOS_API_TOKEN: string;
  }
}
