var conn = require('../config/configDB')
var user = require('../models/user');

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
    var data = new user(req.body);
    let sql = "INSERT INTO user SET ?";
    conn.query(sql, data, (err, results) => {
        if(err) throw err;
        res.status(201).send(results);
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