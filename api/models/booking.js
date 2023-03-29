const mongoose = require('mongoose')
const { Schema } = mongoose

const bookingSchema = new Schema({
    place: {type: mongoose.Schema.Types.ObjectId, required: true, ref: "Place"},
    user: {type: mongoose.Schema.Types.ObjectId, required: true, ref: "User"},
    userCheckIn: {type: Date, required: true},
    userCheckOut: {type: Date, required: true},
    userName: {type: String, required: true},
    userPhoneNum: {type: String, required: true},
    guestNum: Number,
    price: Number
})

const bookingModel = mongoose.model("Booking", bookingSchema)
module.exports = bookingModel