import React from 'react';
import { X, ExternalLink, AlertCircle, CheckCircle } from 'lucide-react';

const cancellationGuides = {
    'netflix': {
        name: 'Netflix',
        icon: '??',
        steps: [
            'Go to Netflix.com and sign in to your account',
            'Click on your profile icon in the top-right corner',
            'Select "Account" from the dropdown menu',
            'Under "Membership & Billing", click "Cancel Membership"',
            'Follow the prompts to confirm cancellation',
            'Your subscription will remain active until the current billing period ends'
        ],
        url: 'https://www.netflix.com/account',
        tips: [
            'You can still watch until your billing period ends',
            'Netflix may offer a retention discount - you can accept or decline',
            'Your viewing history will be saved if you reactivate within 10 months'
        ]
    },
    'spotify': {
        name: 'Spotify',
        icon: '??',
        steps: [
            'Go to Spotify.com and sign in',
            'Click on your profile picture in the top-right',
            'Select "Account" from the menu',
            'Click on "Subscription" in the left sidebar',
            'Click "Cancel Premium" or "Change Plan"',
            'Select "Cancel Premium" and confirm'
        ],
        url: 'https://www.spotify.com/account/',
        tips: [
            'Your playlists and saved music will not be deleted',
            'You can switch to Spotify Free (with ads)',
            'Cancellation takes effect at the end of your billing cycle'
        ]
    },
    'amazon prime': {
        name: 'Amazon Prime',
        icon: '??',
        steps: [
            'Go to Amazon.com and sign in',
            'Hover over "Account & Lists" and click "Prime Membership"',
            'Click on "Manage Membership"',
            'Click "End Membership" or "Cancel"',
            'Follow the confirmation prompts',
            'You may be offered a partial refund depending on usage'
        ],
        url: 'https://www.amazon.com/gp/primecentral',
        tips: [
            'You will receive a refund for any unused portion',
            'Prime benefits continue until the end of the current billing period',
            'You can rejoin anytime'
        ]
    },
    'youtube premium': {
        name: 'YouTube Premium',
        icon: '??',
        steps: [
            'Go to YouTube.com and sign in',
            'Click on your profile picture in the top-right',
            'Click on "Purchases and memberships"',
            'Find YouTube Premium and click "Manage"',
            'Click "Cancel" and follow the prompts',
            'Confirm cancellation'
        ],
        url: 'https://www.youtube.com/paid_memberships',
        tips: [
            'Your membership continues until the next billing date',
            'You can still watch downloaded videos in offline mode after cancellation? (Limited time)',
            'Background play will be disabled after cancellation'
        ]
    },
    'apple': {
        name: 'Apple Services',
        icon: '??',
        steps: [
            'Open Settings app on your iPhone/iPad',
            'Tap your name/Apple ID at the top',
            'Tap "Subscriptions"',
            'Select the subscription you want to cancel',
            'Tap "Cancel Subscription" and confirm',
            'On Mac: Open App Store ? Click your name ? View Information ? Manage Subscriptions'
        ],
        url: 'https://appleid.apple.com/account/manage',
        tips: [
            'Cancellations apply to Apple Music, iCloud+, Apple TV+, and Arcade',
            'You can manage all Apple subscriptions from one place',
            'Cancel at least 24 hours before renewal to avoid charges'
        ]
    },
    'disney+': {
        name: 'Disney+',
        icon: '?',
        steps: [
            'Go to DisneyPlus.com and sign in',
            'Click on your profile icon',
            'Select "Account" from the menu',
            'Under "Subscription", click "Cancel Subscription"',
            'Select a reason for cancellation',
            'Click "Continue to Cancel" and confirm'
        ],
        url: 'https://www.disneyplus.com/account',
        tips: [
            'You can access Disney+ until your billing period ends',
            'Your watchlist and preferences will be saved',
            'Disney may offer a discount to keep you subscribed'
        ]
    },
    'microsoft': {
        name: 'Microsoft 365',
        icon: '??',
        steps: [
            'Go to account.microsoft.com/services and sign in',
            'Find your Microsoft 365 subscription',
            'Click "Manage" next to the subscription',
            'Click "Cancel subscription"',
            'Follow the prompts to confirm',
            'You may be eligible for a pro-rated refund'
        ],
        url: 'https://account.microsoft.com/services',
        tips: [
            'Your Office apps will switch to read-only mode after expiry',
            'You have 30 days to reactivate with all data intact',
            'OneDrive storage will reduce after cancellation'
        ]
    }
};

const getGuide = (merchant) => {
    const merchantLower = merchant.toLowerCase();
    
    // Try exact match
    if (cancellationGuides[merchantLower]) {
        return cancellationGuides[merchantLower];
    }
    
    // Try partial match
    for (const [key, guide] of Object.entries(cancellationGuides)) {
        if (merchantLower.includes(key) || key.includes(merchantLower)) {
            return guide;
        }
    }
    
    // Default guide for unknown providers
    return {
        name: merchant,
        icon: '??',
        steps: [
            `Go to ${merchant}'s website and sign in to your account`,
            'Navigate to "Account Settings" or "Subscription Management"',
            'Look for "Cancel Subscription" or "Manage Membership"',
            'Follow the on-screen instructions to cancel',
            'Confirm your cancellation when prompted',
            'Check your email for cancellation confirmation'
        ],
        url: null,
        tips: [
            'Always check your email for cancellation confirmation',
            'Remove payment methods if you want to prevent future charges',
            'Take screenshots of the cancellation confirmation for your records'
        ]
    };
};

const CancellationModal = ({ subscription, onClose, onConfirm }) => {
    const guide = getGuide(subscription.merchant);
    
    const handleCancel = () => {
        if (guide.url) {
            window.open(guide.url, '_blank');
        }
        if (onConfirm) onConfirm();
        onClose();
    };
    
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#1f2020] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/10 shadow-2xl">
                {/* Header */}
                <div className="sticky top-0 bg-[#1f2020] px-6 py-4 border-b border-white/10 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <span className="text-3xl">{guide.icon}</span>
                        <div>
                            <h2 className="text-xl font-bold text-white">Cancel {guide.name}</h2>
                            <p className="text-sm text-slate-400">Follow these steps to cancel your subscription</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                    >
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                </div>
                
                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Important Note */}
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 flex gap-3">
                        <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm text-yellow-400 font-medium">Important Note</p>
                            <p className="text-sm text-slate-300 mt-1">
                                PayPilot cannot cancel subscriptions automatically. You need to follow these steps 
                                on the provider's website. This is because Netflix, Spotify, and similar services 
                                do not provide any public API for third-party cancellation.
                            </p>
                        </div>
                    </div>
                    
                    {/* Steps */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Step-by-Step Instructions</h3>
                        <div className="space-y-3">
                            {guide.steps.map((step, index) => (
                                <div key={index} className="flex gap-3">
                                    <div className="w-6 h-6 rounded-full bg-indigo-600/20 text-indigo-400 flex items-center justify-center text-xs font-bold flex-shrink-0">
                                        {index + 1}
                                    </div>
                                    <p className="text-sm text-slate-300">{step}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {/* Tips */}
                    {guide.tips && (
                        <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-4">
                            <h4 className="text-sm font-semibold text-green-400 mb-2 flex items-center gap-2">
                                <CheckCircle className="w-4 h-4" />
                                Pro Tips
                            </h4>
                            <ul className="space-y-1">
                                {guide.tips.map((tip, index) => (
                                    <li key={index} className="text-xs text-slate-400 flex items-start gap-2">
                                        <span className="text-green-400">•</span>
                                        {tip}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    
                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t border-white/10">
                        {guide.url && (
                            <button
                                onClick={handleCancel}
                                className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-500 transition-all flex items-center justify-center gap-2"
                            >
                                <ExternalLink className="w-4 h-4" />
                                Go to {guide.name}
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className={`${guide.url ? 'flex-1' : 'w-full'} py-3 rounded-xl font-medium border border-white/10 hover:bg-white/5 transition-all`}
                        >
                            I'll do this later
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CancellationModal;
