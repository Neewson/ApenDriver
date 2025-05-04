const express = require('express');
const { 
  getImageFiles, 
  getImageFile, 
  viewImage 
} = require('../controllers/imageController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, getImageFiles);
router.get('/:id', protect, getImageFile);
router.get('/:id/view', protect, viewImage);

module.exports = router;
