"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = require("express");
var _axios = _interopRequireDefault(require("axios"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const router = (0, _express.Router)();
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = 'https://ggform.netlify.app/api/discord/auth-callback';
router.get('/auth', (req, res) => {
  const authorizationUrl = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=identify`;
  res.redirect(authorizationUrl);
});
router.get('/auth-callback', async (req, res) => {
  const code = req.query.code;
  if (!code) {
    return res.status(400).send('No code provided');
  }
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    code,
    grant_type: 'authorization_code',
    redirect_uri: REDIRECT_URI
  });
  try {
    const tokenRes = await _axios.default.post('https://discord.com/api/oauth2/token', params);
    const token = tokenRes.data.access_token;
    const userRes = await _axios.default.get(`https://discord.com/api/v6/users/@me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    res.json(userRes.data);
  } catch (err) {
    console.error('Error fetching token or user data:', err.response ? err.response.data : err);
    res.status(500).send(err.response ? err.response.data : 'Unknown error');
  }
});
var _default = exports.default = router;