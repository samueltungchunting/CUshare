const mongoose = require('mongoose')
const { Schema } = mongoose

const reservationSchema = new Schema({
    item: {type: mongoose.Schema.Types.ObjectId, required: true, ref: "Item"},
    user: {type: mongoose.Schema.Types.ObjectId, required: true, ref: "User"},
    userBorrowDate: {type: Date, required: true},
    userReturnDate: {type: Date, required: true},
    userName: {type: String, required: true},
    userPhoneNum: {type: String, required: true},
})

const reservationModel = mongoose.model("Reservation", reservationSchema)
module.exports = reservationModel