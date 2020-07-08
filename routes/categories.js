const express = require('express');
const router = express.Router();
// De preferencia poner el ensure primero 
const { ensureAuthenticated } = require('../helpers/auth');

const { displayCategories, createCategory, categoryForm, postPerCategories } = require('../controllers/Category');

router.get('/add-category', ensureAuthenticated, categoryForm); 

router.get('/', displayCategories)

router.get('/:title', postPerCategories)


router.post('/', ensureAuthenticated, createCategory)



module.exports = router; 

