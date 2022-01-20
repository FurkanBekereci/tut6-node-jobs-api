const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../errors');
const User = require('../models/User');

const register = async (req,res) => {
    const user = await User.create({...req.body})
    res.status(StatusCodes.CREATED).json(user.getMe())
}
const login = async (req,res) => {
    const {email, password} = req.body;
    //email-pw checking
    if(!email || !password)
        throw new BadRequestError('Please provide email and password');

    const user = await User.findOne({email});

    // user checking 
    if(!user)
        throw new UnauthenticatedError('Invalid credentials');

    // password match checking
    const isPasswordMatch = await user.isPasswordMatch(password); 
    if(!isPasswordMatch)
        throw new BadRequestError('Wrong password');

    res.status(StatusCodes.OK).json(user.getMe())
}


module.exports = {
    register, login
}