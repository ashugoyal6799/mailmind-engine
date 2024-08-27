const express = require('express');

const {sendReportsController} = require('../controllers/reportsController');  

const router = express.Router();

router.post('/send-reports', sendReportsController);

module.exports = router;
