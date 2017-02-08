https = require 'https'
querystring = require 'querystring'

module.exports = exports = class NoCaptcha

	constructor: (publicKey, privateKey, isSecure) ->
		@PUBLIC_KEY = publicKey
		@PRIVATE_KEY = privateKey
		@IS_SECURE = isSecure? is yes

	toHTML: (options)->
		script_src = "www.google.com/recaptcha/api.js"
		script_src = (if @IS_SECURE then 'https://' else 'http://') + script_src

		div = "<div class='g-recaptcha' data-sitekey='#{@PUBLIC_KEY}'"

		if options?
			exOptions = {}
			if options.onload
				exOptions.options = options.onload
			if options.render
				exOptions.options = options.render
			if options.hl
				exOptions.options = options.hl
			external = querystring.stringify exOptions
			script_src = script_src+'?'+external

			if options.theme is 'dark' or options.theme is 'light'
				div = div+" data-theme='#{options.theme}'"
			if options.type is 'audio' or options.type is 'image'
				div = div+" data-type='#{options.type}'"
			if options.size is 'normal' or options.size is 'compact'
				div = div+" data-size='#{options.size}'"
			if options.tabindex
				div = div+" data-tabindex='#{options.tabindex}'"
			if options.callback
				div = div+" data-callback='#{options.callback}'"
			if options["expired-callback"]
				div = div+" data-expired-callback='"+options["expired-callback"]+"'"

		div = div + "></div>"
		script = "<script src='#{script_src}' async defer></script>"

		return script+div

	verify: ({response, remoteip}, callback)->
		if not callback
			return new Error 'No callback'

		if not response?
			return callback new Error 'No response'

		externalObj =
			secret: @PRIVATE_KEY
			response: response

		if remoteip
			externalObj["remoteip"] = remoteip

		external = querystring.stringify externalObj

		reqOption = {
			host: 'www.google.com'
			path: '/recaptcha/api/siteverify?'+external
			port: 443
		}

		request = https.get("https://www.google.com/recaptcha/api/siteverify?"+external, (resp)->
			data = ''
			resp.on 'data', (chunk)->
				data += chunk

			resp.on 'end', ()->
				res = JSON.parse data
				if res.success is true
					return callback null, res
				else
					return callback new Error(res['error-codes'] or "Invalide response")
		)
		.on 'error', (err)->
			return callback err
