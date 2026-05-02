import * as Yup from 'yup';

export const loginSchema = Yup.object({
    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
    password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
});

export const signupSchema = Yup.object({
    fullName: Yup.string()
        .min(2, 'Name must be at least 2 characters')
        .required('Full name is required'),
    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
    password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm password is required'),
});

export const subscriptionSchema = Yup.object({
    merchant: Yup.string()
        .min(2, 'Merchant name must be at least 2 characters')
        .required('Merchant name is required'),
    amount: Yup.number()
        .typeError('Amount must be a number')
        .positive('Amount must be positive')
        .required('Amount is required'),
    billingCycle: Yup.string()
        .oneOf(['monthly', 'yearly', 'weekly'], 'Invalid billing cycle')
        .required('Billing cycle is required'),
    nextRenewalDate: Yup.date()
        .min(new Date(), 'Date must be in the future')
        .required('Next renewal date is required'),
});

export const walletSchema = Yup.object({
    walletName: Yup.string()
        .min(2, 'Wallet name must be at least 2 characters')
        .required('Wallet name is required'),
    provider: Yup.string()
        .min(2, 'Provider name must be at least 2 characters')
        .required('Provider is required'),
    balance: Yup.number()
        .typeError('Balance must be a number')
        .min(0, 'Balance cannot be negative'),
});

export const profileSchema = Yup.object({
    fullName: Yup.string()
        .min(2, 'Name must be at least 2 characters')
        .required('Full name is required'),
    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
    phone: Yup.string()
        .nullable()
        .matches(/^[+]?[\d\s()-]*$/, 'Invalid phone number'),
});

export const passwordSchema = Yup.object({
    currentPassword: Yup.string()
        .required('Current password is required'),
    newPassword: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('New password is required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
        .required('Confirm password is required'),
});
