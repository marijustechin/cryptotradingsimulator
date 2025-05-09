// src/sequelize.ts
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

export const sequelize = new Sequelize(
  process.env.DB_NAME as string,
  process.env.DB_USER as string,
  process.env.DB_PASS as string,
  {
    dialect: process.env.DB_DIALECT as any, // 'postgres' is valid
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    pool: {
      max: 10,
      min: 2,
      idle: 10000,
    },
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT ?? 5432),
  }
);

export async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL connection has been established successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to PostgreSQL:', error);
  }
}
