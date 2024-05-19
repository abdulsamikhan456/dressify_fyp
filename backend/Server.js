const app = require("./app");
const dotenv = require("dotenv");
const connectDatabase = require("./MongoConnect");

dotenv.config({ path: "mongo.env" });
const port = 4000;


// ConnectDatabase
connectDatabase();

app.listen(process.env.PORT, () => {
  console.log(`Server Is Working On http://localhost:${process.env.PORT}`);
});

