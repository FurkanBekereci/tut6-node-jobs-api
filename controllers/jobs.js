const { StatusCodes } = require('http-status-codes');
const { NotFoundError, BadRequestError } = require('../errors');
const Job = require('../models/Job');

const getJobs = async (req,res) => {
    const jobs = await Job.find({createdBy : req.user.userId}).sort('createdAt');
    res.status(StatusCodes.OK).json({total: jobs.length, list : jobs})
}
const getJob = async (req,res) => {
    const {user: {userId},params: {id}} = req;

    const job = await Job.findOne({_id:id,createdBy:userId});

    if(!job) 
        throw new NotFoundError(`Job with id:${id} not found!`)

    res.status(StatusCodes.OK).json(job)
}
const insertJob = async (req,res) => {
    req.body = {...req.body, createdBy : req.user.userId}
    const insertedJob = await Job.create(req.body);
    res.status(StatusCodes.CREATED).json(insertedJob);
}
const updateJob = async (req,res) => {
    const {
        user: {userId},
        params: {id}, 
        body : {company , position}
    } = req;

    if(company === '' || position === ''){
        throw new BadRequestError('Company or position could not be empty');
    }

    const job = await Job.findOneAndUpdate(
        { _id:id, createdBy:userId },
        req.body,
        {new : true, runValidators : true}
    );

    if(!job) 
        throw new NotFoundError(`Job with id:${id} not found!`)


    res.status(StatusCodes.OK).json(job);
}
const deleteJob = async (req,res) => {
    const {
        user: {userId},
        params: {id}
    } = req;

    const job = await Job.findOneAndRemove({_id:id, createdBy:userId})

    res.status(StatusCodes.OK).json(job)
}



module.exports = {
    getJobs,getJob,insertJob,updateJob,deleteJob
}