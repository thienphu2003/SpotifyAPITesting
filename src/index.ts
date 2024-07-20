require('dotenv').config();

import 'reflect-metadata';
import logger from './configs/logger.config';
import app from './configs/server.config';
import envConfig from './configs/env.config';
import { initDB } from './init/database';

const connect = async () => {
    try {
        // initDB();

        app.listen(envConfig.app.port, () => {
            logger.info(
                `Server running at ${envConfig.app.host}:${envConfig.app.port}`,
            );
        });
    } catch (e) {
        logger.info(
            `The connection to database was failed with error: ${e}`,
        );
    }
};

connect();
