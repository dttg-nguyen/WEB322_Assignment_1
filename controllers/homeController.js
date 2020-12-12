exports.home = function (req, res) {
  res.render('home', { user: req.session.user, layout: false });
};
