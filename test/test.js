var tessel = require('tessel');
var relayDriver = require('../');
var port = tessel.port('a');
var relay = relayDriver.use(port, function(err) {
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


// var pin = port.gpio(1).output();
// var value = false;
// setInterval(function() {
//   pin.writeSync(value);
//   value = !value;
//   console.log(pin.readSync());
// }, 3000);
