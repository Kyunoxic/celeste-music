declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: 'development' | 'production';
            OWNER_SNOWFLAKE: string;
            BOT_SECRET: string;
        }
    }
}

export {}