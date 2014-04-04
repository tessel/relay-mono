#Relay
Driver for the relay-mono Tessel relay module ([IM48GDR]()).

##Installation
```sh
npm install relay-mono
```

##Example
```.js
var tessel = require('tessel');
var relayDriver = require('relay-mono');

var relay = relayDriver.use(tessel.port('a'), function(err) {
  console.log('connected!');

  setInterval(function toggle() {
    relay.toggle(1, function toggleOneResult(err) {
      if (err) console.log("Err toggling 1", err);
    });
    relay.toggle(2, function toggleTwoResult(err) {
      if (err) console.log("Err toggling 2", err);
    });
  }, 2000);
});

relay.on('ready', function relayReady() {
  console.log('ready!');
})

relay.on('latch', function(channel, value) {
  console.log('latch on channel ' + channel + ' switched to', value);
})


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
