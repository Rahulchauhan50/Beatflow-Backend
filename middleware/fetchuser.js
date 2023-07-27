const jwt = require('jsonwebtoken')
const JWT_SECRET = 'MusicApplication';

const fetchuser = (req, res, next) =>{
    const token = req.header('auth-token')
    if(!token){
       return res.status(401).send({error:"access denied"})
    }
    try {
        const data = jwt.verify(token,JWT_SECRET)
        req.user = data.user;
        next()
        
    } catch (error) {
        res.status(401).send({error:"access denied"})
        
    }
}

module.exports = fetchuser