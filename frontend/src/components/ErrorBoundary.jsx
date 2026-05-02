import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        this.setState({ errorInfo });
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
        window.location.href = '/dashboard';
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="bg-[#121414] min-h-screen flex items-center justify-center p-8">
                    <div className="bg-[#1f2020] rounded-2xl p-8 border border-white/5 max-w-lg w-full text-center shadow-2xl">
                        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertTriangle className="w-8 h-8 text-red-400" />
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-3">Something went wrong</h1>
                        <p className="text-slate-400 mb-6">
                            An unexpected error occurred. Please try refreshing the page or return to the dashboard.
                        </p>
                        {this.state.error && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6 text-left">
                                <p className="text-xs text-red-400 font-mono break-all">
                                    {this.state.error.toString()}
                                </p>
                            </div>
                        )}
                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={() => window.location.reload()}
                                className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-all flex items-center gap-2"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Refresh Page
                            </button>
                            <button
                                onClick={this.handleReset}
                                className="px-6 py-2.5 bg-indigo-600 rounded-lg text-white hover:bg-indigo-500 transition-all"
                            >
                                Go to Dashboard
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
