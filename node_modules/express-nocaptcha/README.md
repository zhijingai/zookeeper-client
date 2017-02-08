express-nocaptcha
===============

__Express.js middleware for Google's [No CAPTCHA reCAPTCHA](http://www.google.com/recaptcha/intro/)__

When form is posted with [No CAPTCHA reCAPTCHA](http://www.google.com/recaptcha/intro/) element in it, the middleware automatically validates the request token against Google API and passes the request on.


## Install

```sh
$ npm install express-nocaptcha
```


## Usage

Add [No CAPTCHA reCAPTCHA](http://www.google.com/recaptcha/intro/) to the form that you want to have validation on. Refer to the [Developer's Guide](https://developers.google.com/recaptcha/intro) how to do this.

### Setup

Load `express-nocaptcha` and set your [Google API secret key](https://www.google.com/recaptcha/admin) to it:

```js
app.use(require('express-nocaptcha')({
  secret: 'abcdefghijklmnopqrstuvxyz'
}));
```


### req.validnocaptcha

If captcha is valid, for subsequent middlewares, `req.validnocaptcha` is set to true.

```js
app.post(function(req, res, next) {
  if(!req.validnocaptcha) { return next(); }

  // Valid nocaptcha. Do stuff here...
});
```
