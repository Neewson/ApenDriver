const express = require('express');
const { 
  getVideoFiles, 
  getVideoFile, 
  streamVideo 
} = require('../controllers/videoController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, getVideoFiles);
router.get('/:id', protect, getVideoFile);
router.get('/:id/stream', protect, streamVideo);

module.exports = router;
