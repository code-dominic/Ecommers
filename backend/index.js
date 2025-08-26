const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();   // <--- add this

const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const cartRoutes = require("./routes/cartRoutes");
const dashboardRoutes = require('./routes/dashboardRoutes');
const orderRoutes = require('./routes/orderRoutes');


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/products", productRoutes);
app.use("/orders" , orderRoutes);
app.use("/users", userRoutes);
app.use("/cart", cartRoutes);
app.use("/dashboard" , dashboardRoutes);

app.get("/" , (req , res) =>{
    res.send("HI the backend is working!!!");
})

// MongoDB + Server

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected");
    app.listen(5000, () => console.log("Server running on port 5000"));
  })
  .catch((err) => console.error(err));
