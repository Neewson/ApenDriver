const express = require('express');
const { 
  getAudioFiles, 
  getAudioFile, 
  streamAudio 
} = require('../controllers/audioController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, getAudioFiles);
router.get('/:id', protect, getAudioFile);
router.get('/:id/stream', protect, streamAudio);

module.exports = router;
