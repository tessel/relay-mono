#Relay
Driver for the relay-mono Tessel relay module ([IM48GDR]()).

##Installation
```sh
npm install relay-mono
```

##Example
```.js
/*********************************************
This relay module demo toggles both relay
channels every two seconds, logging the new
values to the console upon latching.
*********************************************/

// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

var tessel = require('tessel');
var relay = require('../').use(tessel.port('A'));

relay.on('ready', function relayReady () {
  console.log('Ready! Toggling relays...');
  setInterval(function toggle() {
    // Toggle relay channel 1
    relay.toggle(1, function toggleOneResult(err) {
      if (err) console.log("Err toggling 1", err);
    });
    // Toggle relay channel 2
    relay.toggle(2, function toggleTwoResult(err) {
      if (err) console.log("Err toggling 2", err);
    });
  }, 2000); // Every 2 seconds (2000ms)
});

// When a relay channel is set, it emits the 'latch' event
relay.on('latch', function(channel, value) {
  console.log('latch on relay channel ' + channel + ' switched to', value);
});
```

##API

###Commands
```.js
// Channel is either 1 or 2
// Complete the circuit through relay 1. Channel is 1 or 2
relay.turnOn( channel, function(err) {...} );

// Disconnect the circuit through relay 1. Channel is 1 or 2
relay.turnOff( channel, function(err) {...} );

// Toggle the latch state through relay 1. Channel is 1 or 2
relay.toggle( channel, function(err) {...} );

// Get the state of the relay (true or false). Channel is 1 or 2
relay.getState( channel, function(err, state) {...} );

```

###Events
```.js
// Called when module is connected and ready to receive commands
relay.on( 'ready', function() {...} );

// The latch state was changed
relay.on('latch', function(channel, newState){...});
```

## License

MIT
