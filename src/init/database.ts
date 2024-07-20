import AppDataSource from '../typeorm/data-source';

export const initDB = () => {
    AppDataSource.initialize()
        .then(() => {
            console.log('Data Source has been initialized!');
        })
        .catch((err) => {
            console.error(
                'Error during Data Source initialization:',
                err,
            );
        });
};
