import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUserProfile, updateCurrentUserProfile, type UserProfileData } from '../../../services/user.service';
import { useAuth } from '../../../contexts/Auth.context';

const emptyProfile: UserProfileData = {
    id: '',
    name: '',
    email: '',
    role: 'attendee',
    isActive: true,
    createdAt: '',
    updatedAt: '',
    profile: {
        avatarUrl: '',
        phone: '',
        organization: '',
        bio: '',
        companyName: '',
        companyDescription: '',
        website: '',
        linkedin: '',
        instagram: '',
        supportEmail: '',
    },
};

const ProfilePage = () => {
    const navigate = useNavigate();
    const { user, login } = useAuth();
    const [form, setForm] = useState<UserProfileData>(emptyProfile);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const loadProfile = async () => {
            try {
                setLoading(true);
                setError('');
                const response = await getCurrentUserProfile();
                if (response.success) {
                    setForm(response.data);
                }
            } catch (err: unknown) {
                setError((err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to load profile');
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, []);

    const isExhibitor = useMemo(() => form.role === 'exhibitor', [form.role]);

    const handleRootChange = (field: 'name' | 'email', value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        setSuccess('');
    };

    const handleProfileChange = (field: keyof UserProfileData['profile'], value: string) => {
        setForm((prev) => ({
            ...prev,
            profile: {
                ...prev.profile,
                [field]: value,
            },
        }));
        setSuccess('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSaving(true);
            setError('');
            setSuccess('');
            const response = await updateCurrentUserProfile({
                name: form.name,
                email: form.email,
                profile: form.profile,
            });

            if (response.success) {
                setForm(response.data);
                if (user) {
                    login(
                        {
                            ...user,
                            email: response.data.email,
                        },
                        localStorage.getItem('token') || ''
                    );
                }
                setSuccess(response.message || 'Profile updated successfully');
            }
        } catch (err: unknown) {
            setError((err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen py-24 px-6 bg-[#0a0a0f]">
            <div className="max-w-5xl mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-[#a0a0b0] hover:text-white transition mb-8"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                </button>

                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Profile Settings</h1>
                    <p className="text-[#a0a0b0] max-w-2xl">
                        Manage your account details, contact information, and your public exhibitor profile for expo attendees.
                    </p>
                </div>

                {loading && <p className="text-[#a0a0b0]">Loading profile...</p>}
                {!loading && error && <p className="text-[#f87171] mb-4">{error}</p>}

                {!loading && (
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
                            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 h-fit">
                                <div className="flex flex-col items-center text-center">
                                    {form.profile.avatarUrl ? (
                                        <img
                                            src={form.profile.avatarUrl}
                                            alt={form.name}
                                            className="w-24 h-24 rounded-full object-cover border border-white/10 mb-4"
                                        />
                                    ) : (
                                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#4c9aff] to-[#a78bfa] flex items-center justify-center text-3xl font-bold text-white mb-4">
                                            {(form.name || form.email || 'U').charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <h2 className="text-xl font-semibold text-white">{form.name || 'Your profile'}</h2>
                                    <p className="text-sm text-[#a0a0b0] mt-1">{form.email}</p>
                                    <span className="mt-3 text-xs px-3 py-1 rounded-full bg-[#4c9aff]/15 border border-[#4c9aff]/30 text-[#93c5fd] capitalize">
                                        {form.role}
                                    </span>
                                </div>
                            </div>

                            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-8">
                                <section className="space-y-4">
                                    <h3 className="text-lg font-semibold text-white">Account Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <label className="space-y-2 text-sm text-[#a0a0b0]">
                                            <span>Full Name</span>
                                            <input
                                                value={form.name}
                                                onChange={(e) => handleRootChange('name', e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl bg-[#050507] border border-white/10 text-white outline-none focus:border-[#4c9aff]"
                                                placeholder="Your full name"
                                            />
                                        </label>
                                        <label className="space-y-2 text-sm text-[#a0a0b0]">
                                            <span>Email Address</span>
                                            <input
                                                type="email"
                                                value={form.email}
                                                onChange={(e) => handleRootChange('email', e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl bg-[#050507] border border-white/10 text-white outline-none focus:border-[#4c9aff]"
                                                placeholder="you@example.com"
                                            />
                                        </label>
                                        <label className="space-y-2 text-sm text-[#a0a0b0] md:col-span-2">
                                            <span>Avatar URL</span>
                                            <input
                                                value={form.profile.avatarUrl}
                                                onChange={(e) => handleProfileChange('avatarUrl', e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl bg-[#050507] border border-white/10 text-white outline-none focus:border-[#4c9aff]"
                                                placeholder="https://example.com/avatar.jpg"
                                            />
                                        </label>
                                        <label className="space-y-2 text-sm text-[#a0a0b0]">
                                            <span>Phone</span>
                                            <input
                                                value={form.profile.phone}
                                                onChange={(e) => handleProfileChange('phone', e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl bg-[#050507] border border-white/10 text-white outline-none focus:border-[#4c9aff]"
                                                placeholder="+92 300 0000000"
                                            />
                                        </label>
                                        <label className="space-y-2 text-sm text-[#a0a0b0]">
                                            <span>Organization</span>
                                            <input
                                                value={form.profile.organization}
                                                onChange={(e) => handleProfileChange('organization', e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl bg-[#050507] border border-white/10 text-white outline-none focus:border-[#4c9aff]"
                                                placeholder="Your organization"
                                            />
                                        </label>
                                        <label className="space-y-2 text-sm text-[#a0a0b0] md:col-span-2">
                                            <span>Bio</span>
                                            <textarea
                                                rows={4}
                                                value={form.profile.bio}
                                                onChange={(e) => handleProfileChange('bio', e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl bg-[#050507] border border-white/10 text-white outline-none focus:border-[#4c9aff]"
                                                placeholder="Tell other participants about yourself"
                                            />
                                        </label>
                                    </div>
                                </section>

                                {isExhibitor && (
                                    <section className="space-y-4">
                                        <h3 className="text-lg font-semibold text-white">Public Exhibitor Profile</h3>
                                        <p className="text-sm text-[#a0a0b0]">
                                            These details can be reused for booth applications and attendee viewing.
                                        </p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <label className="space-y-2 text-sm text-[#a0a0b0] md:col-span-2">
                                                <span>Company Name</span>
                                                <input
                                                    value={form.profile.companyName}
                                                    onChange={(e) => handleProfileChange('companyName', e.target.value)}
                                                    className="w-full px-4 py-3 rounded-xl bg-[#050507] border border-white/10 text-white outline-none focus:border-[#4c9aff]"
                                                    placeholder="Your company name"
                                                />
                                            </label>
                                            <label className="space-y-2 text-sm text-[#a0a0b0] md:col-span-2">
                                                <span>Company Description</span>
                                                <textarea
                                                    rows={4}
                                                    value={form.profile.companyDescription}
                                                    onChange={(e) => handleProfileChange('companyDescription', e.target.value)}
                                                    className="w-full px-4 py-3 rounded-xl bg-[#050507] border border-white/10 text-white outline-none focus:border-[#4c9aff]"
                                                    placeholder="Describe what your company offers"
                                                />
                                            </label>
                                            <label className="space-y-2 text-sm text-[#a0a0b0]">
                                                <span>Website</span>
                                                <input
                                                    value={form.profile.website}
                                                    onChange={(e) => handleProfileChange('website', e.target.value)}
                                                    className="w-full px-4 py-3 rounded-xl bg-[#050507] border border-white/10 text-white outline-none focus:border-[#4c9aff]"
                                                    placeholder="https://yourcompany.com"
                                                />
                                            </label>
                                            <label className="space-y-2 text-sm text-[#a0a0b0]">
                                                <span>Support Email</span>
                                                <input
                                                    type="email"
                                                    value={form.profile.supportEmail}
                                                    onChange={(e) => handleProfileChange('supportEmail', e.target.value)}
                                                    className="w-full px-4 py-3 rounded-xl bg-[#050507] border border-white/10 text-white outline-none focus:border-[#4c9aff]"
                                                    placeholder="support@company.com"
                                                />
                                            </label>
                                            <label className="space-y-2 text-sm text-[#a0a0b0]">
                                                <span>LinkedIn</span>
                                                <input
                                                    value={form.profile.linkedin}
                                                    onChange={(e) => handleProfileChange('linkedin', e.target.value)}
                                                    className="w-full px-4 py-3 rounded-xl bg-[#050507] border border-white/10 text-white outline-none focus:border-[#4c9aff]"
                                                    placeholder="https://linkedin.com/company/..."
                                                />
                                            </label>
                                            <label className="space-y-2 text-sm text-[#a0a0b0]">
                                                <span>Instagram</span>
                                                <input
                                                    value={form.profile.instagram}
                                                    onChange={(e) => handleProfileChange('instagram', e.target.value)}
                                                    className="w-full px-4 py-3 rounded-xl bg-[#050507] border border-white/10 text-white outline-none focus:border-[#4c9aff]"
                                                    placeholder="https://instagram.com/..."
                                                />
                                            </label>
                                        </div>
                                    </section>
                                )}

                                {(error || success) && (
                                    <div className={`rounded-xl p-4 border ${error ? 'bg-[#f87171]/10 border-[#f87171]/30 text-[#fda4af]' : 'bg-[#36d399]/10 border-[#36d399]/30 text-[#86efac]'}`}>
                                        {error || success}
                                    </div>
                                )}

                                <div className="flex flex-wrap gap-3 justify-end">
                                    <button
                                        type="button"
                                        onClick={() => navigate('/support')}
                                        className="px-5 py-3 rounded-xl border border-white/10 text-white hover:bg-white/5 transition"
                                    >
                                        Support & feedback
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => navigate('/my-tickets')}
                                        className="px-5 py-3 rounded-xl border border-white/10 text-white hover:bg-white/5 transition"
                                    >
                                        View my registrations
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#4c9aff] to-[#a78bfa] text-white font-semibold hover:from-[#3b82f6] hover:to-[#9333ea] disabled:opacity-70 transition"
                                    >
                                        {saving ? 'Saving...' : 'Save changes'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;

