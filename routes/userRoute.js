var express = require('express');

var user = require('../controllers/userController');
var router = express.Router();

/* GET users listing. */
router.post('/login', user.login);
router.get('*', function(req, res, next) {
 if(!req.session || !req.session.user){
  res.render('login');
 }else{
  res.render('main');
 }
 });

module.exports = router;
