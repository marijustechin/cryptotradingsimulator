const instrumentService = require('../services/instrument.service');

class InstrumentController {
  async getInstrument(req, res, next) {
    try {
      const { id } = req.params;

      const instrument = await instrumentService.getInstrument(id);

      return res.status(200).json(instrument);
    } catch (e) {
      next(e);
    }
  }
  async getAllInstruments(req, res, next) {
    try {
      const instruments = await instrumentService.getAllInstruments();
      return res.status(200).json(instruments);
    } catch (e) {
      next(e);
    }
  }
}
module.exports = new InstrumentController();
