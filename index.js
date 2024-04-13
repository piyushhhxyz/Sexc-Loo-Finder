const express = require('express');
const shopRoutes = require('./src/routes/shops');
const { dbConnect } = require("./config/connectDB")
// const fileUpload = require("express-fileupload")

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/shops', shopRoutes);

dbConnect();
app.get("/", (_, res) => res.send("Welcome to The Royal Washrooms API"));
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
