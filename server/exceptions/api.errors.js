module.exports = class ApiError extends Error {
  status;
  errors;

  constructor(status, message, errors = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }

  static NoContent() {
    return new ApiError(204, 'No content');
  }

  static BadRequest(message, errors = []) {
    return new ApiError(400, message, errors);
  }

  static UnregisteredError() {
    return new ApiError(401, 'Reikia dar pagalvoti');
  }

  static UnauthorizedError() {
    return new ApiError(403, 'Unauthorized user');
  }

  static ConflictError(message, errors = []) {
    return new ApiError(409, message, errors);
  }
};
