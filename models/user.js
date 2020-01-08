
var user = function(object) {
    const {
        id,
        name,
        email,
        password
    } = object;

    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
}

module.exports = user;