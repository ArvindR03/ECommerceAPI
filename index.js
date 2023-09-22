const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()



mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection
db.on('error', (error) => {
    console.log(error)
})

db.once('connected', () => {
    console.log('Database Connected');
})




const app = express()
app.use(express.json())

const PORT = process.env.PORT || 3000

const auth_routes = require('./routes/auth/auth_routes')
app.use('/api/auth', auth_routes)

const ecommerce_routes = require('./routes/ecommerce_routes')
app.use('/api/products', ecommerce_routes)

app.listen(PORT, () => {
    console.log(`server initialised at ${PORT}`)
})

module.exports = app