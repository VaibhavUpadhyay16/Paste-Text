
const express = require('express');
const router = express.Router();
const pasteController = require('../controllers/pasteController');

router.get('/', pasteController.getAllPastes);

router.post('/', pasteController.createPaste);

router.get('/:id', pasteController.getPaste);

router.delete('/:id', pasteController.deletePaste);

module.exports = router;
