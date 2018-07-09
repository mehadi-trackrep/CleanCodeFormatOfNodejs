exports.show = function(req, res, next){
  var coin_name = req.params.name;
  res.render('CK_highchart', {NAME: coin_name});
};
