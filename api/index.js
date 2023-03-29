const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const imageDownloader = require('image-downloader')
const fs = require("fs")
const multer = require("multer")
const User = require("./models/User.js")
const Place = require('./models/Place.js')
const Booking = require('./models/booking.js')

require('dotenv').config()
const app = express()

const tokenSecret = 'sklas3j39fdsfajf320if'
const UserSalt = bcrypt.genSaltSync(10)

// hAmJXg2x1dLyTQwc
app.use(express.json())
app.use(cookieParser())
app.use('/uploads', express.static(__dirname + '/uploads'))
app.use(cors({
    credentials: true,
    origin: 'http://127.0.0.1:5173',
}))

mongoose.connect(process.env.MONGO_URL) // see line 14


app.get('/test', (req, res) => {
    res.json({msg: "I want this to go 127.0.0.1:5173"})
})


app.post('/register', async (req, res) => {
    const { name, email, password } = req.body

    try {
        const registingUser = await User.create({
            name,
            email,
            password: bcrypt.hashSync(password, UserSalt)
        })
        res.status(200).json(registingUser)
    } catch (error) {
        res.status(422).json("error123123123")
    }
})

app.post('/login', async (req, res) => {
    const { email, password } = req.body
    const loginUser = await User.findOne({ email })
        if(!loginUser) res.status(422).json("email not found")
        else {
            const isValidPassword = bcrypt.compareSync(password, loginUser.password)
            if(isValidPassword) {
                jwt.sign({
                    email: loginUser.email,
                    id: loginUser._id
                }, tokenSecret, {}, (err, token) => { // DIU this one is special, shd (err, token)
                    if(err) throw err;
                    else {
                        console.log(loginUser.email)
                        res.cookie('token', token).status(200).json(loginUser)
                    }
                })
            } else {
                res.status(422).json("wrong password")
            }
        }
})

app.get('/profile', (req, res) => {
    const { token } = req.cookies
    if(token) {
        jwt.verify(token, tokenSecret, {}, async (err, userInfo) => {
            if(err) throw err; 
            const userFullInfo = await User.findById(userInfo.id)
            res.json(userFullInfo)
        })
    } else {
        res.json(null) // inside the json dont return anything!!! otherwise --> always have something --> always true
    }
})

app.post('/logout', (req, res) => {
    res.cookie('token', '').json(true)
})

// At this moment if received an invalid link, the server will crash
app.post('/upload-by-link', async (req, res) => { 
    const { link } = req.body
    const uploadDateJPG = Date.now() + '.jpg'
    try {
        await imageDownloader.image({
            url: link,
            dest: __dirname + '/uploads/' + uploadDateJPG,
        })
        res.json(uploadDateJPG)
    } catch (err) {
        res.json("Invalid link" + err)
    }
})

const photosClickUploadMiddleware = multer({dest: 'uploads/'})
app.post('/upload-by-click', photosClickUploadMiddleware.array('photos', 100), (req, res) => {
    const {files} = req
    const returnUploadedPhotos = []
    for (let i = 0; i < files.length; i++) {
        const { originalname, path } = files[i]
        const seperatedOriginalname = originalname.split('.')
        const splitFileFormat = seperatedOriginalname[seperatedOriginalname.length - 1]
        newPath = path + '.' + splitFileFormat
        fs.renameSync(path, newPath)
        returnUploadedPhotos.push(newPath.replace('uploads/', ''))
    }
    res.json(returnUploadedPhotos)
})

app.post('/user-accommodation', (req, res) => {
    const {
        title, address, addedPhotos,
        description, perks, extraInfo, checkIn,
        checkOut, maxGuests, price
    } = req.body
    const { token } = req.cookies
    jwt.verify(token, tokenSecret, {}, async (err, userInfo) => {
        const registeredPlace = await Place.create({
            owner: userInfo.id, title, address, 
            photos: addedPhotos, description, perks, extraInfo, 
            checkIn, checkOut, maxGuest: maxGuests, price
        })
        res.json(registeredPlace)
    })
})

app.get('/user-accommodations', (req, res) => {
    const { token } = req.cookies
    jwt.verify(token, tokenSecret, {}, async (err, userInfo) => {
        const userPlaceList = await Place.find({ owner: userInfo.id })
        res.json(userPlaceList)
    })
})

app.get('/single-accommodation/:placeId', async (req, res) => {
    const { placeId } = req.params
    const singlePlaceInfo = await Place.findById(placeId)
    res.json(singlePlaceInfo)
})

app.put('/single-accommodation', async (req, res) => {
    const {
        placeId, title, address, photoLink, addedPhotos,
        description, perks, extraInfo, checkIn,
        checkOut, maxGuests, price
    } = req.body
    const singlePlaceInfo = await Place.findById(placeId)
    const { token } = req.cookies
    jwt.verify(token, tokenSecret, {}, async (err, userInfo) => {
        if(userInfo.id === singlePlaceInfo.owner.toString()) {
            singlePlaceInfo.set({
                title, address, photos: addedPhotos, description,
                perks, extraInfo, checkIn, checkOut, maxGuest: maxGuests, price
            })
            await singlePlaceInfo.save()
            res.json("The place info is edited")
        }
    })
})

app.get('/all-accommodations', async (req, res) => {
    const allAccommodationsInfo = await Place.find()
    res.json(allAccommodationsInfo)
})

app.get('/place-review/:placeId', async (req, res) => {
    const { placeId } = req.params
    const singlePlaceInfo = await Place.findById(placeId)
    res.json(singlePlaceInfo)
})

app.post('/reserve', (req, res) => {
    const {
        placeId, guestNum, userCheckIn, userCheckOut,
        userName, userPhoneNum, price
    } = req.body
    const { token } = req.cookies
    try{
        jwt.verify(token, tokenSecret, {} , async (err, userInfo) => {
            if(err) throw err
            const reserveInfo = await Booking.create({
                place: placeId, user: userInfo.id, guestNum,
                userCheckIn, userCheckOut, userName, userPhoneNum, price
            })
            res.json(reserveInfo)
        })
    } catch (err) {
        res.json("Input errors")
    }
})

app.get('/user-bookings', (req, res) => {
    const { token } = req.cookies
    jwt.verify(token, tokenSecret, {}, async (err, userInfo) => {
        if(err) throw err
        const userBookings = await Booking.find({ user: userInfo.id}).populate('place')
        res.json(userBookings)
    })

})


app.listen(4000)


