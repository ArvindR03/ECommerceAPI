const jwt = require('jsonwebtoken')
const AuthModel = require('../../model/auth/auth')

async function authenticateSeller(req, res, next) {
    
    try {

        const user = await AuthModel.findById(req.user.userID)

        if (!user) {
            return res.status(404).json({error:"user db query error"})
        } else if (user.seller === true) {
            next()
        } else {
            return res.status(403).json({error:"user does not have seller privileges to complete this action"})
        }

    } catch (e) {
        return res.status(500).json({error:e.message})
    }

}

module.exports = authenticateSeller