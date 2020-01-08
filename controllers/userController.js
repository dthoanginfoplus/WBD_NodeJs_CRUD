var conn = require('../config/configDB')
var user = require('../models/user');
var bcrypt = require('bcrypt');
const config = {'secret': 'supersecret'};
const jwt = require('jsonwebtoken');
const saltRounds = 10;

exports.getUser = function (req, res) {
    var reqtoken = req.headers['x-access-token'];
    if (!reqtoken) return res.status(401).send({ auth: false, message: 'No token provided.' });
    
    jwt.verify(reqtoken, config.secret, function(err, decoded) {
      if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

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
    });      
};

  

exports.createUser = async function(req,res) {
    var data =  new user(req.body);
    // let isExistEmail = await checkExistEmail(data.email);
    // console.log("main", isExistEmail);

    let sql =  "SELECT * FROM user WHERE email='"+data.email+"'";
        let query = conn.query(sql, (err, results) => {
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
				});;
            } else {
            res.status(200).send(results);
            }
        }
    });
};

exports.updateUser = function(req,res) {
    var reqtoken = req.headers['x-access-token'];
    if (!reqtoken) return res.status(401).send({ auth: false, message: 'No token provided.' });
    
    jwt.verify(reqtoken, config.secret, function(err, decoded) {
      if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });


    var id = req.params.id;
    var data = new user(req.body);
    // var sql = "UPDATE user SET name='"+data.name+"', username='"+data.username+"', password='"+data.password+"', email='"+data.email+"', WHERE id="+id;
    var sql = "UPDATE user SET ? where id=" + id;
    conn.query(sql,data, (err, results) => {
        if(err) throw err;
        res.status(201).send(results);
    });
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
    // var reqtoken = req.headers['x-access-token'];
    // if (!reqtoken) return res.status(401).send({ auth: false, message: 'No token provided.' });
    
    // jwt.verify(reqtoken, config.secret, function(err, decoded) {
    //   if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

    //   res.status(200).send({ auth: true, message: 'ok' });

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
                        });;
                    }
                });
            }
        }
    });
};

checkExistEmail = async function(email) {
        let isExistEmail;
        let sql =  "SELECT * FROM user WHERE email='"+email+"'";
        let query = await conn.query(sql, (err, results) => {
            if(err) {
                throw err;
            } else {
                return results.length == 0 ? this.query = false 
                                            : this.query =  true;
            }
        });
       
        console.log("a" ,this.isExistEmail);
        console.log("b" ,this.query);
        return isExistEmail = await this.query;

        // return true or false 
};
