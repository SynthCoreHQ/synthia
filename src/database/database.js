import { Sequelize } from 'sequelize';

export const database = new Sequelize(
    {
        database: 'database',
        username: 'dbuser',
        password: 'dbpass',
        host: 'localhost',
        logging: false,
        dialect: 'sqlite',
        storage: 'database.sqlite',
    },
);
