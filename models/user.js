var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var nodemailer = require('nodemailer');

var UserSchema = mongoose.Schema({
    username:{
    type:String,
    index:true
    },
    password:{
    type:String
    },
    email:{
    type:String
    },
    name:{
    type:String
    },
facebook: {
    id: {
        type: String,
        trim: true
    },
    token: {
        type: String
    },
    name: {
        type: String
    },
    email: {
        type: String
    }
},
google: {
    id: {
        type: String,
        trim: true
    },
    token: {
        type: String
    },
    name: {
        type: String
    },
    email: {
        type: String
    }
},
twitter: {
    id: {
        type: String,
        trim: true
    },
    token: {
        type: String
    },
    username:
        {
            type: String
        },
    displayName: {
        type: String
    }
}
});

var User = module.exports = mongoose.model('User', UserSchema);
module.exports.createUser = function (newUser, callback) {
    bcrypt.genSalt(10, function (err, salt) {
        if (err) throw next(err); 
        bcrypt.hash(newUser.password, salt, function (err, hash) {
            if (err) throw next(err); 
            newUser.password = hash;
            newUser.save(callback);
        });
    });

}
module.exports.forgotPassword = function (email, res, req, callback) {
    var newUser;
    User.findOne({ email: email }, function (err, user) {
        if (user) {
            User.findById(user._id, function (err, user) {
                bcrypt.genSalt(10, function (err, salt) {
                    bcrypt.hash('Password1', salt, function (err, hash) {
                        if (err) throw next(err);
                        user.password = hash;
                    });
                });
                User.update({ _id: user._id }, { 'password': user.password }, function (err, userdt) {
                    newUser = userdt;
                    var subject = "";
                    var text = "";
                    subject = "Forget Password Request";
                    text = "Dear user" +
                    "<br/><br/><br />" +
                    "<table style='border-collapse: collapse'>" +
                    "<tr><td ><b>User Name</b> : " + email + "</td></tr>" +
                    "<tr><td ><b>Password</b> : " + 'Password1' + "</td></tr>" +
                    "</table>" +
                    "<br /><br />" +
                    "<br /><br />" +
                    "Sincerely," +
                  "<br /><br /><br />" +
                  "The Hootparking Team";

                    var msg = {
                        transport: nodemailer.createTransport('SMTP', {
                            host: 'smtp.gmail.com',
                            secureConnection: true,
                            port: 465,
                            auth: {
                                user: "<Enter Email ID>",
                                pass: "<Enter Password>"
                            }
                        }),
                        html: text,
                        from: "info@cns.com",
                        subject: subject,
                        to: email
                    };
                    msg.transport.sendMail(msg, function (err) {
                        if (err) {
                            console.log('Sending to ' + msg.to + ' failed: ' + err);
                        }
                        console.log('Message send successfully' + user);
                        console.log('Sent to ' + msg.to);
                        msg.transport.close();
                        var query = { email: email };
                        User.findOne(query, callback);
                    });
                });
            });
        }
        else {
            var query = { email: email };
            User.findOne(query, callback);
        }
    });

}


module.exports.getUserById = function (id, callback) {
        User.findById(id, callback);
}
module.exports.getUserByUsername = function (userName, callback) {
    var query = { username: userName };
    User.findOne(query, callback);
}

module.exports.comparePassword = function (candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, function (err, isMatch) {
        if (err) throw err;
        callback(null, isMatch);
    });
}