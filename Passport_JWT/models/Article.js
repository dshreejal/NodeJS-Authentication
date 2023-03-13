const mongoose = require('mongoose');
const { Schema } = mongoose;

const ArticleSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
});

const Article = mongoose.model('article', ArticleSchema);
module.exports = Article;