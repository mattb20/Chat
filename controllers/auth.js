const jwt = require('jsonwebtoken'),
      bcrypt = require('bcrypt'),
      User = require('../models/user');

exports.signup = (req, res) => {
  const hashedPassword = bcrypt.hashSync(req.body.password, 8);
  User.create({ username: req.body.username, password: hashedPassword }, (err, user) => {
    if(err) {
      return res.status(500).send("There was a problem registering the user.");
    }
  
    const token = jwt.sign({ id: user._id }, process.env.SECRET, { expiresIn: 86400 });
    
    res.status(200).send({ auth: true, token: token, name: user.username });
  });
}

exports.login = (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if(err) return res.status(500).send('Error on the server.');
    if(!user) return res.status(404).send('No user found.');
  
    const isPasswordValid = bcrypt.compareSync(req.body.password, user.password);
    if(!isPasswordValid) return res.status(401).send({ auth: false, token: null });

    const token = jwt.sign({ id: user._id }, process.env.SECRET, { expiresIn: 86400 });

    res.status(200).send({ auth: true, token: token });
  });
}
