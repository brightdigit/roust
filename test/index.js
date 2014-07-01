var assert = require("assert");
var roust = require(__dirname + '/../index.js');

describe('roust', function () {
  it('should return -1 when the value is not present', function () {
    var res = {
      send: function (value) {
        this.sent.push(value);
      },
      sent: []
    };
    assert(roust);
    assert.equal(typeof(roust()), 'function');
    roust()(null, res);
    assert.equal(res.sent[0], 'hello world');
  });
});