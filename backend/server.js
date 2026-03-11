const app = require('./app');
const config = require('./config/env');
const db = require("./config/db.js");

const PORT = config.PORT || 5000;

// Sync database and start server
db.sequelize.sync()
  .then(() => {
    console.log("Synced db.");
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}.`);
    });
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });
