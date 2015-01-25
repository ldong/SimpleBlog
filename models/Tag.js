module.exports = function( mongoose ) {
    var Schema   = mongoose.Schema;

    var TagSchema = new Schema({
        name: String,
        numberOf: Number,
        // Fix me, need to add relation later
        //articles: [Article.schema],
    });
    mongoose.model( 'Tag', TagSchema );
}
