require("dotenv").config();
const port = process.env.PORT || 3003;
const sequelize = require("./db");

const app = require("./app");

const startServer = async () => {
  try {
    // Prisijungiam prie duomenu bazes
    await sequelize.authenticate();

    // sinchronizuojam modelius su DB
    await sequelize.sync({ alter: true });

    app.listen(port, () => {
      console.log(`Serveris veikia. Prievadas: ${port}`);
    });
  } catch (e) {
    console.log(e);
  }
};

startServer();
