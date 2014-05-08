var util = require('util');
var events = require('events');

function use(hardware, next) {
	return new Relay(hardware, next);
}

function Relay(hardware, next) {
	// Save the port
	this.hardware = hardware;
	// Set the gpios as output
	this.hardware.gpio(1).output(false);
	this.hardware.gpio(2).output(false);
	// We're done setting up, call callback
	if(next) {
		next(null, this);
	}
	// Emit the ready event
	setImmediate(function() {
		this.emit('ready');
	}.bind(this));
}

util.inherits(Relay, events.EventEmitter);

Relay.prototype.turnOn = function(chan, next) {
	this._setValue(chan, true, next);
};

Relay.prototype.turnOff = function(chan, next) {
	this._setValue(chan, false, next);
};

Relay.prototype.toggle = function(chan, next) {
	this.getState(chan, function gotState(err, state) {
		if (err) {
			return next && next(err);
		}
		else {
			this._setValue(chan, !state, next);
			if (next) {
				next();
			}
		}
	}.bind(this));
};

Relay.prototype.getState = function(chan, next) {
	var err;
	if ((err = this._validChannel(chan))) {
		return next && next(err);
	}
	else {
		if (next) {
			next(null, this.hardware.gpio(chan).rawRead());
		}
	}
};

Relay.prototype._setValue = function(chan, value, next) {
	var err;
	if ((err = this._validChannel(chan))) {
		return next && next(err);
	}
	else {
		// Get the relay
		var relay = this.hardware.gpio(chan);
		// Set the value of that gpio
		relay.write(value);
		// Call the callback
		if (next) {
			next();
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

module.exports.use = use;
module.exports.Relay = Relay;
