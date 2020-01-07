var conn = require('../config/configDB')
var user = require('../models/user');
var bcrypt = require('bcrypt');
const saltRounds = 10;

exports.getUser = function (req, res) {
		conn.query('SELECT * FROM user', function (err, results, fields) {
			if (err) {
				console.log(err);
				res.status(404).json({
					'msg': err
				});
			} else {
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
    let isExistEmail = checkExistEmail(data.email);
    console.log(isExistEmail);
    // let sql =  "SELECT * FROM user WHERE email='"+data.email+"'";
    //     let query = await conn.query(sql, (err, results) => {
    //         if(err) {
    //             throw err;
    //         } else {
    //             if(results.length == 0) {
    //                 bcrypt.hash(req.body.password, saltRounds, function (err, result) {
    //                 data.password = result;
    //                 let sql = "INSERT INTO user SET ?";
    //                 conn.query(sql,data, (err, results) => {
    //                 if(err) throw err;
    //                 res.status(201).send(results);
    //                 });
    //                 });
    //             } else {
    //                 res.status(500).json({
    //                     'message': "Email has been used"
    //                 });
    //             }
    //         }
    //     });
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
				});;
            } else {
            res.status(200).send(results);
            }
        }
    });
};

exports.updateUser = function(req,res) {
    var id = req.params.id;
    var data = new user(req.body);
    // var sql = "UPDATE user SET name='"+data.name+"', username='"+data.username+"', password='"+data.password+"', email='"+data.email+"', WHERE id="+id;
    var sql = "UPDATE user SET ? where id=" + id;
    conn.query(sql,data, (err, results) => {
        if(err) throw err;
        res.status(201).send(results);
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
                let data = new user(results[0]);
                console.log(data.password);
                bcrypt.compare(req.body.password, data.password, (err , res) => {
                    console.log(res)
                    if(res == true) {
                        console.log("password is correct");
                    } else {
                        console.log("password not correct")
                    }
                });
            }
        }
    });
};

checkExistEmail = async function(email) {
        let isExistEmail
        let sql =  "SELECT * FROM user WHERE email='"+email+"'";
        let query = await conn.query(sql, (err, results) => {
            if(err) {
                throw err;
            } else {
                console.log(results.length);
                if(results.length == 0) {
                return this.isExistEmail = false;
                } else {
                return this.isExistEmail = true;
                }
            }
        });
};
