const { faker } = require('@faker-js/faker');
const sequelize = require('./config/db');
const { chart } = sequelize.models;

const intervals = {
  15: 15 * 60 * 1000,
  30: 30 * 60 * 1000,
  60: 60 * 60 * 1000,
};

const symbols = ['BTCUSDT', 'ETHUSDT'];

function generateFakeCandle(symbol, interval, startTime, endTime) {
  const open = faker.number.float({ min: 1000, max: 50000 });
  const close = open + faker.number.float({ min: -50, max: 50 });
  const high = Math.max(open, close) + faker.number.float({ min: 0, max: 25 });
  const low = Math.min(open, close) - faker.number.float({ min: 0, max: 25 });
  const volume = faker.number.float({ min: 10, max: 500 });

  return {
    symbol,
    interval,
    start: startTime,
    end: endTime,
    open: Number(open.toFixed(2)),
    close: Number(close.toFixed(2)),
    high: Number(high.toFixed(2)),
    low: Number(low.toFixed(2)),
    volume: Number(volume.toFixed(2)),
  };
}

async function insertFakeHistory() {
  for (const symbol of symbols) {
    for (const intervalKey of Object.keys(intervals)) {
      const step = intervals[intervalKey];
      const now = Date.now();

      const candles = [];

      for (let i = 200; i > 0; i--) {
        const start = now - i * step;
        const end = start + step - 1;
        candles.push(generateFakeCandle(symbol, intervalKey, start, end));
      }

      for (const candle of candles) {
        await chart.upsert(candle);
      }

      console.log(
        `✅ Inserted 200 fake candles for ${symbol} [${intervalKey}]`
      );
    }
  }

  console.log('🚀 All done.');
  process.exit();
}

insertFakeHistory().catch((err) => {
  console.error('❌ Error generating fake data:', err);
  process.exit(1);
});
