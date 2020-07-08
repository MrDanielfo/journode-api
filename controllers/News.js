const mongoose = require('mongoose'); 

const fs = require('fs'); 

const path = require('path');

require('../models/News')
// Se llamará el modelo de Categoría para poder colocarlas en los select
require('../models/Category')

const News = mongoose.model('News');

const Category = mongoose.model('Category')

function showAllNews(req, res) {

    News.find({})
        .populate('category', 'title')
        .sort({date : 'desc'})
        .then(news => {
            res.render('news/index', {
                news
            });
        })
        .catch(err => {
            console.log(err)
        })

    
}

function showAllNewsAdmin(req, res) {

    News.find({})
        .populate('category', 'title')
        .sort({ date: 'desc' })
        .then(news => {
            res.render('admin/index', {
                news
            });
        })
        .catch(err => {
            console.log(err)
        })
}

function newsForm(req, res) {
    // Se coloca categorías aquí para que estén disponibles para el select
    Category.find({})
            .then(categories => {
                res.render('news/add', {
                    categories
                }); 
            })
            .catch(err => {
                console.log(err)
            })
}

function newsFormEdit(req, res) {

    let id = req.params.id;
    Category.find({})
        .then(categories => {
            News.findOne({ _id: id })
                .populate('category')
                .then(news => {
                    res.render('admin/news-edit', {
                        categories,
                        news
                    });
                })
                .catch(err => {
                    console.log(err)
                })

            
        })
        .catch(err => {
            console.log(err)
        })
}

function addNews(req, res) {

    let errors = []; 

    let allowComments; 
    console.log(req.body.allowComments)

    if(req.body.allowComments) {
        allowComments = true
    } else {
        allowComments = false
    }

    if(!req.body.title) {
        errors.push({text: 'Por favor, añade un título a la noticia'})
    }  else if (!req.body.body) {
        errors.push({text: 'Por favor añade el cuerpo de la noticia'})
    } else if (!req.body.category) {
        errors.push({text: 'Por favor, selecciona una categoría'})
    }

    const { title, body, category } = req.body
    let image = req.files.image

    // Validad imagen 
    // Extensiones permitidas 

    let extensiones = ['png', 'jpg', 'gif', 'jpeg']

    // Se intuye que la propiedad name viene siempre dentro de los archivos subidos 
    let nombreCortado = image.name.split('.')
    let extArchivo = nombreCortado[nombreCortado.length - 1]

    if (extensiones.indexOf(extArchivo) < 0) {
        errors.push({text: 'La extensión de archivo que subiste no es válida, sólo se admite .jpg, .png, .gif y .jpeg'})

    }

    if(errors.length > 0) {
        res.render('news/add', {
            errors,
            title: req.body.title,
            body: req.body.body,
            category: req.body.category
        })
    } else {

        // Cambiar nombre al archivo 
        let aleatorio = Math.floor((Math.random() * 2000) + 1)
        let nombreArchivo = `${aleatorio}-${new Date().getMilliseconds()}.${extArchivo}`

        const newPost = {
            title,
            body,
            category,
            allowComments,
            image: nombreArchivo,
            user: req.user.id
        }

        // Use the mv() method to place the file somewhere on your server
        image.mv(`uploads/img/${nombreArchivo}`, (err) => {
            if (err)
                console.log(err)

            // Logica de Modelo 
            new News(newPost).save()
                .then(post => {
                    console.log(post);
                    res.redirect('/news')
                })
                .catch(err => {
                    console.log(err);
                })

        });
 
    }

}

function editNews(req, res) {
    let errors = [];

    let allowComments;
    console.log(req.body.allowComments);

    if (req.body.allowComments) {
      allowComments = true;
    } else {
      allowComments = false;
    }

    if (!req.body.title) {
      errors.push({ text: 'Por favor, añade un título a la noticia' });
    } else if (!req.body.body) {
      errors.push({ text: 'Por favor añade el cuerpo de la noticia' });
    } else if (!req.body.category) {
      errors.push({ text: 'Por favor, selecciona una categoría' });
    }

    const { title, body, category, idNoticia, hiddenImg } = req.body;

    let image; 

    let editPost; 

    // validación por si no se cambia la imagen

    if(req.files.image) {

        // función para borrar imagen
        borrarImagen(hiddenImg)

        image = req.files.image;

        // Validad imagen
        // Extensiones permitidas

        let extensiones = ['png', 'jpg', 'gif', 'jpeg'];

        // Se intuye que la propiedad name viene siempre dentro de los archivos subidos
        let nombreCortado = image.name.split('.');
        let extArchivo = nombreCortado[nombreCortado.length - 1];

        if (extensiones.indexOf(extArchivo) < 0) {
          errors.push({text: 'La extensión de archivo que subiste no es válida, sólo se admite .jpg, .png, .gif y .jpeg'});
            return

        }

        let aleatorio = Math.floor(Math.random() * 2000 + 1);
        let nombreArchivo = `${aleatorio}-${new Date().getMilliseconds()}.${extArchivo}`;

        editPost = { title, body, category, allowComments, image: nombreArchivo };

        // Método para borrar imagen anterior y suplirla por la nueva 
        image.mv(`uploads/img/${editPost.image}`, err => {
          if (err) console.log(err);
        });

    } else {
        image = hiddenImg
        editPost = { title, body, category, allowComments, image };
    }
    
    if(errors.length > 0) {
        res.render('admin/news-edit', {
            errors
        })
    } else {

        News.findOne({_id : idNoticia})
        .then(noticia => {
            noticia.title = editPost.title;
            noticia.body = editPost.body;
            noticia.category = editPost.category;
            noticia.allowComments = editPost.allowComments;
            noticia.image = editPost.image;

            noticia.save()
                .then(post => {
                    console.log(post)
                    res.redirect('/admin')

                })
                .catch(err => {
                    console.log(err)
                })   
        })
        .catch(err => {
            console.log(err)
        })

    }

}

function getNewById(req, res) {

    let id = req.params.id
    
    News.findOne({_id : id})
        .populate('user')
        .populate('comments.commentUser') // esto nos permite extraer los datos de los usuarios que comentan
        .populate('category', 'title')
        .then(news => {
            res.render('news/single', {
                news
            });
        })
        .catch(err => {
            console.log(err)
        })

}

function addComment(req, res) {
    let errors = []

    let id = req.params.id

    if(!req.body.comentario) {
        errors.push({text: 'No puedes enviar un comentario vacío'})
    }

    if(errors.length > 0) {
        res.render('news/single', {
            errors
        })
    } else {

        News.findOne({_id : id})
            .then(noticia => {
                const comment = {
                    commentBody : req.body.comentario,
                    commentUser : req.user.id
                }

                noticia.comments.unshift(comment)
                noticia.save()
                        .then(() => {
                            res.redirect(`/news/single/${id}`);
                        })
                        .catch(err => {
                            console.log(err)
                        })

            })
            .catch(err => {
                console.log(err)
            })

    }

}

function deleteNewImage(req, res) {
    let id = req.params.id
    let image = req.params.image;
    borrarImagen(image)

    News.deleteOne({_id: id})
        .then(() => {
            res.redirect('/admin')
        })
        .catch(err => {
            console.log(err)
        })
}


function borrarImagen(urlImagen) {
  let pathImagen = path.resolve(__dirname, `../uploads/img/${urlImagen}`);

  if (fs.existsSync(pathImagen)) {
    fs.unlinkSync(pathImagen);
  }
}

module.exports = {
    newsForm,
    newsFormEdit,
    addNews,
    editNews,
    showAllNews,
    getNewById,
    showAllNewsAdmin,
    deleteNewImage,
    addComment
}

