var express = require("express");
var app     = express();
var path    = require("path");
var assert = require('assert');
var mongojs = require('mongojs');
var multer = require('multer');
var http = require('http');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy
var session = require('express-session');
var nodemailer = require('nodemailer');
var RedisStore=require('connect-redis')(session);
var LocalStrategy = require('passport-local').Strategy
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/dbBlog');
var db = mongoose.connection;
var routes = require('./routes/index');
var users = require('./routes/users');
var app = express();
process.chdir(__dirname);
app.set('views',path.join(__dirname,'views'));
app.engine('handlebars', exphbs({ defaultLayout: 'layout' }));
app.set('view engine','handlebars');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//-----------------------Passport authentication session are maintain----------------
app.use(session({
secret:'secret',
saveUinitialized:true,
resave:true
}
));

//-------------------------------intialize session---------------------------------------
app.use(passport.initialize());
app.use(passport.session());

app.use(expressValidator({
    errorFormatter: function (param, msg, value) {
        var namespace = param.split('.')
      , root = namespace.shift()
      , formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

app.use(flash());
//---------------------------------express-flash using-----------------------------
app.use(function (req, res, next) {
 if(req.url=='/users/login' ||req.url=='/users/register' )
    {
       res.locals.title=false;
    }
    else{
     res.locals.title=true;
    }
    res.locals.Url='http://'+ req.get('host');
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    GetCurrentUser=res.locals.user;
    next();
});

app.use('/',routes);
app.use('/users', users);

  
//app.use(bodyParser());
global.database = mongojs('dbBlog');
global.database.on('error', function (err) {
    console.log('database error', err)
})

global.database.on('connect', function () {
    console.log('database connected')
})

 app.get('/getUser', function (req, res) {
  	res.json(GetCurrentUser);
  });

var ObjectID = require('mongodb').ObjectID;

//----------Image Store---------------

    // Connect to the db
    var Imagename;
    var storage = multer.diskStorage({ //multers disk storage settings
        destination: function (req, file, cb) {
            cb(null, 'Images');
        },
        filename: function (req, file, cb) {
            var datetimestamp = Date.now();
            Imagename = file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1];        
            
            cb(null, Imagename);

        }
    });
    //--------------------------------------Upload image using multer-----------------------------------
    var upload = multer({ //multer settings
        storage: storage
        }).single('file');
    var Imagename;
   app.post('/upload12/:id', function (req, res) {
        Imagename = req.params.id;
        upload(req, res, function (err) {
            if (err) {
                res.json({ error_code: 1, err_desc: err });
                return;
            }
            res.json({ error_code: 0, err_desc: null, Image: Imagename });
        });
    });
 
//------------------get data -----------------------------------
app.use(express.static(__dirname + '/'));
app.use(express.static(__dirname +'/Images'));
app.use(express.static(__dirname +'/views'));
app.use(express.static(__dirname +'/Controllers'));

app.get('/editor', function (req, res) {
	 database.collection('tblBlogEditor').find().sort({ _id: -1 }).limit(0, function (err, docs) {
	     res.json(docs);
	 });
});

  //Get comments for specific id
app.get('/getComments/:id', function (req, res) {
    database.collection('tblComment').find({ 'blogId': req.params.id }).limit(0, function (err, docs) {
        res.json(docs);
    });
});

  app.get('/view/', function (req, res) {
      database.collection('tblBlogEditor').insert(req.query, function (err, doc){
		res.json(doc);
	});

  });

 
app.get('/UserId/:id',function(req,res){
var id=req.params.id;
console.log('UserId Here'+id);
var ConcatId='.*'+id+'.';
console.log('ConcatId'+ConcatId);
database.collection('tblBlogEditor').findOne({"UserId": {$regex :ConcatId}},function(err,doc){
        res.json(doc);
    });;
});

  app.get('/updateLikes/', function (req, res) {
  	database.collection('tblBlogEditor').findAndModify({query: {_id: mongojs.ObjectId(req.query._id)},
    update: {$set: {'blogLikes':req.query.blogLikes,'UserId':req.query.UserId}},new: true}, function (err, doc){
        res.json(doc);
     });
  });

app.get('/blogPageData/', function (req, res, next) {
    database.collection('tblComment').insert(req.query, function (err, doc){
		res.json(doc);
	});
});


//-------------------------------Send Subscription mail to user------------------------------------
app.get('/subscribed/:email',function(req,res,next)
{
console.log('subscribtion here'+req.params.email);
var email=req.params.email;
if(email)
{
var text="";
var subject="Subcribtion for Node Blog.";
text="Dear User,"+
"<br/><br/><br/>"+
"Here is your email id"+
"<br/><br/>"+
"<table style='border-collapse:collapse'>"+
"<tr><td><b>Email Id</b>:"+req.params.emailId+"</td></tr>"+
"<tr><td><b>Link</b><a href='http://localhost:8000/#/'>http://localhost:8000/#/</a></td></tr>"+
"<table>"+
"<br/><br/><br/>"+
"We are glad for your present.Thank you for Subscribed node blog!!!"+
"<br/><br/>"+
"<br/><br/>"+
"Sincerely,"+
"<br/>"+
"Node Blog";
 var msg = {
                            transport: nodemailer.createTransport('SMTP', {
                                host: 'smtp.gmail.com',
                                secureConnection: true,
                                port: 465, 
                                auth: {
                                    user: "<Enter email id>",
                                    pass: "<Password>"
                                }
                            }),
                            html: text,
                            from: "info@sspl.com",
                            subject: subject,
                            to: req.params.email
                        };
                        msg.transport.sendMail(msg, function (err) {
                            if (err) {
                                console.log('Sending to ' + msg.to + ' failed: ' + err);
                            }
                            console.log('Message send successfully');
                            console.log('Sent to ' + msg.to);
                            msg.transport.close();
                            res.json(msg.to);
                        });
}
});


//------------------------------------send forgotpassword mail to user-----------------------------
app.get('/forgotPassword/:emailId',function(req,res,next){
debugger;
var emailId=req.params.emailId;
var subject ="Forgotten Password.";
var text="";
text="Dear User,"+
"<br/><br/><br/>"+
"Here is your email id  and password"+
"<br/><br/>"+
"<table style='border-collapse:collapse'>"+
"<tr><td><b>Email Id</b>:"+req.params.emailId+"</td></tr>"+
"<tr><td><b>Password</b>:"+'P@ssword1'+"</td><tr>"+
"<table>"+
"<br/><br/>"+
"<br/><br/>"+
"Sincerely,"+
"<br/><br/><br/>"+
"Node Blog";            
                        var msg = {
                            transport: nodemailer.createTransport('SMTP', {
                                host: 'smtp.gmail.com',
                                secureConnection: true,
                                port: 465,
                                auth: {
                                    user: "dev.net.asp@gmail.com",
                                    pass: "Wel@come123"
                                }
                            }),
                            html: text,
                            from: "info@cns.com",
                            subject: subject,
                            to: req.params.emailId
                        };
                        msg.transport.sendMail(msg, function (err) {
                            if (err) {
                                console.log('Sending to ' + msg.to + ' failed: ' + err);
                            }
                            console.log('Message send successfully');
                            console.log('Sent to ' + msg.to);
                            msg.transport.close();
                            res.json(msg.to);
                        });
                        console.log('forgotPassword');
});

app.get('/getBlogData/:id', function (req, res) {
    database.collection('tblBlogEditor').findOne({ _id: mongojs.ObjectId(req.params.id) }, function(err,doc){
        res.json(doc);
    });
});
app.listen(8000);
console.log("Running at Port 8000");