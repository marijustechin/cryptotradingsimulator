class HelperService {
  errorsToString(errorsArray) {
    let errorString = '';

    for (const item of errorsArray) {
      errorString += item.msg + '; ';
    }

    return errorString;
  }
}

module.exports = new HelperService();
