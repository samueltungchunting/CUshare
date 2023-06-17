const express = require('express')
const cors = require('cors')  // treat as allowing incoming request
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const imageDownloader = require('image-downloader') // handle image location and downlaod
const fs = require("fs")
const multer = require("multer")  // handle form-data requests
const User = require("./models/User.js")
const Item = require('./models/Item.js')
const Reservations = require('./models/Reservation.js')

require('dotenv').config()  // enable to get the .env variables
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

app.post('/user-item', (req, res) => {
    const {
        title, address, addedPhotos,
        description, cautions, extraInfo, 
        borrowDate, returnDate, charge, free
    } = req.body
    const { token } = req.cookies
    jwt.verify(token, tokenSecret, {}, async (err, userInfo) => {
        const addedItem = await Item.create({
            owner: userInfo.id, title, address, 
            photos: addedPhotos, description, cautions, extraInfo, 
            borrowDate, returnDate, charge, free
        })
        res.json(addedItem)
    })
})

app.get('/user-items', (req, res) => {
    const { token } = req.cookies
    jwt.verify(token, tokenSecret, {}, async (err, userInfo) => {
        const userItemList = await Item.find({ owner: userInfo.id })
        res.json(userItemList)
    })
})

app.delete('/user-deleteItems/:itemID', async (req, res) => {
    const {itemID} = req.params
    const deletedItem = await Item.findByIdAndDelete({_id: itemID}) // findByIdAndRemove returns the original one
    res.json(deletedItem)
})

app.get('/single-item/:itemId', async (req, res) => {
    const { itemId } = req.params
    const singleItemInfo = await Item.findById(itemId)
    res.json(singleItemInfo)
})

app.put('/single-item', async (req, res) => {
    const {
        itemId, title, address, addedPhotos,
        description, cautions, extraInfo, 
        borrowDate, returnDate, charge
    } = req.body
    const singleItemInfo = await Item.findById(itemId)
    const { token } = req.cookies
    jwt.verify(token, tokenSecret, {}, async (err, userInfo) => {
        if(userInfo.id === singleItemInfo.owner.toString()) {
            singleItemInfo.set({
                title, address, photos: addedPhotos, description,
                cautions, extraInfo, borrowDate, returnDate, charge
            })
            await singleItemInfo.save()
            res.json("The Item info is edited")
        }
    })
})

app.get('/api/home_allItems', async (req, res) => {
    const allItemsInfo = await Item.find()
    res.json(allItemsInfo)
})

app.get('/item-review/:itemId', async (req, res) => {
    const { itemId } = req.params
    const singleItemInfo = await Item.findById(itemId).populate('owner')
    res.json(singleItemInfo)
})

app.post('/reserve', async (req, res) => {
    const {
        itemId, userBorrowDate, userReturnDate,
        userName, userPhoneNum, 
    } = req.body
    const { token } = req.cookies
    try{
        jwt.verify(token, tokenSecret, {} , async (err, userInfo) => {
            if(err) throw err
            const reserveInfo = await Reservations.create({
                item: itemId, user: userInfo.id,
                userBorrowDate, userReturnDate, userName, userPhoneNum
            })
            res.json(reserveInfo)
        })
        const updatedReserveStatus = await Item.findOneAndUpdate({_id: itemId}, {isReserved: true}, {new: true})
    } catch (err) {
        res.json("Input errors")
    }
})

app.get('/user-reservations', (req, res) => {
    const { token } = req.cookies
    jwt.verify(token, tokenSecret, {}, async (err, userInfo) => {
        if(err) throw err
        const userReservations = await Reservations.find({ user: userInfo.id}).populate('item')
        res.json(userReservations)
    })
})

app.delete('/user-cancelReservations/:reservationID', async(req, res) => {
    const { reservationID } = req.params

    const reservedItem = await Reservations.findById(reservationID)
    const reservedItemID = reservedItem.item
    await Item.findOneAndUpdate({_id: reservedItemID}, {isReserved: false}, {new: true})
    const cancelledReservation = await Reservations.findByIdAndDelete({_id: reservationID})
    res.json(cancelledReservation)
})

app.listen(4000)


