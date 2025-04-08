const settingsService = require('../services/settings.service');

class SettingsController {
  async getSettings(req, res, next) {
    try {
      const settings = await settingsService.getSettings();

      return res.status(200).json(settings);
    } catch (e) {
      next(e);
    }
  }

  async generateFakeUsers(req, res, next) {
    try {
      const { usersCount, defaultPassword } = req.body;
      const fakeUsers = await settingsService.generateFakeUsers(
        usersCount,
        defaultPassword
      );

      return res.status(200).json(fakeUsers);
    } catch (e) {
      next(e);
    }
  }

  async generateFakeActivity(req, res, next) {
    try {
      const fakeActivity = await settingsService.generateFakeActivity();

      return res.status(200).json(fakeActivity);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new SettingsController();
