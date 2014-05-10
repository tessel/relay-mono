var util = require('util');
var events = require('events');

function use(hardware, callback) {
	return new Relay(hardware, callback);
}

function Relay(hardware, callback) {
	// Save the port
	this.hardware = hardware;
	// Set the gpios as output
	this.hardware.gpio(1).output(false);
	this.hardware.gpio(2).output(false);
	// We're done setting up, call callback
	if(callback) {
		callback(null, this);
	}
	// Emit the ready event
	setImmediate(function() {
		this.emit('ready');
	}.bind(this));
}

util.inherits(Relay, events.EventEmitter);

Relay.prototype._setValue = function(chan, value, callback) {
	var err;
	if ((err = this._validChannel(chan))) {
		return callback && callback(err);
	}
	else {
		// Get the relay
		var relay = this.hardware.gpio(chan);
		// Set the value of that gpio
		relay.write(value);
		// Call the callback
		if (callback) {
			callback();
		}
		// Set the event
		setImmediate(function() {
			this.emit('latch', chan, value);
		}.bind(this));
	}
};

Relay.prototype._validChannel = function(channel) {
	if (!(channel > 0 || channel <= Object.keys(this.relays))) {
		return new Error("Invalid relay channel. Must be 1 or 2.");
	}
	return null;
};

Relay.prototype.getState = function(chan, callback) {
	var err;
	if ((err = this._validChannel(chan))) {
		return callback && callback(err);
	}
	else {
		if (callback) {
			callback(null, this.hardware.gpio(chan).rawRead());
		}
	}
};

Relay.prototype.toggle = function(chan, callback) {
	this.getState(chan, function gotState(err, state) {
		if (err) {
			return callback && callback(err);
		}
		else {
			this._setValue(chan, !state, callback);
			if (callback) {
				callback();
			}
		}
	}.bind(this));
};

Relay.prototype.turnOff = function(chan, callback) {
	this._setValue(chan, false, callback);
};

Relay.prototype.turnOn = function(chan, callback) {
	this._setValue(chan, true, callback);
};

module.exports.use = use;
module.exports.Relay = Relay;
