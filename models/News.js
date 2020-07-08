const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const NewsSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    allowComments: {
        type: Boolean,
        default: true
    },
    image: {
        type: String,
        required: false
    },
    comments: [
        {
            commentBody : {
                type: String,
                required: true
            },
            commentDate : {
                type: Date,
                default: Date.now()
            },
            commentUser : {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        }
    ],
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    date: {
        type: Date,
        default: Date.now()
    }
})

/* Más tarde se agregarán los campos de Usuarios y de Categoría */ 

const News = mongoose.model('News', NewsSchema)


module.exports = {
    News
}