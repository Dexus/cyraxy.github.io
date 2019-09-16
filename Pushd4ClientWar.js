window.progrestar = progrestar || {};

/**
 *
 * @param {array} servers List of backend servers
 * @param {string} networkIdent
 * @param {string} applicationId
 * @param {string} userId
 * @param {string} authToken
 * @param {object} options
 * @constructor
 */
progrestar.Pushd4Client = function (servers, networkIdent, applicationId, userId, authToken, options) {
	this._socket = null;
	this._ping = null;

	this._status = 'disconnected';

	this._servers = [];
	this._networkIdent = networkIdent;
	this._applicationId = applicationId;
	this._userId = userId;
	this._authToken = authToken;

	this._reconnect = true;

	this._config = {
		debug: true,
		reconnectMinTimeout: 1000,
		reconnectMaxTimeout: 15000,
		reconnectAttempts: 2,
		pingInterval: 50*1000,
		version: 10
	};

	if (options) {
		for (var p in options) {
			this._config[p] = options[p];
		}
	}

	var list = servers.slice();
	progrestar.Math.shuffle(list);

	for (var i = 0; i < list.length; i++) {
		for (var j = 0; j < this._config.reconnectAttempts; j++) {
			this._servers.push(servers[i]);
		}
	}

	this._handlers = {};
	this._messagesHistory = [];
	this._antidup = [];
};

progrestar.Pushd4Client.prototype._debug = function () {
	if (this._config.debug === true) {
		if (typeof window.console !== 'undefined') {
			var logger = window.console.debug;

			if (typeof logger === 'function') {
				logger.apply(window.console, arguments);
			}
		}
	}
};

progrestar.Pushd4Client.prototype._isDisconnected = function () {
	return this._isConnected() === false;
};

progrestar.Pushd4Client.prototype._isConnected = function () {
	return this._status === 'connected';
};

progrestar.Pushd4Client.prototype._setStatus = function (newStatus) {
	if (this._status !== newStatus) {
		this._debug('Status', this._status, '->', newStatus);
		this._status = newStatus;
	}
};

progrestar.Pushd4Client.prototype._schedulePing = function () {
	var self = this;

	clearTimeout(self._ping);

	self._ping = setTimeout(function () {
		self._send({method: 'ping'});
	}, self._config.pingInterval);
};

progrestar.Pushd4Client.prototype._send = function (message) {

console.log(Object.values(message));
	if (this._socket) {
		this._socket.send(JSON.stringify(message));
		this._schedulePing();
	}
};

progrestar.Pushd4Client.prototype.connect = function () {
	var self = this;

	if (self._isConnected()) {
		throw 'Already connected';
	}

	self._setStatus('connecting');

	self._reconnect = true;

	var currentServer = self._servers.shift();

	if (typeof window.WebSocket === 'undefined') {
		self._debug('Undefined WebSocket object');
		return;
	}

	self._socket = new window.WebSocket(currentServer);

	var isFlashSocket = (typeof window.WebSocket.loadFlashPolicyFile === 'function');

	self._servers.push(currentServer);

	self._setStatus('connecting ' + currentServer);

	self._socket.onopen = function () {
		var authMessage = {
			method: 'auth',
			params: {
				networkIdent: self._networkIdent,
				applicationId: self._applicationId,
				userId: 1,
				authToken: self._authToken,
				version: self._config.version,
				isFlashSocket: isFlashSocket
			}
		};

		self._send(authMessage);
	};

	self._socket.onerror = function (error) {
		self._debug('WebSocket error');
	};

	self._socket.onclose = function () {
		self._setStatus('disconnected');
		self.emit('disconnect');
		self.flashEmit('disconnect');

		clearTimeout(self._ping);

		if (self._reconnect === true) {
			var timeout = self._config.reconnectMinTimeout;
			timeout += Math.floor(Math.random() * (self._config.reconnectMaxTimeout - timeout));

			window.setTimeout(function () {
				if (self._reconnect === true) {
					self.connect.call(self);
				}
			}, timeout);
		}
	};

	self._socket.onmessage = function (message) {
		self._debug('Received', message.data);

		self._schedulePing();

		var data = {};

		try {
			data = JSON.parse(message.data);
		} catch (e) {
			self.emit('error', [message]);
		}

		self._receive(data);
	};
};

progrestar.Pushd4Client.prototype.disconnect = function () {
	this._setStatus('disconnected');
	this._reconnect = false;

	if (this._socket) {
		this._socket.close();
	}
};

progrestar.Pushd4Client.prototype._receive = function (message) {
	if (message === undefined || message === null) {
		return;
	}

	if (message.error) {
		this._debug('server error', message);
		this.emit('error', [message]);
		return;
	}

	var method = message.method;

	if (method === 'auth') {
		this._authResponse(message);
	} else if (method === 'msg') {
		this._messageResponse(message);
	} else if (method === 'ping' || method === 'pong') {
		// ...
	} else {
		this._debug('unknown method', message);
		this.emit('error', [message]);
	}
};

progrestar.Pushd4Client.prototype._authResponse = function (message) {
	var self = this;

	if (message.result) {
		self._setStatus('connected');
		self.emit('connect');
		self.flashEmit('connect');
	} else {
		self._reconnect = false;
		self._debug('error', message);
		self.emit('error', [message]);
		self._socket.close();
	}
};

progrestar.Pushd4Client.prototype._messageResponse = function (message) {
	var data = message.result;

	this._debug('message', data);

	var id = '' + data.type + ':' + data.date + ':' + (data.body ? data.body.id : '');

	for (var i = 0; i < this._antidup.length; i++) {
		if (this._antidup[i] === id) {
			console.log('message duplicate', data);
			return;
		}
	}

	this._antidup.push(id);
	if (this._antidup.length > 1000)
		this._antidup.shift();

	this.emit('message', data);
	this.flashEmit('message', data);

	if (this._messagesHistory !== null && this._messagesHistory.length < 1000)
		this._messagesHistory.push(data);
};

progrestar.Pushd4Client.prototype.emit = function (event, data) {
	if(!this._handlers[event])
		return;

	for(var i=0; i<this._handlers[event].length; i++) {
		try {
			this._handlers[event][i](data);
		} catch(e) {}
	}
};

progrestar.Pushd4Client.prototype.on = function (event, cb) {
	if (!this._handlers[event])
		this._handlers[event] = [];

	this._handlers[event].push(cb);
};

progrestar.Pushd4Client.prototype.flashEmit = function (event, parameters) {
	progrestar.flashGate.emit('pushd', event, parameters);
};

progrestar.Pushd4Client.prototype.flashStarted = function () {
	if (this._messagesHistory) {
		this.flashEmit('connect');

		for (var i = 0; i < this._messagesHistory.length; i++) {
			this.flashEmit('message', this._messagesHistory[i]);
		}

		this._messagesHistory = null;

		if (!this._isConnected())
			this.flashEmit('disconnect');
	} else {
		if (this._isConnected())
			this.flashEmit('connect');
		else
			this.flashEmit('disconnect');
	}
};