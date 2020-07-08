const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');

require('../models/User');

const User = mongoose.model('User'); 


function registerForm(req, res) {

    res.render('users/register')

}

function loginForm(req, res) {
    res.render('users/login')
}

function registerUser(req, res)  {

    let errors = [];

    const { name, lastName, email, password } = req.body

    if(!name || name === '') {
        errors.push({text: 'Debes colocar un nombre para registrarte'})
    }

    if(!lastName || lastName === '') {
        errors.push({text: 'Debes colocar un apellido para registrarte'})
    }

    if(!email || email === '') {
        errors.push({text: 'Debes colocar un correo electrónico para registrarte'})
    }

    if(!password || password.length < 5) {
        errors.push({text: 'Debes colocar un password y que éste contenga más de cuatro caracteres'})
    }

    if(errors.length > 0) {
        res.render('users/register', { 
            errors,
            name,
            lastName,
            email,
            password
        });

    } else {

        const user = { name, lastName, email, password };

        // Encriptación de la contraseña
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                if(err) {
                    throw err;
                } else {
                    user.password = hash

                    new User(user)
                      .save()
                      .then(user => {
                        console.log(user);
                        req.flash('success_msg', 'Congratulations, you have registered successfully');
                        res.redirect('/users/login');
                      })
                      .catch(err => {
                        throw new Error(err);
                      });

                }
            })
        })   
    }

}

function loginUser(req, res, next) {

    passport.authenticate('local', {
      successRedirect: '/news',
      failureRedirect: '/users/login',
      failureFlash: true
    })(req, res, next); 

}

function logOut(req, res) {
    req.logOut()
    req.flash('success_msg', 'You are logged out'); 
    res.redirect('/users/login'); 
}


/* funciones que se van a exportar */

module.exports = {
    registerForm,
    registerUser,
    loginForm,
    loginUser,
    logOut
}

/* */
