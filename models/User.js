const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true, 'Please provide name'],
        minLength : 3,
        maxLength : 50,
    },
    email : {
        type : String,
        required : [true, 'Please provide email'],
        match : [ /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ , 'Please provide a valid email.' ],
        unique : true
    },
    password : {
        type : String,
        required : [true, 'Please provide password'],
        minLength : 6
    },

})

userSchema.pre('save' , async function(){

    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password,salt);
})

userSchema.methods.getMe = function(){
    return {
        name : this.name,
        token : jwt.sign(
                {userId:this._id,name:this.name},
                process.env.JWT_SECRET,
                {expiresIn : process.env.JWT_EXPIRATION}
            )
    }
}

userSchema.methods.isPasswordMatch = async function(otherPassword){
    return await bcrypt.compare(otherPassword, this.password)
}

module.exports = mongoose.model('User',userSchema);