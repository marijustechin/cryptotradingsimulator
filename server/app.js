const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');

const path = require('path');

// endpointu importas
const userRouter = require('./routers/user.router');
const tradeRouter = require('./routers/trader.router');
const instrumentRouter = require('./routers/instruments');
const adminRouter = require('./routers/admin.router');
const settingsRouter = require('./routers/settings.router');

// Importuojam klaidu midlvare
const errorsMiddleware = require('./middlewares/error.middleware');
const languageMiddleware = require('./middlewares/language.middleware');

const app = express();

// o cia panaudojamos importuotos midlvares visokios
app.use(express.json());

const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',')
  : [];

app.use(
  cors({
    credentials: true,
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  })
);

app.use(cookieParser());
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);
app.use(languageMiddleware);

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
app.use('/api/v1/settings', settingsRouter);

// Svarbu!!! klaidos turi buti paskutines
app.use(errorsMiddleware);

module.exports = app;
