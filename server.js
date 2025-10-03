require("dotenv").config();
const cors = require("cors");

const express = require("express");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 1234;
const db = process.env.MONGO_DB;
const userRouter = require("./router/user");
const paymentRouter = require("./router/payment");
const productRouter = require("./router/product");
const kitchenRouter = require("./router/kitchen");
const categoryRouter = require("./router/category");
const jwt = require("jsonwebtoken");
const cartRouter = require("./router/cart");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/v1", userRouter);
app.use("/api/v1", paymentRouter);
app.use("/api/v1", productRouter);
app.use("/api/v1", kitchenRouter);
app.use("/api/v1", categoryRouter);
app.use("/api/v1", cartRouter);


mongoose
  .connect(db)
  .then(() => {
    console.log(`Connected to the database successfully`);
    app.listen(PORT, () => {
      console.log(`Server is running on the PORT: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("Error connecting to the datbase:", error.message);
  });
