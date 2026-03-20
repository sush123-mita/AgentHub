const express = require('express');
const router = express.Router();
const queryCtrl = require('../controllers/agentController');
const reviewCtrl = require('../controllers/reviewController');

router.get('/featured', queryCtrl.getFeatured);
router.get('/trending', queryCtrl.getTrending);
router.get('/', queryCtrl.getAgents);
router.get('/:id', queryCtrl.getAgent);
router.post('/', queryCtrl.createAgent);
// Note: PUT and DELETE were in MongoDB, but hackathon requirements omit them. 
// Adding usage & review routes here.
router.post('/:id/use', queryCtrl.useAgent);
router.post('/:id/review', reviewCtrl.addReview);

module.exports = router;
