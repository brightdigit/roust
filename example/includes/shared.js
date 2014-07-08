module.exports = function (save) {
  console.log(save);
  save("datetime", function () {return new Date(); })
};