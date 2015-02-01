var passport = require("passport");
var async = require("async");

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
            res.redirect('/blog/page/1');
    });

    app.get("/blog/page/:id", function(req, res) {
        var id = req.params.id;  
        Article.paginate({}, id, 10, function(error, pageCount, paginatedResults, itemCount) {
          if (error) {
            console.error(error);
          } else {
            console.log('Pages:', pageCount);
            console.log(paginatedResults);
            var data = {};
            data['pageCount'] = pageCount;
            data['paginatedResults']= paginatedResults;
            data['itemCount'] = itemCount;

            var totalPages = Math.ceil(itemCount/10)

            data['itemCount'] = itemCount;

            var currentPage = -1;
            if(id >0 && id<=totalPages && itemCount>0)
                currentPage = parseInt(id);

            if(currentPage-3 > 0)
                data['current_minus_3'] = currentPage - 3;
            else
                data['current_minus_3'] = -1;
            if(currentPage-2 > 0)
                data['current_minus_2'] = currentPage - 2;
            else
                data['current_minus_2'] = -1;
            if(currentPage-1 > 0)
                data['current_minus_1'] = currentPage - 1;
            else
                data['current_minus_1'] = -1;

            data['current_page'] = currentPage;
            
            
            if(currentPage+1 <= totalPages && currentPage>0)
                data['current_plus_1'] = currentPage + 1;
            else
                data['current_plus_1'] = -1;
            if(currentPage+2 <= totalPages)
                data['current_plus_2'] = currentPage + 2;
            else 
                data['current_plus_2'] = -1;
            if(currentPage+3 <= totalPages)
                data['current_plus_3'] = currentPage + 3;
            else
                data['current_plus_3'] = -1;

            data['totalPages'] = totalPages;
            data['tags'] = [];
            data['totalTags'] = 0;
            data['tagId'] = '';
            console.log(data);
            req.data = data;
            
            Tag.find({}, function(err, tags) {
                  var tagsMap = {};
                  tags.forEach(function(tag) {
                      data['tags'].push({name:tag.name,numberOf:tag.numberOf});
                      data['totalTags'] += tag.numberOf;
                  });

                  res.render('blog', {data: data});
            });
            //res.render('blog', {data: data});
          }
        },{ sortBy:{ createDate: -1 }});

    });

    app.get("/blog/tag/:tagid", function(req, res) {
        var tagid = req.params.tagid;  
        res.redirect('/blog/tag/'+tagid+'/page/1');
    });
    app.get("/blog/tag/:tagid/page/:id", function(req, res) {
        var tagid = req.params.tagid;  
        var id = req.params.id;
        console.log('tagi id: '+ tagid +'; page id: '+id);
        Tag.findOne({"name": tagid}, function(err, tagData) {
            if (err) {
                res.render("error", {err: err});
            } else {
                Article.paginate({_id:{$in: tagData.articles}}, id, 10, function(error, pageCount, paginatedResults, itemCount) {
                  if (error) {
                    console.error(error);
                  } else {
                    console.log('Pages:', pageCount);
                    console.log(paginatedResults);
                    var data = {};
                    data['pageCount'] = pageCount;
                    data['paginatedResults']= paginatedResults;
                    data['itemCount'] = itemCount;

                    var totalPages = Math.ceil(itemCount/10)

                    data['itemCount'] = itemCount;

                    var currentPage = -1;
                    if(id >0 && id<=totalPages && itemCount>0)
                        currentPage = parseInt(id);

                    if(currentPage-3 > 0)
                        data['current_minus_3'] = currentPage - 3;
                    else
                        data['current_minus_3'] = -1;
                    if(currentPage-2 > 0)
                        data['current_minus_2'] = currentPage - 2;
                    else
                        data['current_minus_2'] = -1;
                    if(currentPage-1 > 0)
                        data['current_minus_1'] = currentPage - 1;
                    else
                        data['current_minus_1'] = -1;

                    data['current_page'] = currentPage;
                    
                    
                    if(currentPage+1 <= totalPages && currentPage>0)
                        data['current_plus_1'] = currentPage + 1;
                    else
                        data['current_plus_1'] = -1;
                    if(currentPage+2 <= totalPages)
                        data['current_plus_2'] = currentPage + 2;
                    else 
                        data['current_plus_2'] = -1;
                    if(currentPage+3 <= totalPages)
                        data['current_plus_3'] = currentPage + 3;
                    else
                        data['current_plus_3'] = -1;

                    data['totalPages'] = totalPages;
                    data['tags'] = [];
                    data['totalTags'] = 0;
                    data['tagId'] = tagid;
                    console.log(data);
                    req.data = data;
                    
                    Tag.find({}, function(err, tags) {
                          var tagsMap = {};
                          tags.forEach(function(tag) {
                              data['tags'].push({name:tag.name,numberOf:tag.numberOf});
                              data['totalTags'] += tag.numberOf;
                          });
                          res.render('blog', {data: data});
                    });
                  }
                },{ sortBy:{ createDate: -1 }});
                // res.render("blog-detail", {
                //     blogInfo: data
                // });
            }
        })

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
