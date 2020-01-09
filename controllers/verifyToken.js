const jwt = require('jsonwebtoken');
const config = {'secret': 'supersecret'};

function verifyToken(req, res , next) {
    var token = req.headers['x-access-token'];
    console.log('token: ',token);
  if (!token)
    return res.status(403).send({ auth: false, message: 'No token provided.' });
    
  jwt.verify(token, config.secret, function(err, decoded) {
    if (err)
    return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    
    next();
  });
}

module.exports = verifyToken;