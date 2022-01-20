const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
    company : {
        type : String,
        required : [true, 'Please provide the company name'],
        maxLength : 50,
    },
    position : {
        type : String,
        required : [true, 'Please provide the position'],
        maxLength : 100,
    },
    status : {
        type : String,
        enum : ['interview', 'declined', 'pending'],
        default : 'pending',
    },
    createdBy : {
        type : mongoose.Types.ObjectId,
        ref : 'User',
        required : [true, 'Please provide the user'],
    }
},{timestamps : true})

//timestamp provides mongo to createAt and updatedAt fields automatically

module.exports = mongoose.model('Job',JobSchema);