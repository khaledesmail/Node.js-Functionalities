const express = require('express');
const ProfileService = require('../services/ProfileService');
const {
  auth
} = require('../middlewares/auth');
const router = express.Router();

//  ------------------------------------------------------------------------------------//
// Common APIs

router.post('/rest/api/v1/profile/signin', async (req, res) => {
  const response = await ProfileService.signin(req, res);
  if (response.body.success) {
    res.cookie('auth', response.body.data.token).status(response.status ? response.status : 500).json(response.body);
  } else {
    res.status(response.status ? response.status : 500).json(response.body);
  }
});
//  ------------------------------------------------------------------------------------//
// APIs For Job
router.post('/rest/api/v1/profile/job', auth, async (req, res) => {
  try {
    console.log('req', req.body);
    const response = await ProfileService.find(req, res);
    res.status(response.status ? response.status : 500).json(response.body);
    res.end();
  } catch (error) {
    res.status(401).json(error);
  }
});

module.exports = router;