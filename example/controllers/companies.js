module.exports = function (include) {
  return {
    companies : {
      params : {

      },
      actions:
      {
        index : function (req, res) {
          res.send('list ' + include("datetime"));
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
      }
    }
  };
};