import axios from 'axios';

export default class HelperService {
  static errorToString(e: unknown): string {
    if (axios.isAxiosError(e)) return e.response?.data.message;

    if (e instanceof Error) return e.message;

    return 'Įvyko nežinoma klaida.';
  }

  static formatCurrency(amount: number) {
    return new Intl.NumberFormat('lt-LT', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  }
}
