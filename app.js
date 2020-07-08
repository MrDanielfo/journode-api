const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const path = require('path')
const handlebars = require('express-handlebars')
const flash = require('connect-flash')
const session = require('express-session')
const fileUpload = require('express-fileupload'); 
const passport = require('passport');


const { PORT, MONGOURI } = require('./config/db')

const app = express();

// parse application/x-www-form-urlencoded and json 
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json()); 
// Static Folder 
app.use(express.static(path.join(__dirname, 'public'))); 
// Se pueden colocar más de dos folders estáticos 
app.use(express.static(path.join(__dirname, 'uploads'))); 

// Passport Config

require('./config/passport')(passport)

// Handlebars middleware

const {stripTags, truncate, formatDate} = require('./helpers/handlebars')

app.engine('handlebars', handlebars({
        helpers: {
            truncate,
            stripTags,
            formatDate
        },
        defaultLayout: 'main'
    }
));

app.set('view engine', 'handlebars'); 

// Mensajes flash
// Cada que se llame flash, se debe declarar antes session

app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
); 

// Passport Middleware 
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg'); 
  res.locals.error_msg = req.flash('error_msg'); 
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null
  next();
});

app.use(fileUpload())

const news = require('./routes/news');

const categories = require('./routes/categories');

const admin = require('./routes/admin');

const users = require('./routes/user');


app.get('/', (req, res) => {
    let saludo = 'Bienvenido'
    let titulo = 'JourNode'

    res.render('index', {
        saludo,
        titulo
    })
})

mongoose.connect(MONGOURI, {
    useNewUrlParser: true
})
.then(() => {

    console.log('MONGODB connected')

    app.listen(PORT, () =>
      console.log(`Servidor listo en http://localhost:${PORT}`)
    );
     
})
.catch(err => {
    console.log(err)
})

app.use('/news', news)
app.use('/categories', categories)
app.use('/admin', admin)
app.use('/users', users)






