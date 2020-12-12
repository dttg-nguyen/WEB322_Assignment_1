//check user authentication
module.exports = {
  checkNotLogin: function (req, res, next) {
    if (req.session.user) {
      res.redirect('/');
    } else {
      next();
    }
  },
  checkLogin: function (req, res, next) {
    if (!req.session.user) {
      res.redirect('/user/logIn');
    } else {
      next();
    }
  },
  checkAdmin: function (req, res, next) {
    if (!req.session.user || !req.session.user.isAdmin) {
      res.redirect('/user/logIn');
    } else {
      next();
    }
  }
};
