const envConfig = {
    app: {
        host: process.env.HOST,
        port: process.env.PORT,
    },
    database: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        dbName: process.env.DB_NAME,
    },
    nodeEnv: process.env.NODE_ENV || 'development',
};

export default envConfig;
