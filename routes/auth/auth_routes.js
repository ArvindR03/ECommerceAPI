const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const router = express.Router()
const AuthModel = require('../../model/auth/auth')
const authenticateToken = require('../../middleware/auth/jwt')
module.exports = router

// TODO: possibly add a password evaluation algorithm?
// TODO: add a limit for requesting secret-keys
// TODO: handle the duplicate username error properly

// user registration
router.post('/register', async (req, res) => {
    try {
        const username = req.body.username
        const password = req.body.password
        const seller = req.body.seller || false

        // check neither are blank

        if (!username || !password) {
            return res.status(400).json({message:"username and password required"})
        } else {
            const hashedPassword = await bcrypt.hash(password, 10)
            
            const user = new AuthModel({
                username: username,
                password: hashedPassword,
                seller: seller
            })

            const userToSave = await user.save()
            res.status(201).json({message:"user registered successfully", user:user.username, seller_privileges:user.seller})
        }

    } catch (e) {
        // catching duplicate username error
        if (e.name === 'MongoError' && e.code === 11000) {
            return res.status(400).json({ error: 'cannot update immutable field i.e. productID or createdAt' })
        } else {
            return res.status(500).json({error:e.message})
        }
    }
})


// user login
router.post('/login', async (req, res) => {

    try {

        const username = req.body.username
        const password = req.body.password

        // check that the user exists

        const user = await AuthModel.findOne( {username:username} )

        if (!user) {
            return res.status(401).json({error:"username not in database"})
        }

        // check that the passwords match

        else if (!(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({message:"password does not match"})
        }

        // if they do match:

        else {
            const token = jwt.sign({userID:user._id}, 'secret-key', {
                expiresIn:'2h'
            })

            const seller = user.seller

            res.status(200).json({
                message:"Successful login. Do not share this key with anyone, it expires in 2 hours",
                secretkey: token,
                seller_privileges: seller
            })
        }

    } catch (e) {
        res.status(500).json({error:e.message})
    }

})

// make sure to get rid of this

router.get('/dev', async (req, res) => {

    try {

        const users = await AuthModel.find()
        return res.status(200).json(users)

    } catch (e) {
        res.status(500).json({error:e.message})
    }
})