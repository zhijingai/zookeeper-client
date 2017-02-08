/*
 * Express middleware for Google's No CAPTCHA reCAPTCHA 
 * (http://www.google.com/recaptcha/intro/)
 * 
 * When form is posted with No CAPTCHA reCAPTCHA element in it, the middleware
 * will check the generated token against Google API.
 * If token is good, req.validnocaptcha is set as true.
 */
/* jshint node: true */
var request = require('request');

// Options
var options = null;


/*
 * Middleware
 */
var middleware = function(req, res, next) {
	
	// Only handle POST requests
	if(req.method !== 'POST') { return next(); }
	
	// If no body nor g-recaptcha-response was defined, GTFO
	if(!req.body || !req.body['g-recaptcha-response']) { return next(); }
	
	// Verify user with Google API
	request.get({ url: 'https://www.google.com/recaptcha/api/siteverify?secret='+options.secret+'&response='+req.body['g-recaptcha-response']+'&remoteip='+req.ip, json: true }, function(err, response, body) {
		if(err) { return next(err); }
		if(body.success) { req.validnocaptcha = true; }
		next();
	});
};


/*
 * Factory which receives the options and returns the middleware
 */
module.exports = function(opts) {
	opts = opts || {};
	
	// Make sure the secret is set
	if(!opts.secret) {
		throw new Error('Secret key is required for "express-nocaptcha" to work');
	}
	
	// Store options and return middleware
	options = opts;
	return middleware;
};
	