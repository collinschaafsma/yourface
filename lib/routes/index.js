exports.index = function(req, res){
  return res.render('index', {
    js_module: 'yourface'
  });
};
