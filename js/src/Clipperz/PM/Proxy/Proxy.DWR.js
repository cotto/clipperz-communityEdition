if (typeof(Clipperz) == 'undefined') { Clipperz = {}; }
if (typeof(Clipperz.PM) == 'undefined') { Clipperz.PM = {}; }

//=============================================================================

Clipperz.PM.Proxy.DWR = function(args) {
	Clipperz.PM.Proxy.DWR.superclass.constructor.call(this, args);

	this._tolls = {
		'CONNECT':	[],
		'REGISTER':	[],
		'MESSAGE':	[]
	};
	
	return this;
}

YAHOO.extendX(Clipperz.PM.Proxy.DWR, Clipperz.PM.Proxy, {

	'toString': function() {
		return "Clipperz.PM.Proxy.DWR - " + this.args();
	},

	//=========================================================================

	'tolls': function() {
		return this._tolls;
	},

	//-------------------------------------------------------------------------

	'payToll': function(aRequestType, someParameters) {
		var	deferredResult;

//MochiKit.Logging.logDebug(">>> Proxy.DWR.payToll: " + aRequestType);
		if (this.tolls()[aRequestType].length > 0) {
			deferredResult = MochiKit.Async.succeed(this.tolls()[aRequestType].pop());
		} else {
//MochiKit.Logging.logDebug("### " + aRequestType + " toll NOT immediately available; request queued.");
			deferredResult = new MochiKit.Async.Deferred();
			deferredResult.addCallback(function(someParameters) {
				return new Clipperz.PM.Toll(someParameters['toll']);
			})
			com_clipperz_pm_Proxy.knock(Clipperz.Base.serializeJSON({requestType:aRequestType}), {
				callback:MochiKit.Base.method(deferredResult, 'callback'),
				errorHandler:MochiKit.Base.method(deferredResult, 'errback')
			});
		}
		
		deferredResult.addCallback(function(aToll) {
			return aToll.deferredPay();
		});
		deferredResult.addCallback(function(someParameters, aToll) {
			var result;
			
			result = {
				parameters: someParameters,
				toll: aToll
			}
			
			return result;
		}, someParameters);
		
		return deferredResult;
	},

	//-------------------------------------------------------------------------

	'addToll': function(aToll) {
		this.tolls()[aToll.requestType()].push(aToll);
	},

	//=========================================================================

	'setTollCallback': function(someParameters) {
//MochiKit.Logging.logDebug(">>> Proxy.DWR.setTollCallback");
//MochiKit.Logging.logDebug("--- Proxy.DWR.setTollCallback - " + Clipperz.Base.serializeJSON(someParameters));
		if (typeof(someParameters['toll']) != 'undefined') {
			this.addToll(new Clipperz.PM.Toll(someParameters['toll']));
		}
		return someParameters['result'];
	},

	//=========================================================================

	'registration': function(someParameters) {
		return this.sendMessage('registration', someParameters, 'REGISTER');
	},

	//-------------------------------------------------------------------------

	'handshake': function(someParameters) {
		return this.sendMessage('handshake', someParameters, 'CONNECT');
	},

	//-------------------------------------------------------------------------

	'message': function(someParameters) {
		return this.sendMessage('message', someParameters, 'MESSAGE');
	},

	//-------------------------------------------------------------------------

	'logout': function(someParameters) {
//MochiKit.Logging.logDebug("=== Proxy.DWR.logout");
		return this.sendMessage('logout', someParameters, 'MESSAGE');
	},

	//=========================================================================

	'sendMessage': function(aFunctionName, someParameters, aRequestType) {
		var	deferredResult;
		var proxy;
		
//MochiKit.Logging.logDebug(">>> Proxy.DWR.sendMessage - " + aFunctionName + " - " + aRequestType);
		proxy = this;
		
		deferredResult = new MochiKit.Async.Deferred();
//deferredResult.addBoth(function(res) {MochiKit.Logging.logDebug("x.1 Proxy.DWR.sendMessage - 1: " + res); return res;});
		deferredResult.addCallback(MochiKit.Base.method(proxy, 'payToll'), aRequestType);
//deferredResult.addBoth(function(res) {MochiKit.Logging.logDebug("x.2 Proxy.DWR.sendMessage - 2: " + Clipperz.Base.serializeJSON(res)); return res;});
		deferredResult.addCallback(MochiKit.Base.method(proxy, 'sendRemoteMessage'), aFunctionName);
//deferredResult.addBoth(function(res) {MochiKit.Logging.logDebug("x.3 Proxy.DWR.sendMessage - 3: " + res); return res;});
//deferredResult.addBoth(function(res) {MochiKit.Logging.logDebug("x.3 Proxy.DWR.sendMessage - 3: " + Clipperz.Base.serializeJSON(res)); return res;});
		deferredResult.callback(someParameters);
		
//MochiKit.Logging.logDebug("<<< Proxy.DWR.sendMessage");
		return deferredResult;		
	},

	//=========================================================================
	
	'sendRemoteMessage': function(aFunctionName, someParameters) {
		var	deferredResult;

//MochiKit.Logging.logDebug(">>> Proxy.DWR.sendRemoteMessage('" + aFunctionName + "', " + Clipperz.Base.serializeJSON(someParameters) + ") - " + this);
		deferredResult = new MochiKit.Async.Deferred();
//deferredResult.addBoth(function(res) {MochiKit.Logging.logDebug("Proxy.DWR.sendRemoteMessage - 1: " + res); return res;});
		deferredResult.addCallback(MochiKit.Base.method(this, 'setTollCallback'));
//deferredResult.addBoth(function(res) {MochiKit.Logging.logDebug("Proxy.DWR.sendRemoteMessage - 2: " + res); return res;});

		com_clipperz_pm_Proxy[aFunctionName](Clipperz.Base.serializeJSON(someParameters), {
			callback:MochiKit.Base.method(deferredResult, 'callback'),
			errorHandler:MochiKit.Base.method(deferredResult, 'errback')
		});
//MochiKit.Logging.logDebug("<<< Proxy.DWR.sendRemoteMessage - result: " + deferredResult);

		return deferredResult;
	},

	//=========================================================================

	'isReadOnly': function() {
		return false;
	},

	//=========================================================================
	__syntaxFix__: "syntax fix"
	
});

//=============================================================================

//Clipperz.PM.Proxy.defaultProxy = new Clipperz.PM.Proxy.DWR("Proxy.DWR - async test");
