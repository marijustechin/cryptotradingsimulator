const adminService = require('../services/admin.service');

// sitas kontroleris skirtas gauti bendrus
// duomenis admino suvestinei
class AdminController {
  async getGeneralData(req, res, next) {
    try {
      const generalData = await adminService.getGeneralData();

      return res.status(200).json(generalData);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new AdminController();
