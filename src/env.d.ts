declare namespace NodeJS {
  export interface ProcessEnv {
    PORT: string;
    DATABASE_URL: string;
    FACTORY_TODOS_AUTH_TOKEN?: string;
  }
}
