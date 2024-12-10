const asyncHandler = require("express-async-handler");

const postJoin = asyncHandler(async (req, res) => {
    console.log(req.body);
    res.send("ok");
});

module.exports = postJoin;