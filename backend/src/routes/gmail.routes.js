const express = require('express');
const router = express.Router();
const { google } = require('googleapis');
const GmailService = require('../services/gmail.service');
const { protect } = require('../middleware/auth');
const User = require('../models/user.model');
const Subscription = require('../models/Subscription');
const Suggestion = require('../models/Suggestion');
const { detectRecurringTransactions } = require('../services/patternDetector');

const oauth2Client = new google.auth.OAuth2(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET,
  process.env.GMAIL_REDIRECT_URI
);

// Step 1: Get auth URL
router.get('/auth-url', protect, (req, res) => {
  const state = JSON.stringify({ userId: req.user.id });
  
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/gmail.readonly',
      'https://www.googleapis.com/auth/gmail.modify',
      'https://www.googleapis.com/auth/userinfo.email',  // Add this to get email
      'https://www.googleapis.com/auth/userinfo.profile' // Add this for profile info
    ],
    prompt: 'consent',
    state: Buffer.from(state).toString('base64')
  });
  
  console.log('Generated auth URL for user:', req.user.id);
  res.json({ authUrl });
});

// Step 2: Callback after user authorizes
router.get('/callback', async (req, res) => {
  const { code, state } = req.query;
  
  try {
    // Decode state to get user ID
    let userId = null;
    if (state) {
      try {
        const decodedState = JSON.parse(Buffer.from(state, 'base64').toString());
        userId = decodedState.userId;
      } catch (e) {
        console.error('Failed to decode state:', e);
      }
    }
    
    const { tokens } = await oauth2Client.getToken(code);
    
    if (userId) {
      // Get the user's Gmail email address using the token
      oauth2Client.setCredentials({ access_token: tokens.access_token });
      const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
      
      let gmailEmail = null;
      try {
        const userInfo = await oauth2.userinfo.get();
        gmailEmail = userInfo.data.email;
        console.log('Gmail email fetched:', gmailEmail);
      } catch (emailError) {
        console.error('Failed to fetch Gmail email:', emailError);
      }
      
      await User.findByIdAndUpdate(userId, {
        gmailAccessToken: tokens.access_token,
        gmailRefreshToken: tokens.refresh_token,
        gmailConnectedAt: new Date(),
        gmailEmail: gmailEmail  // Store the actual Gmail email
      });
      console.log('Gmail connected for user:', userId, 'Email:', gmailEmail);
    }
    
    res.redirect(`${process.env.FRONTEND_URL}/subscriptions?gmail=connected`);
  } catch (error) {
    console.error('Gmail callback error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/subscriptions?gmail=error`);
  }
});

// Step 3: Check Gmail connection status
router.get('/status', protect, async (req, res) => {
  const user = await User.findById(req.user.id);
  const connected = !!(user?.gmailAccessToken);
  res.json({ 
    connected, 
    email: user?.gmailEmail || null 
  });
});

// Step 4: Disconnect Gmail
router.post('/disconnect', protect, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, {
      gmailAccessToken: null,
      gmailRefreshToken: null,
      gmailConnectedAt: null,
      gmailEmail: null
    });
    res.json({ message: 'Gmail disconnected successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
