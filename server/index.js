require('dotenv').config();
const {
  startWebSocketService,
} = require('./services/close.limit.orders.service');
const port = process.env.PORT || 3003;
const sequelize = require('./config/db');

const app = require('./app');

const startServer = async () => {
  try {
    // Prisijungiam prie duomenu bazes
    await sequelize.authenticate();

    // sinchronizuojam modelius su DB
    await sequelize.sync({ alter: true });
    // alter pakeiciam i force, tada save, tada pakeiciam atal i alter

    // kainu tikrinimo klientas
    startWebSocketService();

    // serveris
    app.listen(port, () => {
      console.log(`Serveris veikia. Prievadas: ${port}`);
    });
  } catch (e) {
    console.log(e);
  }
};

startServer();
