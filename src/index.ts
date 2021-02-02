import Server from './Server';
import MongoDatabase from './datasource/database/mongo';

const server = new Server(new MongoDatabase());
(async () => {
    await server.start();
})();

process.on('SIGINT', () => {
    console.info('Stopping express server');

    server.stop().then((error: any) => {
        console.info(`Server stopped`);
        process.exit(error ? 1 : 0);
    });
});
