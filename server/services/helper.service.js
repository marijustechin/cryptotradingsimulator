class HelperService {
  errorsToString(errorsArray) {
    let errorString = '';

    for (const item of errorsArray) {
      errorString += item.msg + '; ';
    }

    return errorString;
  }

  correctDatePrice(histData, interval) {
    const formated = histData.map((item) => ({
      priceUsd: Math.round(parseFloat(item.priceUsd) * 1000) / 1000,
      date: item.date.split('T')[1].slice(0, 5),
      circulatingSupply: item.circulatingSupply,
      time: item.time,
    }));

    return formated;
  }
}

module.exports = new HelperService();
