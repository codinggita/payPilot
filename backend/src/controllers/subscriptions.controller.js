const Subscription = require('../models/Subscription');
const Suggestion = require('../models/Suggestion');

// Get all subscriptions for user
exports.getSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ 
      userId: req.user.id,
      status: { $ne: 'cancelled' }
    }).sort({ nextRenewalDate: 1 });
    res.json(subscriptions);
  } catch (error) { 
    res.status(500).json({ message: error.message }); 
  }
};

// Get pending suggestions (detected subscriptions)
exports.getSuggestions = async (req, res) => {
  try {
    const suggestions = await Suggestion.find({ 
      userId: req.user.id, 
      status: 'pending' 
    }).sort({ createdAt: -1 });
    res.json(suggestions);
  } catch (error) { 
    res.status(500).json({ message: error.message }); 
  }
};

// Approve a detected subscription
exports.approveSuggestion = async (req, res) => {
  try {
    const suggestion = await Suggestion.findOne({ 
      _id: req.params.suggestionId, 
      userId: req.user.id 
    });
    
    if (!suggestion) {
      return res.status(404).json({ error: 'Suggestion not found' });
    }
    
    const subscription = await Subscription.create({
      userId: req.user.id,
      merchant: suggestion.data.merchant,
      originalMerchant: suggestion.data.originalMerchant,
      amount: suggestion.data.amount,
      billingCycle: suggestion.data.billingCycle,
      nextRenewalDate: suggestion.data.nextRenewalDate,
      detectedSource: suggestion.source,
      detectionConfidence: suggestion.data.confidence,
      matchedTransactionIds: suggestion.data.matchedTransactionIds || [],
      status: 'active'
    });
    
    suggestion.status = 'approved';
    await suggestion.save();
    
    res.json({ subscription, message: 'Subscription added successfully' });
  } catch (error) { 
    res.status(500).json({ message: error.message }); 
  }
};

// Reject a suggestion
exports.rejectSuggestion = async (req, res) => {
  try {
    await Suggestion.findOneAndUpdate(
      { _id: req.params.suggestionId, userId: req.user.id }, 
      { status: 'rejected' }
    );
    res.json({ message: 'Suggestion rejected' });
  } catch (error) { 
    res.status(500).json({ message: error.message }); 
  }
};

// Pause subscription
exports.pauseSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ 
      _id: req.params.id, 
      userId: req.user.id 
    });
    
    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }
    
    subscription.status = 'paused';
    await subscription.save();
    res.json({ subscription, message: 'Subscription paused' });
  } catch (error) { 
    res.status(500).json({ message: error.message }); 
  }
};

// Resume subscription
exports.resumeSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { status: 'active' },
      { new: true }
    );
    res.json({ subscription });
  } catch (error) { 
    res.status(500).json({ message: error.message }); 
  }
};

// Delete subscription
exports.cancelSubscription = async (req, res) => {
  try {
    await Subscription.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { status: 'cancelled', cancelledDate: new Date() }
    );
    res.json({ message: 'Subscription removed' });
  } catch (error) { 
    res.status(500).json({ message: error.message }); 
  }
};

// Add manual subscription
exports.addManualSubscription = async (req, res) => {
  try {
    const { merchant, amount, billingCycle, nextRenewalDate } = req.body;
    const subscription = await Subscription.create({
      userId: req.user.id,
      merchant,
      amount,
      billingCycle,
      nextRenewalDate: new Date(nextRenewalDate),
      detectedSource: 'manual',
      status: 'active'
    });
    res.status(201).json(subscription);
  } catch (error) { 
    res.status(500).json({ message: error.message }); 
  }
};
