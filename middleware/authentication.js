const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { UnauthenticatedError} = require('../errors');

module.exports = async (req,res,next) => {
    //check header
    const {authorization} = req.headers; 

    if(!authorization || !authorization.startsWith('Bearer '))
        throw new UnauthenticatedError('Authentication invalid!!')

    const [bearer,token] = authorization.split(' ');

    try {
        req.user = {...jwt.verify(token, process.env.JWT_SECRET),iat:undefined,exp:undefined};
        next()
    } catch (error) {
        throw new UnauthenticatedError('Authentication invalid!!');
    }

} 
