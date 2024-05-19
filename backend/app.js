const express = require("express");
const paymentRoutes = require("./PaymentRoutes");


const app = express();
app.use(express.json({ limit: "10mb" }));


// Routes Importing

app.use("/payments", paymentRoutes);



module.exports = app;