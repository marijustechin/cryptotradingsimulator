const sequelize = require('../config/db');
const ApiError = require('../exceptions/api.errors');
const { asset, asset_hist, instrument } = sequelize.models;
const axios = require('axios');
const $axios = require('../config/api');
const $api = require('../config/axios');
const helperService = require('./helper.service');

class AssetService {
  async getAssets() {
    const assets = await asset.findAll({ order: [['rank', 'asc']] });
    return assets;
  }

  /**
   *
   * @param {*} assets
   */
  async updateAssets(assets) {
    // atrenkam kainas
    const assetIds = assets.map((item) => item.id);
    const existingAssets = await asset.findAll({
      where: { id: assetIds },
      attributes: ['id', 'priceUsd'],
      raw: true,
    });

    // paverciam masyvu
    const existingAssetMap = new Map(
      existingAssets.map((a) => [a.id, a.priceUsd])
    );

    // atrenkam kur pasikeite kaina
    const assetsToUpdate = assets.filter((item) => {
      const oldPrice = existingAssetMap.get(item.id);
      const newPrice = Math.round(parseFloat(item.priceUsd) * 100) / 100;
      return oldPrice !== newPrice;
    });

    // atnaujinam...
    for (const item of assetsToUpdate) {
      await asset.upsert({
        id: item.id,
        rank: Number(item.rank),
        symbol: item.symbol,
        name: item.name,
        supply: Math.round(item.supply),
        marketCapUsd: parseFloat(item.marketCapUsd),
        volumeUsd24Hr: Number(item.volumeUsd24Hr),
        priceUsd: parseFloat(item.priceUsd),
        changePercent24Hr:
          Math.round(parseFloat(item.changePercent24Hr) * 1000) / 1000,
        vwap24Hr: parseFloat(item.vwap24Hr),
      });
    }
  }

  async saveHistoricalData(asset_id, histData) {
    if (!Array.isArray(histData) || histData.length === 0) {
      console.log('No data to insert.');
      return;
    }

    const formattedData = histData.map((data) => ({
      asset_id: asset_id,
      priceUsd: parseFloat(data.priceUsd),
      date: data.date,
    }));

    const transaction = await sequelize.transaction();
    try {
      await asset_hist.bulkCreate(formattedData, {
        updateOnDuplicate: ['priceUsd', 'date'],
        transaction,
      });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      console.error('Error:', error);
    }
  }

  async getAssetsHistory(asset_id, limit = null, interval = 'm30') {
    // paskutines trisdesimt dienu
    const historyPrices = await asset_hist.findAll({
      where: { asset_id },
      attributes: ['priceUsd', 'date'],
      order: [['date', 'DESC']],
      ...(limit ? { limit } : {}),
    });

    // jei nieko nera
    if (!historyPrices) throw ApiError.NotFound();

    return historyPrices;
  }

  async getAssetHistory(asset_id, interval = 'm30') {
    try {
      const response = await $api.get(
        `/assets/${asset_id}/history?interval=${interval}`
      );

      // jei negavom duomenu is api, imam is db
      if (
        !Array.isArray(response.data.data) ||
        response.data.data.length === 0
      ) {
        const historyData = await this.getAssetsHistoryFromDb(asset_id);
        if (Array.isArray(historyData) || historyData.length === 0) {
          return helperService.correctDatePrice(historyData);
        } else {
          return 'Failed to get historical data';
        }
      }
      this.saveHistoricalData(asset_id, response.data.data);
      return helperService.correctDatePrice(response.data.data);
    } catch (e) {
      return await this.getAssetsHistoryFromDb(asset_id);
    }
  }

  async getCandles(instrument = 'BTC-USD', interval = 'minutes') {
    const queryParams = `/${interval}?market=kraken&instrument=${instrument}&limit=200&aggregate=1&fill=true&apply_mapping=true&response_format=JSON`;
    try {
      const response = await $axios.get(queryParams);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async getInstruments() {
    const instruments = await instrument.findAll();
    if (instruments.length === 0) {
      await helperService.initInstruments();
      return await instrument.findAll();
    }
    return instruments;
  }
}

module.exports = new AssetService();
