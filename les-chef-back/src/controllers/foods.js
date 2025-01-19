const asyncHandler = require("express-async-handler");
const Foods = require("../models/foodsModel");

const getContents = asyncHandler(async(req, res) => {

});

module.exports = { getContents };