const mongoose = require('mongoose');

require('../models/Category');

const Category = mongoose.model('Category');

require('../models/News');

const News = mongoose.model('News'); 


function displayCategories(req, res) {
    Category.find({})
        .then(categories => {
            if(!categories) {
                let mensaje = "No hay categorías disponibles"
                res.render('categories/index', {
                    mensaje
                });
            } else {
                res.render('categories/index', { categories });
            }

        })
        .catch(err => {
            console.log(err)
        })

    
}

function categoryForm(req, res) {
    res.render('categories/add-category')
}


function createCategory(req, res) {

    let errors = []

    if(!req.body.title) {
        errors.push({text: 'No puedes crear una categoría sin título'})
    }

    if(errors.length > 0) {
        res.render('categories/add', {
            errors
        });
    } else {

        const category = {
            title: req.body.title
        }

        new Category(category).save()
            .then(category => {
                console.log(category)
                res.redirect('/categories')
            })
            .catch(err => {
                console.log(err)
            })

    }
}

function postPerCategories(req, res) {
    let title = req.params.title;

    Category.findOne({title: title})
        .then(category => {
            
            if (!category) {
                let mensaje = "No existe esa categoría"
                res.render('categories/index', {
                    mensaje
                });
            } else {
                News.find({ category: category.id})
                    .then(news => {
                        let titulo = category.title;
                        res.render(`categories/category`, {
                          titulo,
                          category,
                          news
                        });
                    })
                    .catch(err => {
                        throw new Error('Algo pasó con la base de datos')
                    })
            }

        })
        .catch(err => {
            console.log(err)
        })

}



module.exports = {
    displayCategories,
    createCategory,
    categoryForm,
    postPerCategories
}
