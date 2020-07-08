const express = require('express');
const router = express.Router();


const { registerForm, registerUser, loginForm, loginUser, logOut }  = require('../controllers/User');



router.get('/register', registerForm)

router.post('/', registerUser)

router.get('/login', loginForm)

router.post('/login', loginUser);

router.get('/logout', logOut)



module.exports = router; 
