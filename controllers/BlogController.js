var passport = require("passport");

module.exports = function(app, mongoose) {
    var Article = mongoose.model("Article");
    var Tag = mongoose.model("Tag");


    /*
     * basic example usage of `mongoose-pagination`
     * querying for `all` {} items in `MyModel`
     * paginating by second page, 10 items per page (10 results, page 2)
     */
    
    // var mongoosePaginate = require('mongoose-paginate');
    // 
    // Article.plugin(mongoosePaginate)
    

   //  /*
   //   * advanced example usage of `mongoose-pagination`
   //   * querying for `{ columns: 'title', { populate: 'some_ref' }, { sortBy : { title : -1 } }` items in `MyModel`
   //   * paginating by second page, 10 items per page (10 results, page 2)
   //   */
   //  
   //  var mongoosePaginate = require('mongoose-paginate');
   //  
   //  Article.plugin(mongoosePaginate)
   //  
   //  Article.paginate({}, 2, 10, function(error, pageCount, paginatedResults, itemCount) {
   //    debugger;
   //    if (error) {
   //      console.error(error);
   //    } else {
   //      console.log('Pages:', pageCount);
   //      console.log(paginatedResults);
   //    }
   //  }, { columns: 'title', populate: 'some_ref', sortBy : { title : -1 });


    //app.get("/blog", ensureAuthenticated, function(req, res, next) {
    app.get("/blog", function(req, res) {
       // section
       //   article
       //     h1
       //       a(href='#') #{articleInfo.title}
       //     .row
       //       .col-sm-12.col-md-12
       //         span.glyphicon.glyphicon-pencil
       //         a(href='#') 
       //         | #{articleInfo.comments.length}  Comments
       //         span.glyphicon.glyphicon-time
       //         | #{articleInfo.createDate}
       //     hr
       //     br
       //     p.lead
       //         #{articleInfo.content}
       //     hr
        // var query = Article.find().sort({'createDate':1});
        // console.log(query);
        Article.paginate({}, 1, 10, function(error, pageCount, paginatedResults, itemCount) {
          debugger;
          if (error) {
            console.error(error);
          } else {
            console.log('Pages:', pageCount);
            console.log(paginatedResults);
            var data = {};
            data['pageCount'] = pageCount;
            data['paginatedResults']= paginatedResults;
            data['itemCount'] = itemCount;
//res.json(tmp);
//res.render("applications", { applications : applications });
            res.render('blog', {data: data});
          }
        },{ sortBy:{ createDate: -1 }});

        // res.render("blog", {
        //     page_title: "Blog",
        // });
    });

    // app.get("/blog/new", ensureAuthenticated, function(req, res, next) {
    //     res.render("blog-new");
    // });

    // app.post("/blog/create", ensureAuthenticated, function(req, res) {
    //     var title = req.body.title;
    //     var content = req.body.content;
    //     var blogModel = new Article();
    //     blogModel.title = title;
    //     blogModel.content = content;
    //     blogModel.author = "anonymous";
    //     blogModel.save(function(err, data) {
    //         if (err) {
    //             res.render("error", {err: err});
    //         } else {
    //             var id = data._id;
    //             res.redirect("/blog/show/" + id);
    //         }
    //     })
    // });

    // app.get("/blog/show/:id", function(req, res) {
    //     var id = req.params.id;
    //     Article.findOne({"_id": id}, function(err, data) {
    //         if (err) {
    //             res.render("error", {err: err});
    //         } else {
    //             res.render("blog-detail", {
    //                 blogInfo: data
    //             });
    //         }
    //     })
    // });
}

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/signin')
}
