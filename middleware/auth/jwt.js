const jwt = require('jsonwebtoken')

function authenticateToken(req, res, next) {
    const token = req.header('Authorization')
    if (!token) {
        return res.status(401).json({error:"no authorization token in header, include Authorization"})
    } else {

        jwt.verify(token, 'secret-key', (error, user) => {
            if (error) {
                return res.status(403).json({error:"invalid token"})
            } else {
                
                req.user = user
                next()
            }
        })
    }

}

module.exports = authenticateToken