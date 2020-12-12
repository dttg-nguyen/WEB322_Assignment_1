const express = require('express');
const userController = require('../controllers/userController');
const { checkLogin, checkNotLogin } = require('./middleware/authenticationMiddleware');
const router = express.Router();

router.get('/login', checkNotLogin, userController.loginGet);
router.post('/login', checkNotLogin, userController.loginPost);
router.get('/sign-up', checkNotLogin, userController.signUpGet);
router.post('/sign-up', checkNotLogin, userController.signUpPost);
router.get('/dashboard', checkLogin, userController.dashboardGet);
// router.get('/user-dashboard', checkLogin, userController.userDashboardGet);
// router.get('/admin-dashboard', checkLogin, userController.adminDashboard);
router.get('/logout', checkLogin, userController.logout);

module.exports = router;
