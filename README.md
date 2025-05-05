# 📌 Project Overview
![image](https://github.com/user-attachments/assets/1bb7beb7-0c41-4c24-9816-1a9a2ca09f2f)

**(EN) A web platform where users can:**
- Register/Login: and receive virtual credits (e.g., 10,000).
- View real cryptocurrency prices: cryptocurrency indices (BTC, ETH, etc.) fetched from CoinCap.
- Buy/Sell (simulated): users can try out different trading strategies.
- Portfolio management: users can view the profitability and losses of their transactions, trading history, and owned assets.
  
**(LT) Web platforma, kur naudotojai gali:**
- Užsiregistruoti/Prisijungti: ir gauti virtualius kreditus (pavyzdžiui, 10,000).
- Matyti realius kripto valiutų kursus: kripto valiutų indeksai (BTC, ETH ir t.t.) gaunamus iš CoinCap.
- Pirkti/Parduoti (simuliavimas): naudotojai gali išbandyti įvairias prekybos strategijas.
- Portfelio valdymas: naudotojai gali matyti savo sandorių pelningumą ir nuostolius, prekybos istoriją ir turimus aktyvus.

# 🚀 Tech Stack

## Frontend

- TypeScript
- React + Vite
- Redux
- Axios
- Tailwind CSS + Daisy UI + LottieFiles
- Recharts
- Zod

## Backend

- Node.js
- Express.js  
- Sequelize
- JWT (JSON Web Token) + bcryptjs
- Axios, CORS, Nodemon
- WebSocket
  
 ## Other
 - CoinCap API
 - PostgreSQL
 - i18next (lithuanian language translation)

# 🛠️ Features & Architecture

### Authentication & Authorization:

User registration and login with JWT-based authentication. Protected routes using middleware.

### User Dashboard:

Displays portfolio value and virtual wallet balance. Visual performance chart of the user's transactions.

### Currency Page:

Shows crypto indices and trends. Allows users to buy/sell currencies.

### Trading:

Users execute virtual trades. The backend automatically updates the portfolio and validates transactions (e.g., checks if the balance is sufficient).

### Portfolio Management:

View current investments and transaction history. Calculates profits and losses.

# 🎯 Project Implementation

**1. Initial Setup**

React with Vite (and related tools). Node.js with Express, Sequelize, etc. Everything is hosted on GitHub.

**2. API Integration**

Read and prepare CoinCap API documentation. Fetch data and display it on the frontend.

**3. Authentication System**

Implement authentication using JWT on the Node.js backend. Secure API endpoints accordingly.

**4. Trading Logic**

Develop the logic for buying and selling, updating the virtual portfolio and user balance.

**5. Portfolio Page**

Create frontend components to display balance, transactions, profits/losses. Include trading charts.

**6. UI/UX Enhancements**

Design an attractive interface – styles, colors, fonts, etc. Add intuitive navigation and interactive elements (modals, toasts, etc.).

# ⭐️ Support
If you find this project useful or interesting, consider giving it a star!
Your support helps the project grow and reach more developers. 😊
