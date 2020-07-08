const express = require('express');
const router = express.Router();

const { ensureAuthenticated } = require('../helpers/auth');


const { newsForm, addNews, showAllNews, getNewById, addComment } = require('../controllers/News')


router.get('/', showAllNews)

router.get('/add', ensureAuthenticated, newsForm)

router.post('/', ensureAuthenticated, addNews)

router.get('/single/:id', getNewById)

router.post('/comment/:id', ensureAuthenticated, addComment)


module.exports = router;