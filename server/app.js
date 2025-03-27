const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');

//////// paservinsim public aplanka
const path = require('path');
const imageDir = path.join(__dirname, 'public');
/////////////////////////////////////////////////

// endpointu importas
const userRouter = require('./routers/user.router');
const cryptoRouter = require('./routers/crypto.router');
const tradeRouter = require('./routers/trader.router');
const chartRouter = require('./routers/chart.router');
const instrumentRouter = require('./routers/instruments');
const adminRouter = require('./routers/admin.router');

// websocket routeris
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
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

///////// servinam public aplanka
app.use(
  '/public/assets',
  express.static(path.join(__dirname, 'public/assets'))
);
/////////////////////////////////////////////

app.use('/api/v1/users', userRouter);
app.use('/api/v1/crypto', cryptoRouter);
app.use('/api/v1/trade', tradeRouter);
app.use('/api/v1/chart', chartRouter);
app.use('/api/v1/instrument', instrumentRouter);
app.use('/api/v1/admin', adminRouter);

// Svarbu!!! klaidos turi buti paskutines
app.use(errorsMiddleware);

module.exports = app;
