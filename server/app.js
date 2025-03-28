const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');

//////// paservinsim public aplanka
const path = require('path');
/////////////////////////////////////////////////

// endpointu importas
const userRouter = require('./routers/user.router');
const tradeRouter = require('./routers/trader.router');
const instrumentRouter = require('./routers/instruments');
const adminRouter = require('./routers/admin.router');

// Importuojam klaidu midlvare
const errorsMiddleware = require('./middlewares/error.middleware');

const app = express();

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
app.use('/api/v1/trade', tradeRouter);
app.use('/api/v1/instrument', instrumentRouter);
app.use('/api/v1/admin', adminRouter);

// Svarbu!!! klaidos turi buti paskutines
app.use(errorsMiddleware);

module.exports = app;
