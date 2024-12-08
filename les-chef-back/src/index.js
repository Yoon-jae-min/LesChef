const express = require("express");
const cors = require("cors");
const app = express();
const customer = require("../src/routers/customer");
// const recipe = require("../src/routers/recipe");

app.use(cors());
app.use(express.json());

app.use("/customer", customer);

// app.use("/recipe", recipe);

app.use((req, res, next) => {
    res.status(404).send('Not Found');
});

app.listen(5000, () => {
    console.log('Server running on port 5000');
});