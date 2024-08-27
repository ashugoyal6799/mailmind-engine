const express = require('express');
const { querySimilarEmails } = require('../services/searchService');
const { generateEmbedding } = require('../services/openaiService');
const {getSearchedEmails} = require('../controllers/searchController');  

const router = express.Router();

router.post('/search-similar', getSearchedEmails);

module.exports = router;
