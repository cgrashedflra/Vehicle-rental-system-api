import app from './app';
import config from './config';
import initDB from './config/DB';

const port = config.port;

// initializing DB
initDB();


app.listen(port, () => {
  console.log(`app v1 listening on port ${port} ....`)
})
