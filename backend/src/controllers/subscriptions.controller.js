const Subscription = require('../models/Subscription');
const Suggestion = require('../models/Suggestion');

// @desc Get all subscriptions for logged-in user
exports.getSubscriptions = async (req, res) => {
 try {
 const subscriptions = await Subscription.find({ 
 userId: req.user.id,
 status: { $ne: 'cancelled' }
 }).sort({ nextRenewalDate: 1 });
 
 res.json({
 success: true,
 count: subscriptions.length,
 data: subscriptions
 });
 } catch (error) {
 console.error('Get subscriptions error:', error);
 res.status(500).json({ success: false, message: error.message });
 }
};

// @desc Get single subscription by ID
exports.getSubscriptionById = async (req, res) => {
 try {
 const subscription = await Subscription.findOne({
 _id: req.params.id,
 userId: req.user.id
 });
 
 if (!subscription) {
 return res.status(404).json({ success: false, message: 'Subscription not found' });
 }
 
 res.json({ success: true, data: subscription });
 } catch (error) {
 console.error('Get subscription error:', error);
 res.status(500).json({ success: false, message: error.message });
 }
};

// @desc Add manual subscription
exports.addManualSubscription = async (req, res) => {
 try {
 const { merchant, amount, billingCycle, nextRenewalDate, cancellationUrl, cancellationInstructions } = req.body;
 
 if (!merchant || !amount || !billingCycle || !nextRenewalDate) {
 return res.status(400).json({ 
 success: false, 
 message: 'Please provide merchant, amount, billingCycle, and nextRenewalDate' 
 });
 }
 
 const subscription = await Subscription.create({
 userId: req.user.id,
 merchant,
 amount,
 billingCycle,
 nextRenewalDate: new Date(nextRenewalDate),
 detectedSource: 'manual',
 status: 'active',
 cancellationUrl,
 cancellationInstructions
 });
 
 res.status(201).json({
 success: true,
 message: 'Subscription added successfully',
 data: subscription
 });
 } catch (error) {
 console.error('Add manual subscription error:', error);
 res.status(500).json({ success: false, message: error.message });
 }
};

// @desc Update subscription
exports.updateSubscription = async (req, res) => {
 try {
 const { merchant, amount, billingCycle, nextRenewalDate, cancellationUrl, cancellationInstructions } = req.body;
 
 const subscription = await Subscription.findOne({
 _id: req.params.id,
 userId: req.user.id
 });
 
 if (!subscription) {
 return res.status(404).json({ success: false, message: 'Subscription not found' });
 }
 
 if (merchant) subscription.merchant = merchant;
 if (amount) subscription.amount = amount;
 if (billingCycle) subscription.billingCycle = billingCycle;
 if (nextRenewalDate) subscription.nextRenewalDate = new Date(nextRenewalDate);
 if (cancellationUrl) subscription.cancellationUrl = cancellationUrl;
 if (cancellationInstructions) subscription.cancellationInstructions = cancellationInstructions;
 
 subscription.updatedAt = new Date();
 await subscription.save();
 
 res.json({
 success: true,
 message: 'Subscription updated successfully',
 data: subscription
 });
 } catch (error) {
 console.error('Update subscription error:', error);
 res.status(500).json({ success: false, message: error.message });
 }
};

// @desc Pause subscription
exports.pauseSubscription = async (req, res) => {
 try {
 const subscription = await Subscription.findOne({
 _id: req.params.id,
 userId: req.user.id
 });
 
 if (!subscription) {
 return res.status(404).json({ success: false, message: 'Subscription not found' });
 }
 
 if (subscription.status === 'paused') {
 return res.status(400).json({ success: false, message: 'Subscription is already paused' });
 }
 
 subscription.status = 'paused';
 await subscription.save();
 
 res.json({
 success: true,
 message: 'Subscription paused. You will not receive renewal reminders.',
 data: subscription
 });
 } catch (error) {
 console.error('Pause subscription error:', error);
 res.status(500).json({ success: false, message: error.message });
 }
};

// @desc Resume subscription
exports.resumeSubscription = async (req, res) => {
 try {
 const subscription = await Subscription.findOne({
 _id: req.params.id,
 userId: req.user.id
 });
 
 if (!subscription) {
 return res.status(404).json({ success: false, message: 'Subscription not found' });
 }
 
 if (subscription.status === 'active') {
 return res.status(400).json({ success: false, message: 'Subscription is already active' });
 }
 
 subscription.status = 'active';
 await subscription.save();
 
 res.json({
 success: true,
 message: 'Subscription resumed. Renewal reminders are now active.',
 data: subscription
 });
 } catch (error) {
 console.error('Resume subscription error:', error);
 res.status(500).json({ success: false, message: error.message });
 }
};

// @desc Delete/Cancel subscription
exports.deleteSubscription = async (req, res) => {
 try {
 const subscription = await Subscription.findOne({
 _id: req.params.id,
 userId: req.user.id
 });
 
 if (!subscription) {
 return res.status(404).json({ success: false, message: 'Subscription not found' });
 }
 
 subscription.status = 'cancelled';
 subscription.cancelledDate = new Date();
 await subscription.save();
 
 res.json({
 success: true,
 message: 'Subscription removed from your list'
 });
 } catch (error) {
 console.error('Delete subscription error:', error);
 res.status(500).json({ success: false, message: error.message });
 }
};

// @desc Get pending suggestions
exports.getSuggestions = async (req, res) => {
 try {
 const suggestions = await Suggestion.find({ 
 userId: req.user.id, 
 status: 'pending' 
 }).sort({ createdAt: -1 });
 
 res.json({
 success: true,
 count: suggestions.length,
 data: suggestions
 });
 } catch (error) {
 console.error('Get suggestions error:', error);
 res.status(500).json({ success: false, message: error.message });
 }
};

// @desc Approve a detected subscription
exports.approveSuggestion = async (req, res) => {
 try {
 const suggestion = await Suggestion.findOne({ 
 _id: req.params.suggestionId, 
 userId: req.user.id 
 });
 
 if (!suggestion) {
 return res.status(404).json({ success: false, message: 'Suggestion not found' });
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
 
 res.json({
 success: true,
 message: 'Subscription added successfully',
 data: subscription
 });
 } catch (error) {
 console.error('Approve suggestion error:', error);
 res.status(500).json({ success: false, message: error.message });
 }
};

// @desc Reject a detected subscription
exports.rejectSuggestion = async (req, res) => {
 try {
 const suggestion = await Suggestion.findOne({ 
 _id: req.params.suggestionId, 
 userId: req.user.id 
 });
 
 if (!suggestion) {
 return res.status(404).json({ success: false, message: 'Suggestion not found' });
 }
 
 suggestion.status = 'rejected';
 await suggestion.save();
 
 res.json({
 success: true,
 message: 'Suggestion rejected'
 });
 } catch (error) {
 console.error('Reject suggestion error:', error);
 res.status(500).json({ success: false, message: error.message });
 }
};
