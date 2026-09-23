const router = require('express').Router();
const ctrl = require('../controllers/incidentsController');

router.get('/', ctrl.list);
router.get('/:id', ctrl.get);
router.post('/', ctrl.create);
router.patch('/:id', ctrl.update);

module.exports = router;
