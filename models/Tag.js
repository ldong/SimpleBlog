// module.exports = function( mongoose ) {
//     var Schema   = mongoose.Schema;
// 
//     var TagSchema = new Schema({
//         name: String,
//         numberOf: Number,
//         // Fix me, need to add relation later
//         //articles: [Article.schema],
//     });
//     mongoose.model( 'Tag', TagSchema );
// }

module.exports = function( mongoose ) {
    var Schema   = mongoose.Schema;
    var mongoosePaginate = require('mongoose-paginate');

    var Article = mongoose.model("Article");

    var TagSchema = new Schema({
        name: String,
        numberOf: Number,
        articles : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Article' }]
        // Fix me, need to add relation later
        //articles: [Article.schema],
    });

    TagSchema.plugin(mongoosePaginate)
    mongoose.model( 'Tag', TagSchema );
}


