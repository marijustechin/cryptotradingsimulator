const sequelize = require('../config/db');
const ApiError = require('../exceptions/api.errors');
const helperService = require('./helper.service');
const { instrument } = sequelize.models;

class InstrumentService {
  async getInstrument(id) {
    return await instrument.findOne({ where: { id } });
  }

  async getAllInstruments() {
    const instruments = await instrument.findAll();
    // jei nieko neradom, inicijuojam default instrumentu sukurima
    if (instruments.length === 0) {
      await helperService.initInstruments();
      const instruments = await instrument.findAll();
      return instruments;
    } else {
      return instruments;
    }
  }
}

module.exports = new InstrumentService();
