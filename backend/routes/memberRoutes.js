const express = require('express');
const router = express.Router();

router.post('/:tripId', (req, res) => {
  res.json({
    success: true,
    message: 'Add member endpoint ready for MongoDB implementation.',
    data: req.body,
  });
});

router.delete('/:tripId/:memberName', (req, res) => {
  res.json({
    success: true,
    message: 'Remove member endpoint ready for MongoDB implementation.',
    data: {
      tripId: req.params.tripId,
      memberName: req.params.memberName,
    },
  });
});

module.exports = router;
