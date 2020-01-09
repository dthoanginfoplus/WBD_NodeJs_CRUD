var conn = require('../config/configDB')
var user = require('../models/user');
var bcrypt = require('bcrypt');
const config = {'secret': 'supersecret'};
const jwt = require('jsonwebtoken');
const saltRounds = 10;

exports.getUser = function (req, res) {
		conn.query('SELECT * FROM user', function (err, results, fields) {
			if (err) {
                				console.log(err);
				res.status(404).json({
					'msg': err
				});
			} else {
				console.log(results);

                if(results.length == 0) {
                    res.status(204).send(results);
                } else {
                res.status(200).send(results);
                }
			}
        });  
};

  

exports.createUser = function(req,res) {
    var data =  new user(req.body);
    let sql =  "SELECT * FROM user WHERE email='"+data.email+"'";
        conn.query(sql, (err, results) => {
            if(err) {
                throw err;
            } else {
                if(results.length == 0) {
                    bcrypt.hash(req.body.password, saltRounds, function (err, result) {
                    data.password = result;
                    let sql = "INSERT INTO user SET ?";
                    conn.query(sql,data, (err, results) => {
                    if(err) throw err;
                    return res.status(200).send({'message':"Created User"});
                    });
                    });
                } else {
                    res.status(500).send({
                        'mess': "Email has been used"
                    });
                }
            }
        });
};

exports.findUserById = function(req,res) {
    var id = req.params.id;
    var sql = "SELECT * FROM user WHERE id=" + id;
    conn.query(sql, (err, results) => {
        if(err) {
            throw err;
        } else {
            if(results.length == 0) {
                res.status(404).json({
					'msg': "Not Found"
				});
            } else {
                console.log()
            res.status(200).send(results);
            }
        }
    });
};

exports.updateUser = function(req,res) {
    var id = req.params.id;
    var data = new user(req.body);
    let sql = "UPDATE user SET name='"+data.name+"', email='"+data.email+"' WHERE id="+req.params.id;
    conn.query(sql, (err, results) => {
        if(err) throw err;
        res.status(201).send({message: 'updated'});
    });
};

exports.updatePassword = function(req,res) {
    var id = req.params.id;
    var currentPassword = req.body.currentPassword;
    var newPassword = req.body.newPassword;
    var sql = "SELECT * FROM user WHERE id=" + id;
    conn.query(sql, (err, results) => {
        let data = new user(results[0]);
        console.log(data.password);
        if(err) {
            throw err;
        } else {
            if(results.length == 0) {
                res.status(404).send({
					'msg': "Not Found"
				});;
            } else {
                bcrypt.compare(currentPassword, data.password, (err , next) => {
                    console.log(next)
                    if(next == true) {  
                        bcrypt.hash(req.body.newPassword, saltRounds, function (err, hashPassword) {
                            console.log(hashPassword)
                            let sql = "UPDATE user SET password='"+hashPassword+"' WHERE id=" + id;
                            conn.query(sql, (err, result) => {
                            if(err) throw err;
                            return res.status(201).send({'message':"Updated New Password"});
                            });
                            });
                    } else {
                        console.log("password not correct")
                        res.status(404).json({
                            'message': "Current password not correct"
                        });;
                    }
                });
            }
        }
    });
};

exports.deleteUser = function(req,res) {
    var id = req.params.id;
    var sql = "DELETE FROM user WHERE id=" + id;
    conn.query(sql, (err, results) => {
        if(err) throw err;
        res.status(204).send(results);
    });
};

exports.login = function(req,res) {

    var sql = "SELECT * FROM user WHERE email='"+req.body.email+"'";
    conn.query(sql, (err,results) => {
 
        if(err) {
             throw err;
        } else {
            if(results.length == 0) {
                res.status(404).json({
                    'message': "Email not correct"
                });
            } else {
                let dataUser = new user(results[0]);
                console.log(dataUser);
                bcrypt.compare(req.body.password, dataUser.password, (err , next) => {
                    console.log(next)
                    if(next == true) {  
                        console.log("password is correct");
                        var token = jwt.sign({ id: dataUser.id }, config.secret, {
                            expiresIn: 86400 // expires in 24 hours
                          });
                        res.status(200).send({auth: true ,token: token, dataUser});
                    } else {
                        console.log("password not correct")
                        res.status(404).json({
                            'msg': "password not correct"
                        });
                    }
                });
            }
        }
    });
};

