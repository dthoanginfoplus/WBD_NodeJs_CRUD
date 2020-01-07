var user = function(object) {
    console.log(object);
    this.name =  object.name;
    this.password = object.password;
    this.email = object.email;
}

module.exports = user;