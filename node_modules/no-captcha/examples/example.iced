express = require 'express'
bodyParser = require 'body-parser'
NoCaptcha = require('../lib/index')

noCaptcha = new NoCaptcha(process.env.PUBLIC_KEY, process.env.PRIVATE_KEY, yes)

app = express()

app.set 'views', "#{__dirname}/views"
app.set 'view engine', 'jade'

app.use bodyParser.urlencoded extended: false
app.use bodyParser.json()

app.route('/')
.get((req, res, next)->
	res.render 'form',
		nocaptcha: noCaptcha.toHTML(
				theme: 'dark'
				type: 'image'
			)
)
.post((req, res, next)->
	response = req.body['g-recaptcha-response']

	await noCaptcha.verify
		response: response
		remoteip: req.connection.remoteAddress
	, defer err, rsp
	if err?
		res.send(err)
	else
		res.send(rsp)
)

app.listen process.env.PORT, ->
	console.log 'App started on port '+process.env.PORT
