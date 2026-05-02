import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords }) => {
    const siteName = 'PayPilot - Smart Payment Control';
    const defaultDescription = 'Smart Payment Control & Reconciliation Platform - Manage subscriptions, track rewards, reconcile bank statements, and control multiple wallets from one intelligent dashboard.';
    const defaultKeywords = 'paypilot, payment control, subscription tracker, rewards management, bank reconciliation, MERN stack, fintech';

    return (
        <Helmet>
            <title>{title ? `${title} | ${siteName}` : siteName}</title>
            <meta name="description" content={description || defaultDescription} />
            <meta name="keywords" content={keywords || defaultKeywords} />
            
            {/* Open Graph / Social Media */}
            <meta property="og:title" content={title ? `${title} | ${siteName}` : siteName} />
            <meta property="og:description" content={description || defaultDescription} />
            <meta property="og:type" content="website" />
            <meta property="og:url" content="https://paypilot-woad.vercel.app" />
            
            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title ? `${title} | ${siteName}` : siteName} />
            <meta name="twitter:description" content={description || defaultDescription} />
        </Helmet>
    );
};

export default SEO;
