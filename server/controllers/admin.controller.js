const adminService = require('../services/admin.service');

// sitas kontroleris skirtas gauti bendrus
// duomenis admino suvestinei
class AdminController {
  async getGeneralData(req, res, next) {
    try {
      console.log('[AdminController] Fetching general data...');
      const generalData = await adminService.getGeneralData();
      res.status(200).json(generalData);
    } catch (e) {
      console.error('[AdminController] Error:', e);
      res.status(500).json({ error: e.message }); // send detailed error to frontend
    }
  }
  
}

module.exports = new AdminController();
