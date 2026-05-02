import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import TopNavBar from '../components/TopNavBar';
import { User, Mail, Phone, Building2, Calendar, Shield, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { API_URL } from '../config';
import { useDispatch } from 'react-redux';
import { updateProfile } from '../store/slices/authSlice';

const Profile = () => {
    const dispatch = useDispatch();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        organization: ''
    });
    const [saveLoading, setSaveLoading] = useState(false);
    const [message, setMessage] = useState(null);

    // Fetch user profile
    const fetchProfile = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/users/profile`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const result = await response.json();
                const userData = result.data || result;
                setUser(userData);
                setFormData({
                    fullName: userData.fullName || '',
                    email: userData.email || '',
                    phone: userData.phone || '',
                    organization: userData.organization || ''
                });
            }
        } catch (error) {
            console.error('Fetch profile error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    // Handle form input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Save profile changes
    const handleSave = async () => {
        setSaveLoading(true);
        setMessage(null);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/users/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (response.ok) {
                dispatch(updateProfile(formData));
                setMessage({ type: 'success', text: 'Profile updated successfully!' });
                setEditing(false);
                setTimeout(() => setMessage(null), 3000);
            } else {
                setMessage({ type: 'error', text: result.message || 'Failed to update profile' });
            }
        } catch (error) {
            console.error('Save profile error:', error);
            setMessage({ type: 'error', text: 'Something went wrong' });
        } finally {
            setSaveLoading(false);
        }
    };

    // Format date
    const formatDate = (date) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Get initials from name
    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    };

    if (loading) {
        return (
            <div className="bg-[#121414] text-[#e3e2e2] font-['Work_Sans'] antialiased min-h-screen flex">
                <Sidebar />
                <div className="flex-1 flex flex-col min-w-0 md:pl-64">
                    <TopNavBar />
                    <div className="flex justify-center items-center h-96">
                        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#121414] text-[#e3e2e2] font-['Work_Sans'] antialiased min-h-screen flex">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 md:pl-64">
                <TopNavBar />
                <main className="p-6 md:p-10 max-w-[1200px] mx-auto w-full">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold font-manrope text-white tracking-tight">Profile</h1>
                        <p className="text-slate-400 mt-2">Manage your account information and preferences</p>
                    </div>

                    {/* Message Alert */}
                    {message && (
                        <div className={`mb-6 p-4 rounded-xl ${message.type === 'success' ? 'bg-green-500/10 border border-green-500/20 text-green-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'}`}>
                            {message.text}
                        </div>
                    )}

                    {/* Profile Card */}
                    <div className="bg-[#1f2020] rounded-2xl border border-white/10 overflow-hidden">
                        {/* Cover/Avatar Section */}
                        <div className="relative h-32 bg-gradient-to-r from-indigo-600/20 to-purple-600/20"></div>
                        <div className="relative px-8 pb-8">
                            <div className="flex items-end -mt-12 mb-6">
                                <div className="w-24 h-24 rounded-2xl bg-indigo-600 flex items-center justify-center border-4 border-[#1f2020] shadow-xl">
                                    {user?.avatar ? (
                                        <img src={user.avatar} alt={user?.fullName} className="w-full h-full rounded-2xl object-cover" />
                                    ) : (
                                        <span className="text-3xl font-bold text-white">{getInitials(user?.fullName)}</span>
                                    )}
                                </div>
                                <div className="ml-6 mb-2">
                                    <h2 className="text-2xl font-bold text-white">{user?.fullName}</h2>
                                    <p className="text-slate-400">Member since {formatDate(user?.createdAt)}</p>
                                </div>
                            </div>

                            {/* Profile Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-slate-300">
                                        <User className="w-5 h-5 text-indigo-400" />
                                        <div>
                                            <p className="text-xs text-slate-500">Full Name</p>
                                            {editing ? (
                                                <input
                                                    type="text"
                                                    name="fullName"
                                                    value={formData.fullName}
                                                    onChange={handleChange}
                                                    className="bg-[#292a2a] rounded-lg px-3 py-1.5 border border-white/10 focus:border-indigo-500 outline-none text-white w-full"
                                                />
                                            ) : (
                                                <p className="font-medium">{user?.fullName || 'Not set'}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 text-slate-300">
                                        <Mail className="w-5 h-5 text-indigo-400" />
                                        <div>
                                            <p className="text-xs text-slate-500">Email Address</p>
                                            {editing ? (
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    className="bg-[#292a2a] rounded-lg px-3 py-1.5 border border-white/10 focus:border-indigo-500 outline-none text-white w-full"
                                                />
                                            ) : (
                                                <p className="font-medium">{user?.email}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-slate-300">
                                        <Phone className="w-5 h-5 text-indigo-400" />
                                        <div>
                                            <p className="text-xs text-slate-500">Phone Number</p>
                                            {editing ? (
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    placeholder="+1 234 567 8900"
                                                    className="bg-[#292a2a] rounded-lg px-3 py-1.5 border border-white/10 focus:border-indigo-500 outline-none text-white w-full"
                                                />
                                            ) : (
                                                <p className="font-medium">{user?.phone || 'Not set'}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 text-slate-300">
                                        <Building2 className="w-5 h-5 text-indigo-400" />
                                        <div>
                                            <p className="text-xs text-slate-500">Organization</p>
                                            {editing ? (
                                                <input
                                                    type="text"
                                                    name="organization"
                                                    value={formData.organization}
                                                    onChange={handleChange}
                                                    placeholder="Company name"
                                                    className="bg-[#292a2a] rounded-lg px-3 py-1.5 border border-white/10 focus:border-indigo-500 outline-none text-white w-full"
                                                />
                                            ) : (
                                                <p className="font-medium">{user?.organization || 'Not set'}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-8 flex gap-4">
                                {editing ? (
                                    <>
                                        <button
                                            onClick={handleSave}
                                            disabled={saveLoading}
                                            className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-500 transition-all flex items-center gap-2"
                                        >
                                            {saveLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                                            Save Changes
                                        </button>
                                        <button
                                            onClick={() => {
                                                setEditing(false);
                                                setFormData({
                                                    fullName: user?.fullName || '',
                                                    email: user?.email || '',
                                                    phone: user?.phone || '',
                                                    organization: user?.organization || ''
                                                });
                                            }}
                                            className="px-6 py-2.5 border border-white/10 rounded-xl font-medium hover:bg-white/5 transition-all"
                                        >
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => setEditing(true)}
                                        className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-500 transition-all"
                                    >
                                        Edit Profile
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Security Section */}
                    <div className="mt-8 bg-[#1f2020] rounded-2xl border border-white/10 p-8">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Shield className="w-5 h-5 text-indigo-400" />
                            Security
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between py-3 border-b border-white/5">
                                <div>
                                    <p className="font-medium text-white">Password</p>
                                    <p className="text-sm text-slate-500">Last changed {formatDate(user?.updatedAt)}</p>
                                </div>
                                <button className="text-indigo-400 hover:text-indigo-300 text-sm font-medium">
                                    Change Password
                                </button>
                            </div>
                            <div className="flex items-center justify-between py-3">
                                <div>
                                    <p className="font-medium text-white">Two-Factor Authentication</p>
                                    <p className="text-sm text-slate-500">Add an extra layer of security</p>
                                </div>
                                <button className="text-indigo-400 hover:text-indigo-300 text-sm font-medium">
                                    Enable
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Profile;
