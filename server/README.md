# File structure of backend server

crypto-backend/
│── app.js # Main app setup
│── index.js # Server entry point
│── package.json # Dependencies
│── config/
│ ├── db.js # Database connection (Sequelize)
│ ├── axios.js # Axios config
│── controllers/ # Controllers (route logic)
│── dtos/ # Data transfer objects (DTOs)
│── exceptions/ # Custom error handling
│── middlewares/ # Express middlewares
│── models/ # Sequelize models
│── routers/ # Express route handlers
│── services/ # Business logic
│── validators/ # Request validation
