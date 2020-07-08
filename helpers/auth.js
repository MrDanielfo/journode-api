ensureAuthenticated = function(req, res, next) {

    if(req.isAuthenticated()) {
        return next()
    }

    req.flash('error_msg', 'Sin autorización')
    res.redirect('/users/login')

}

module.exports = {
    ensureAuthenticated
}