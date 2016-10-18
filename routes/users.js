var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy
var User = require('../models/user');
var session = require('express-session');
var CurrentUser;
router.get('/register', function (req, res) {
    res.render('register');
});
router.get('/login', function (req, res) {
    res.render('login');
});

router.get('/forgotPassword',function(req,res)
{
res.render('forgotPassword');
});

router.post('/forgotPassword', function (req, res) {
    var email = req.body.name;
    if (email) {
        User.forgotPassword(email, res, req, function (err, user) {
            if (err) throw err;
            debugger;
            if (user) {
                req.flash('success_msg', 'You send mail');
                res.redirect('/users/login');
            }
            else {

                req.flash('error_msg', 'Email Address is not register');
                res.redirect('/users/login');
            }

        });

    }

});
router.post('/register', function (req, res) {
    var name = req.body.name;
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var passsword2 = req.body.password2;
    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('username', 'username is required').notEmpty();
    req.checkBody('email', 'email is required').notEmpty();
    req.checkBody('email', 'email is required').isEmail();
    req.checkBody('password', 'password is required').notEmpty();
    req.checkBody('password2', 'password do not match').equals(req.body.password);
    var error = req.validationErrors();
    if (error) {
        res.render('register', {
            error: error
        });
    }
    else {
        var newUser = new User({
            name: name,
            email: email,
            username: username,
            password: password
        });
        User.createUser(newUser, function (err, user) {
            if (err) throw err;
        });
        req.flash('success_msg','You are sccessfully register and can now login');
        res.redirect('/users/login');
    }

});

passport.use(new LocalStrategy(
  function (username, password, done) {
      User.getUserByUsername(username, function (err, user) {
        
          if (err) throw err;
          if (!user) {
              return done(null, false, { message: 'Unknow user' });
          }
          User.comparePassword(password, user.password, function (err, isMatch) {
              if (err) throw err;
              if (isMatch) {
                  CurrentUser = user;
                  return done(null, user);
              }
              else {
                  return done(null, false, { message: 'Invalid password' });
              }
          });

      });


  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.getUserById(id, function (err, user) {
        done(err, user);
    });
});

router.post('/login',
  passport.authenticate('local', { successRedirect: '/', failureRedirect: '/users/login', failureFlash: true }),
  function (req, res) {
      res.redirect('/');
  });

  router.get('/logout', function (req, res) {
      req.logout();
      req.flash('success_msg', 'You are logout');
      res.redirect('/users/login');
  });
  
module.exports = router;