import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/Auth.context';
import {
    getMyNotifications,
    markAllNotificationsAsRead,
    markNotificationAsRead,
    type NotificationItem,
} from '../../../services/notification.service';

const formatDateTime = (value: string) =>
    new Date(value).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    });

const NotificationsPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [items, setItems] = useState<NotificationItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [workingId, setWorkingId] = useState<string | null>(null);

    const unreadCount = useMemo(() => items.filter((item) => !item.isRead).length, [items]);

    const load = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await getMyNotifications({ page: 1, limit: 50 });
            if (response.success) {
                setItems(response.data);
            }
        } catch (err: unknown) {
            setError((err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to load notifications');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const handleMarkOne = async (id: string) => {
        try {
            setWorkingId(id);
            await markNotificationAsRead(id);
            setItems((prev) => prev.map((item) => (item._id === id ? { ...item, isRead: true, readAt: new Date().toISOString() } : item)));
        } finally {
            setWorkingId(null);
        }
    };

    const handleMarkAll = async () => {
        try {
            setWorkingId('all');
            await markAllNotificationsAsRead();
            setItems((prev) => prev.map((item) => ({ ...item, isRead: true, readAt: item.readAt || new Date().toISOString() })));
        } finally {
            setWorkingId(null);
        }
    };

    const openNotificationTarget = (item: NotificationItem) => {
        if (item.metadata?.supportRequestId) {
            if (user?.role === 'admin') {
                navigate('/admin/dashboard');
                return;
            }
            navigate('/support');
            return;
        }

        if (item.metadata?.expoId) {
            if (user?.role === 'admin') {
                navigate('/admin/dashboard');
                return;
            }
            navigate(`/expo/${item.metadata.expoId}/floor`);
            return;
        }

        navigate('/notifications');
    };

    return (
        <div className="min-h-screen py-24 px-6 bg-[#0a0a0f]">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white">Notifications</h1>
                        <p className="text-[#a0a0b0] mt-2">Payment approvals, booth allotments, expo reminders, and ticket updates.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate('/')}
                            className="px-4 py-2 rounded-lg border border-white/20 text-white hover:bg-white/10 transition"
                        >
                            Back
                        </button>
                        <button
                            onClick={handleMarkAll}
                            disabled={unreadCount === 0 || workingId === 'all'}
                            className="px-4 py-2 rounded-lg bg-[#4c9aff] hover:bg-[#3b82f6] disabled:bg-[#4c9aff]/60 text-white transition"
                        >
                            {workingId === 'all' ? 'Updating...' : `Mark all read (${unreadCount})`}
                        </button>
                    </div>
                </div>

                {loading && <p className="text-[#a0a0b0]">Loading notifications...</p>}
                {error && <p className="text-[#f87171]">{error}</p>}

                {!loading && !error && items.length === 0 && (
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-[#a0a0b0]">
                        No notifications yet.
                    </div>
                )}

                <div className="space-y-3">
                    {items.map((item) => (
                        <div
                            key={item._id}
                            className={`rounded-2xl border p-5 ${item.isRead ? 'border-white/10 bg-white/5' : 'border-[#4c9aff]/40 bg-[#4c9aff]/10'}`}
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h3 className="text-white font-semibold">{item.title}</h3>
                                    <p className="text-sm text-[#a0a0b0] mt-1">{item.message}</p>
                                    <p className="text-xs text-[#707085] mt-2">{formatDateTime(item.createdAt)}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => openNotificationTarget(item)}
                                        className="px-3 py-1 rounded-lg text-xs border border-white/20 text-white hover:bg-white/10 transition"
                                    >
                                        Open
                                    </button>
                                    {!item.isRead && (
                                        <button
                                            onClick={() => handleMarkOne(item._id)}
                                            disabled={workingId === item._id}
                                            className="px-3 py-1 rounded-lg text-xs bg-[#4c9aff] hover:bg-[#3b82f6] text-white transition"
                                        >
                                            {workingId === item._id ? '...' : 'Mark read'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default NotificationsPage;

