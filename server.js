const app = require('./app')
const { connection } = require('./Db')

const startServer = async () => {
    try{
        await connection;
        console.log('Database connected');
        app.listen(8000, async () => {
            console.log('Server started on http://localhost:8000');
        });
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
}

startServer();