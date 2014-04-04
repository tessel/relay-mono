var tessel = require('tessel');
var relayDriver = require('../');

var relay = relayDriver.use(tessel.port('a'), function(err) {
  console.log('connected!');

  setInterval(function toggleOne() {
    relay.toggle(1, function toggleResult(err) {
      if (err) console.log("Err toggling 1", err);
    });
    relay.toggle(2, function toggleResult(err) {
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
