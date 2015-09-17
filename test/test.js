var tessel = require('tessel');
var relayDriver = require('../');
var relayPort = tessel.port.A;
var testPort = tessel.port['B'];

var pinout = testPort.digital[0];
var pinin = testPort.digital[1];

var relay = relayDriver.use(relayPort);

console.log('1..5');

relay.on('ready', function () {
  console.log('# ready');
  console.log('ok');

  var channel = 1;

  setup(function() {
    testHelper(relay.turnOff.bind(relay), channel, 1, function() {
      testHelper(relay.turnOn.bind(relay), channel, 0, function() {
        testHelper(relay.turnOff.bind(relay), channel, 1, function() {
          pinout.write(1, function() {
            testHelper(relay.turnOn.bind(relay), channel, 1);
          });
        });
      });
    });
  });
});

function setup(cb) {
  pinout.output();
  pinin.input();
  pinout.write(false, cb);
}

function testHelper(relayFunc, channel, expectedValue, cb) {
  var timeout = 1000;

  relayFunc(channel, timeout, function(err) {
    if (err) {
      console.log('not ok', err);
      return cb && cb();
    }
    else {
      pinin.read(function(err, value) {
        if (err) {
          console.log('not ok', err);
          return cb && cb();
        }
        else {
          console.log('# in', value);
          console.log(value == expectedValue ? 'ok' : 'not ok');
          return cb && cb();
        }
      });
    }
  })
}

relay.on('latch', function(channel, value) {
  console.log('# latch on channel ' + channel + ' switched to', value);
});