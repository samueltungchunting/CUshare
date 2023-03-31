const mongoose = require('mongoose')
const { Schema } = mongoose

const itemSchema = new Schema({
    owner: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    title: String,
    address: String,
    photos: [String],
    description: String,
    cautions: [String],
    extraInfo: String,
    borrowDate: Date,
    returnDate: Date,
    free: Boolean,
    charge: Number,
})

const itemModel = mongoose.model("Item", itemSchema)
module.exports = itemModel 