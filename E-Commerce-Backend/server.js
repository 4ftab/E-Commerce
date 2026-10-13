const userRoutes = require("./routes/userRoutes");
const express = require("express");
const cors = require("cors");
const db = require("./config/db");
const productRoutes = require("./routes/productroutes");
const profileRoutes = require("./routes/profileRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();

// Allow requests from the React frontend (Vite dev server on port 5173)
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(express.json());

app.use("/", productRoutes);
app.use("/", userRoutes);
app.use("/", profileRoutes);
app.use("/", categoryRoutes);
app.use("/", cartRoutes);
app.use("/", orderRoutes);

app.get("/", (req, res) => {
    res.send("E-Commerce Backend is running");
});

app.listen(5001, () => {
    console.log("Server running on port 5001");
});
