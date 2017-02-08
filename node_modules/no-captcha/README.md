# No-Captcha

No-Captcha is a Node implementation for [Google No Captcha reCaptcha](https://developers.google.com/recaptcha/)

## Installation
	$ npm install no-captcha

## Usage

```js
var NoCaptcha = require('no-captcha');
noCaptcha = new NoCaptcha(PUBLIC_KEY,PRIVATE_KEY);
```

You can also pass a therd boolean parameter to specify the verifying url is secured or not. default if false

### For No Captcha reCaptcha field in form
```js
noCaptcha.toHTML()
```

You can also pass an optional option object to toHTML() method
+ **onload** method name to call after loading CAPTCHA
+ **render** explicit | onload
+ **hl** Language [code](https://developers.google.com/recaptcha/docs/language)
+ **theme** dark | light default 'light'
+ **type** text | audio default 'text'
+ **size** normal | compact default 'normal'
+ **tabindex** default 0
+ **callback** callback method name that's executed when the user submits a successful CAPTCHA response.
+ **expired-callback** callback method name that's executed when the recaptcha response expires and the user needs to solve a new CAPTCHA.

### To verify

```js
data = {
	response: req.body['g-recaptcha-response'],
	remoteip: req.connection.remoteAddress			// Optional
};

noCaptcha.verify(data, function(err, resp){
	if(err === null){
		res.send('Valid '+JSON.stringify(resp));
	}
});
```

## Example

Here is an Iced Coffee Script, Jade, Express [example](https://github.com/msyrus/No-Captcha/blob/master/examples/example.iced)

## License

No-Captcha is available under the [BSD (2-Clause) License](http://opensource.org/licenses/BSD-2-Clause).
