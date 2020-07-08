const express = require('express');
const router = express.Router();

const { ensureAuthenticated } = require('../helpers/auth');

const { showAllNewsAdmin, newsFormEdit, editNews, deleteNewImage } = require('../controllers/News')


router.get('/', ensureAuthenticated, showAllNewsAdmin)

router.get('/news-edit/:id', ensureAuthenticated, newsFormEdit)

router.post('/', ensureAuthenticated, editNews)

router.get('/news-delete/:id/:image', ensureAuthenticated, deleteNewImage)


module.exports = router; 
