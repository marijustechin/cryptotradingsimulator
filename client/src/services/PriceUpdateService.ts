import $api from '../api/axios';

export default class PriceUpdateService {
    static async updatePrice(
        assetId: string,
        marketPrice: number,
    ): Promise<{message: string}> {
        const response = await $api.post('/price-update', {
            assetId,
            marketPrice
        })
        return response.data;
    }
}