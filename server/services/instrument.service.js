const { where } = require("sequelize");
const sequelize = require("../config/db");
const ApiError = require("../exceptions/api.errors");
const { instrument } = sequelize.models;

class InstrumentService {
  async getInstrument(id) {
    return await instrument.findOne({ where: { id } });
  }
}

module.exports = new InstrumentService();
