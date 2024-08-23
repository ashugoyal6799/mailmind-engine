const express = require('express');
const { getLabels, getMessages } = require('../controllers/gmailController');

const router = express.Router();

router.get('/labels', getLabels);
router.get('/messages', getMessages);

module.exports = router;
