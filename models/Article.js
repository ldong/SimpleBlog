module.exports = function( mongoose ) {
    var Schema   = mongoose.Schema;

    var Comment = require("./Comment");

    var mongoosePaginate = require('mongoose-paginate');
    

    var ArticleSchema = new Schema({
        title: String,
        content: String,
        author: String,
        comments: [Comment.schema],
        tags: [String],
        createDate: {
            type: Date,
            default: Date.now
        }
    });

    ArticleSchema.plugin(mongoosePaginate)

    mongoose.model( 'Article', ArticleSchema );
}
