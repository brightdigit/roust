module.exports = function (Roust) {
  return Roust.configure({
    index : function (req, res) {
      res.send('list');
    },
    show : function (req, res) {
      res.send('show');
    },
    create : function (req, res) {
      res.send('show');
    },
    update : function (req, res) {
      res.send('show');
    },
    destroy : function (req, res) {
      res.send('show');
    }
  });
};