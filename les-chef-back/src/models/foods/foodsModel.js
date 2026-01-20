const mongoose = require("mongoose");

const FoodsSchema = mongoose.Schema({
    userId: {
        type: String
    },
    place: [
        {
            name: {
                type: String
            },
            foodList: [
                {
                    name:{
                        type: String
                    },
                    volume:{
                        type: Number
                    },
                    unit: {
                        type: String
                    },
                    expirate: {
                        type: Date
                    }
                }
            ]
        }
    ],
    createAt: {
        type: Date,
        default: () => new Date().setMilliseconds(0)
    },
    updateAt: {
        type: Date,
        default: () => new Date().setMilliseconds(0)
    }
})

const Foods = mongoose.model("foods", FoodsSchema);

module.exports = Foods;