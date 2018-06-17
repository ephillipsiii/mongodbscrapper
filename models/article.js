//dependencies
var mongoose = require("mongoose");
var Note = require("/note");
//schema class
var Schema = mongoose.Schema;
//article schema
var ArticleSchema= new Schema({
    title: {
        type: String,
        required: true
    },
    summary: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    saved: {
        type: Boolean,
        default: false
    },
    notes: [{
        type: Schema.Types.ObjectID,
        ref: "Note"
    }]
});
// creating the model with the schema and exporting it
var Article = mongoose.model("Article", ArticleSchema);
module.exports = Article;