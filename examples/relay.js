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
