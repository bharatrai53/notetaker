const express = require('express');
const router = express.Router();
const path = require('path');

// GET request
router.get('/notes', (req, res) => {
  const notesPath = path.join(__dirname, '../public/notes.html');
  res.sendFile(notesPath);
});

// Default GET request
router.get('*', (req, res) => {
  const indexPath = path.join(__dirname, '../public/index.html');
  res.sendFile(indexPath);
});

module.exports = router;
