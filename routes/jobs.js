const express = require('express');
const { getJobs, insertJob, getJob, updateJob, deleteJob } = require('../controllers/jobs');
const router = express.Router();

router.route('/').get(getJobs).post(insertJob);
router.route('/:id').get(getJob).patch(updateJob).delete(deleteJob)

module.exports = router;