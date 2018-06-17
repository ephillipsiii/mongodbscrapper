//dependencies and creating a schema class
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
//creating a schema
var NoteSchema = new Schema({
    body: {
        type: String
    },
    article: {
        type: Schema.Types.ObjectId,
        ref: "Article"
    }
});
//creating a model based with the schema
var Note = mongoose.model("Note", NoteSchema);

module.exports = Note;