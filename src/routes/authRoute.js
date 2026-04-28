const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');

const { registerIndividual, registerSchool, loginIndividual, loginSchool } = require('../controllers/auth.controller');

// route for individual
router.post('/register/individual', upload.single('photo'), registerIndividual);

// royte for individual login

router.post('/login/individual', loginIndividual);

// route for school registration
router.post('/register/school', upload.single('photo'), registerSchool);

// route for school login 
router.post('/login/school', loginSchool);


module.exports = router;