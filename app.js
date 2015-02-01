var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var methodOverride     = require("method-override");
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require("mongoose");
var config = require("config");
var utils = require("./lib/utils");
var mongooseConnection = utils.connectToDatabase(mongoose, config.db);
var passport = require('passport');
var session = require("express-session");
var sessionStore = require('connect-redis')(session);
var cookieParser = require('cookie-parser');
var flash = require("connect-flash")

var app = express();

///////////////  check only one route
app.route('/mmuser/123')
    .all(function(req, res, next) {
      console.log('mmuser   123');
    });
//////////////// create a parameter mmid
app.param('mmid', function (req, res, next, id) {
      console.log('CALLED ONLY ONCE');
        next();
})
///////////////  check parameter mmid
app.get('/mmuser/:mmid', function (req, res, next) {
      console.log('although this matches');
        next();
});
////////////////  sub app
// var admin = express();
// 
// admin.get('/', function (req, res) {
//       console.log(admin.mountpath); // [ '/adm*n', '/manager' ]
//         res.send('Admin Homepage');
// })
// 
// var secret = express();
// secret.get('/', function (req, res) {
//       console.log(secret.mountpath); // /secr*t
//         res.send('Admin Secret');
// });
// admin.use('/secr*t', secret); // load the 'secret' router on '/secr*t', on the 'admin' sub app
// app.use(['/adm*n', '/manager'], admin); // load the 'admin' router on '/adm*n' and '/manager', on the parent app

////////////////////////   End Experiment /////////////////////



//var routes = require('./routes/template');
//var routes = require('./routes/nav');
var routes = require('./routes/index');
var routes = require('./routes/blog');
var users = require('./routes/users');

//var myfiles = require('./lib/myfiles');
// console.log(myfiles.getLargeDir('.', function(err, data){console.log('largest file:' + data);}));
// console.log(myfiles.getLargeDir2('.', function(err, data){console.log('largest file:' + data);}));

app.set("port", process.env.PORT || 3000);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('view options', { layout: true }); // I will use jade's layout structure(i.e master page)


// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(methodOverride() ); // Simulate DELETE and PUT

var redis_url = "redis://redistogo:70d73b27d79dc57b34d518ec34574036@mummichog.redistogo.com:10307/"
app.use(session({
    secret: 'myHighSecurePassword',
    //store: new sessionStore({url:process.env.REDIS_URL})
    store: new sessionStore({url:redis_url}),
    saveUninitialized: false, // don't create session until something stored,
    resave: false // don't save session if unmodified
}))
// app.use(session({
//         secret: 'mysecretkeycoolman',
//         store: new sessionStore({url:process.env.REDIS_URL}),
//         //proxy: true,
//         resave: true,
//         saveUninitialized: true
// }))

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(require("./lib/views"));

app.use(express.static(path.join(__dirname, 'public')));



require("./models/Article")(mongooseConnection);
require("./models/Tag")(mongooseConnection);
require("./models/User")(mongooseConnection);
require("./models/Comment")(mongooseConnection);

app.use('/', routes);
app.use('/users', users);

//require("./controllers/IndexController")(app);
require("./controllers/IndexController")(app);
require("./controllers/ProjectsController")(app);
require("./controllers/ContactController")(app);
require("./controllers/BlogController")(app, mongooseConnection);
require("./controllers/ArticleController")(app, mongooseConnection);
require("./controllers/CommentController")(app, mongooseConnection);
require("./controllers/UserController")(app, mongooseConnection);

require("./lib/passport")();
// 
// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//     console.log('------------------hereh---------------');
//     var err = new Error('Not Found');
//     err.status = 404;
//     next(err);
// });
// 
// // error handlers
// function print_call_stack() {
//       var stack = new Error().stack;
//         console.log("PRINTING CALL STACK");
//           console.log( stack );
// }
// 
// // development error handler
// // will print stacktrace
// if (app.get('env') === 'development') {
//     app.use(function(err, req, res, next) {
//         console.log('-----------------error 1---------------');
//         print_call_stack()
//         console.log('-----------------error 1---------------');
//         res.status(err.status || 500);
//         res.render('error', {
//             message: err.message,
//             error: err
//         });
//     });
// }
// 
// // production error handler
// // no stacktraces leaked to user
// app.use(function(err, req, res, next) {
//     console.log('-----------------error 2---------------');
//     res.status(err.status || 500);
//     res.render('error', {
//         message: err.message,
//         error: {}
//     });
// });

 app.get("*", function(req, res) {
     res.render("index",{
         page_title: "Home",
     });
 });

app.listen(app.get("port"), function () {
        console.log("Express server listening on port " + app.get("port"));
});

module.exports = app;


console.log('-----------');
