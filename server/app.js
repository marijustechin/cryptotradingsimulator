const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// endpointu importas
const userRouter = require('./routers/user.router');
const cryptoRouter = require('./routers/crypto.router');
const setupWebSocketRoutes = require('./routers/crypto.ws.router');

// Importuojam klaidu midlvare
const errorsMiddleware = require('./middlewares/error.middleware');

const app = express();
setupWebSocketRoutes(app);

// o cia panaudojamos importuotos midlvares visokios
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
);
app.use(cookieParser());

app.use('/api/v1/users', userRouter);
app.use('/api/v1/crypto', cryptoRouter);

// Svarbu!!! klaidos turi buti paskutines
app.use(errorsMiddleware);

module.exports = app;
