import toast from 'react-hot-toast';

export const showToast = {
    success: (message) => toast.success(message, {
        duration: 3000,
        position: 'top-right',
        style: {
            background: '#1f2020',
            color: '#e3e2e2',
            border: '1px solid rgba(16, 185, 129, 0.2)',
        },
    }),
    error: (message) => toast.error(message, {
        duration: 4000,
        position: 'top-right',
        style: {
            background: '#1f2020',
            color: '#e3e2e2',
            border: '1px solid rgba(239, 68, 68, 0.2)',
        },
    }),
    loading: (message) => toast.loading(message, {
        position: 'top-right',
        style: {
            background: '#1f2020',
            color: '#e3e2e2',
        },
    }),
    dismiss: () => toast.dismiss(),
};
