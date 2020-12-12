var express = require('express');
var router = express.Router();
//require controllers
const roomController = require('../controllers/roomController');
const { checkAdmin, checkLogin } = require('./middleware/authenticationMiddleware');
const upload = require('./middleware/uploadPhoto');

router.get('/', roomController.listRooms);
router.post('/', checkAdmin, upload.single('photoName'), roomController.saveRoom);
router.get('/create', checkAdmin, roomController.displayCreateRoomPage); //from admin dashboard
router.get('/:roomId/edit', checkAdmin, roomController.displayRoomEditPage); //admin to edit
router.post('/search', roomController.searchRoomsByLocation);
router.post('/:roomId/book', checkLogin, roomController.bookRoom);
router.post('/:roomId/delete', checkAdmin, roomController.deleteRoom);
router.post('/:roomId/reviews', checkLogin, roomController.createReview);
router.get('/:roomId', roomController.getRoom); 

module.exports = router;
