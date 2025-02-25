module.exports = class ApiError extends Error {
  status;
  errors;

  constructor(status, message, errors = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }

  static UnregisteredError() {
    return new ApiError(401, "Neregistruotas naudotojas");
  }

  static UnauthorizedError() {
    return new ApiError(403, "Neautorizuotas naudotojas");
  }

  static BadRequest(message, errors = []) {
    return new ApiError(400, message, errors);
  }
};
