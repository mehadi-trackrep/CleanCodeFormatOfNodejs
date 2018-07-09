var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

/*** User Schema creation ***/
var UserSchema = mongoose.Schema({
    username:{
        type: String,
        index: true
    },
    password: {
        type: String
    },
    email:{
        type: String
    },
    name: {
        type: String
    }
});

/** ======= Adding Methods in this UserSchema ======= **/
/** Generating a hashing password **/
UserSchema.methods.generateHash = function(password) {
 return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};
/** Checking if password is valid **/
UserSchema.methods.validPassword = function(password) {
 return bcrypt.compareSync(password, this.password);
};
// Other functions/methods ..
UserSchema.methods.getUserByUsername = function(username, callback){
    var query = {username: username};
    User.findOne(query, callback);
}
UserSchema.methods.getUserByID = function(id, callback){
    User.findById(id, callback);
}

/** Create the model for users and expose it to our app **/
module.exports = mongoose.model('user', UserSchema);
