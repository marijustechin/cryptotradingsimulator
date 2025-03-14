require('dotenv').config();
const port = process.env.PORT || 3003;
const sequelize = require('./config/db');

// sita reikes turbut realizuoti kaip klase
const { fetchCryptoData } = require('./services/crypto.service');

const app = require('./app');

const startServer = async () => {
  try {
    // Prisijungiam prie duomenu bazes
    await sequelize.authenticate();

    // sinchronizuojam modelius su DB
    await sequelize.sync({ alter: true });

    // Pradinis duomenu gavimas
    fetchCryptoData();

    // serveris
    app.listen(port, () => {
      console.log(`Serveris veikia. Prievadas: ${port}`);
    });
  } catch (e) {
    console.log(e);
  }
};

startServer();
