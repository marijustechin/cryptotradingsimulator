const ApiError = require('../exceptions/api.errors');

module.exports = function (err, req, res, next) {
  // jei klaida is klaidu klases
  // tai grazinam frontui kokia yra
  if (err instanceof ApiError) {
    return res
      .status(err.status)
      .json({ message: err.message, errors: err.errors });
  }

  // jei ne, tai nenumatyta klaida - 500
  return res
    .status(500)
    .json({ message: 'Unexpected server error' }, { error: err });
};
