import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyRegistrations, type BoothApplicationRegistration, type RegistrationSummary } from '../../../services/user.service';
import { useAuth } from '../../../contexts/Auth.context';
import { payBoothApplication, type PaymentSimulationPayload } from '../../../services/expo.service';
import PaymentSimulationModal from '../../../components/common/PaymentSimulationModal';

const emptySummary: RegistrationSummary = {
    attendedExpos: [],
    bookedBooths: [],
    boothApplications: [],
    bookmarkedSessions: [],
};

const formatDate = (value: string) =>
    new Date(value).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });

const formatCurrencyFromCents = (amount = 499) => `$${(amount / 100).toFixed(2)}`;

const getStatusClasses = (status: string) => {
    if (status === 'approved' || status === 'published') return 'bg-[#36d399]/15 border-[#36d399]/30 text-[#86efac]';
    if (status === 'pending' || status === 'draft') return 'bg-[#fbbf24]/15 border-[#fbbf24]/30 text-[#fcd34d]';
    if (status === 'rejected') return 'bg-[#f87171]/15 border-[#f87171]/30 text-[#fda4af]';
    return 'bg-white/5 border-white/10 text-[#d4d4d8]';
};

const ApplicationCard = ({
    application,
    onPay,
}: {
    application: BoothApplicationRegistration;
    onPay: (applicationId: string) => void;
}) => (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-3">
        <div className="flex items-start justify-between gap-4">
            <div>
                <h3 className="text-white font-semibold">{application.expoId?.title || 'Expo application'}</h3>
                <p className="text-sm text-[#a0a0b0]">
                    {application.boothId ? `Requested booth ${application.boothId.boothNumber} (R${application.boothId.row} C${application.boothId.col})` : 'Booth request details unavailable'}
                </p>
            </div>
            <span className={`text-xs px-3 py-1 rounded-full border capitalize ${getStatusClasses(application.status)}`}>
                {application.status}
            </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-[#a0a0b0]">
            <p>Submitted: {formatDate(application.submittedAt)}</p>
            {application.reviewedAt ? <p>Reviewed: {formatDate(application.reviewedAt)}</p> : <p>Awaiting review</p>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-[#a0a0b0]">
            <p>Payment: {application.paymentStatus || 'unpaid'}</p>
            {application.paidAt ? <p>Paid on: {formatDate(application.paidAt)}</p> : <p>Payment pending</p>}
        </div>
        <p className="text-sm text-[#a0a0b0]">Fee: {formatCurrencyFromCents(application.paymentAmount || 499)}</p>
        {application.status === 'pending' && application.paymentStatus !== 'paid' && (
            <button
                onClick={() => onPay(application._id)}
                className="px-4 py-2 rounded-xl bg-[#4c9aff]/15 border border-[#4c9aff]/30 text-[#93c5fd] hover:bg-[#4c9aff]/25 transition"
            >
                Complete payment
            </button>
        )}
        {application.rejectionReason && (
            <div className="rounded-xl border border-[#f87171]/20 bg-[#f87171]/10 p-3 text-sm text-[#fda4af]">
                Reason: {application.rejectionReason}
            </div>
        )}
    </div>
);

const MyTicketsPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [summary, setSummary] = useState<RegistrationSummary>(emptySummary);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [paymentApplicationId, setPaymentApplicationId] = useState<string | null>(null);

    const selectedApplication = useMemo(
        () => summary.boothApplications.find((app) => app._id === paymentApplicationId) || null,
        [summary.boothApplications, paymentApplicationId]
    );

    const loadRegistrations = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await getMyRegistrations();
            if (response.success) {
                setSummary(response.data);
            }
        } catch (err: unknown) {
            setError((err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to load your registrations');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRegistrations();
    }, []);

    const handleApplicationPayment = async (payment: PaymentSimulationPayload) => {
        if (!paymentApplicationId) return;
        await payBoothApplication(paymentApplicationId, payment);
        setPaymentApplicationId(null);
        await loadRegistrations();
    };

    const stats = useMemo(() => ({
        attended: summary.attendedExpos.length,
        booked: summary.bookedBooths.length,
        applications: summary.boothApplications.length,
        pendingApplications: summary.boothApplications.filter((item) => item.status === 'pending').length,
        savedSessions: summary.bookmarkedSessions.length,
    }), [summary]);

    return (
        <div className="min-h-screen py-24 px-6 bg-[#0a0a0f]">
            <div className="max-w-6xl mx-auto space-y-8">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-[#a0a0b0] hover:text-white transition"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                </button>

                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">My Tickets & Registrations</h1>
                    <p className="text-[#a0a0b0] max-w-3xl">
                        Track the expos you have joined, exhibitor booth reservations, and pending booth applications in one place.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
                    {[
                        { label: 'Attended expos', value: stats.attended },
                        { label: 'Booked booths', value: stats.booked },
                        { label: 'Applications', value: stats.applications },
                        { label: 'Pending review', value: stats.pendingApplications },
                        { label: 'Saved sessions', value: stats.savedSessions },
                    ].map((card) => (
                        <div key={card.label} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                            <p className="text-sm text-[#a0a0b0]">{card.label}</p>
                            <p className="text-3xl font-bold text-white mt-2">{card.value}</p>
                        </div>
                    ))}
                </div>

                {loading && <p className="text-[#a0a0b0]">Loading your registrations...</p>}
                {!loading && error && <p className="text-[#f87171]">{error}</p>}

                {!loading && !error && (
                    <div className="space-y-10">
                        <section className="space-y-4">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <h2 className="text-2xl font-semibold text-white">Expo attendance</h2>
                                    <p className="text-sm text-[#a0a0b0]">Events you have already registered for or attended.</p>
                                </div>
                                <div className="flex gap-3 flex-wrap">
                                    <button
                                        onClick={() => navigate('/support')}
                                        className="px-4 py-2 rounded-xl border border-white/10 text-white hover:bg-white/5 transition"
                                    >
                                        Need help?
                                    </button>
                                    <button
                                        onClick={() => navigate('/expos')}
                                        className="px-4 py-2 rounded-xl border border-white/10 text-white hover:bg-white/5 transition"
                                    >
                                        Browse expos
                                    </button>
                                </div>
                            </div>

                            {summary.attendedExpos.length === 0 ? (
                                <div className="rounded-2xl border border-dashed border-white/10 bg-white/3 p-6 text-[#a0a0b0]">
                                    You have not registered for an expo yet.
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {summary.attendedExpos.map((entry) => (
                                        <div key={`${entry.expoId._id}-${entry.visitedAt}`} className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-3">
                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    <h3 className="text-white font-semibold">{entry.expoId.title}</h3>
                                                    <p className="text-sm text-[#a0a0b0]">{entry.expoId.location}</p>
                                                </div>
                                                <span className={`text-xs px-3 py-1 rounded-full border capitalize ${getStatusClasses(entry.expoId.status)}`}>
                                                    {entry.expoId.status}
                                                </span>
                                            </div>
                                            <p className="text-sm text-[#a0a0b0]">
                                                {formatDate(entry.expoId.startDate)} - {formatDate(entry.expoId.endDate)}
                                            </p>
                                            <p className="text-sm text-[#d4d4d8]">Attendance recorded on {formatDate(entry.visitedAt)}</p>
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => navigate(`/expo/${entry.expoId._id}/floor`)}
                                                    className="px-4 py-2 rounded-xl bg-[#4c9aff]/15 border border-[#4c9aff]/30 text-[#93c5fd] hover:bg-[#4c9aff]/25 transition"
                                                >
                                                    View floor
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>

                        <section className="space-y-4">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <h2 className="text-2xl font-semibold text-white">Saved sessions</h2>
                                    <p className="text-sm text-[#a0a0b0]">Your bookmarked schedule items and reminders.</p>
                                </div>
                            </div>

                            {summary.bookmarkedSessions.length === 0 ? (
                                <div className="rounded-2xl border border-dashed border-white/10 bg-white/3 p-6 text-[#a0a0b0]">
                                    You have not bookmarked any sessions yet.
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    {summary.bookmarkedSessions.map((entry) => (
                                        <div key={`${entry.expoId._id}-${entry.session._id}`} className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-3">
                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    <h3 className="text-white font-semibold">{entry.session.title}</h3>
                                                    <p className="text-sm text-[#a0a0b0]">{entry.expoId.title}</p>
                                                </div>
                                                <span className="text-xs px-3 py-1 rounded-full border bg-[#36d399]/15 border-[#36d399]/30 text-[#86efac]">
                                                    Bookmarked
                                                </span>
                                            </div>
                                            <p className="text-sm text-[#d4d4d8]">
                                                {entry.session.speaker ? `${entry.session.speaker} • ` : ''}
                                                {entry.session.topic || 'Session'}
                                            </p>
                                            <p className="text-sm text-[#a0a0b0]">
                                                {formatDate(entry.session.startTime)} • {entry.session.location || 'Location TBD'}
                                            </p>
                                            <div className="flex gap-3 flex-wrap">
                                                <button
                                                    onClick={() => navigate(`/expo/${entry.expoId._id}/floor`)}
                                                    className="px-4 py-2 rounded-xl bg-[#4c9aff]/15 border border-[#4c9aff]/30 text-[#93c5fd] hover:bg-[#4c9aff]/25 transition"
                                                >
                                                    Open expo schedule
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>

                        {user?.role === 'exhibitor' && (
                            <>
                                <section className="space-y-4">
                                    <div>
                                        <h2 className="text-2xl font-semibold text-white">Booked booths</h2>
                                        <p className="text-sm text-[#a0a0b0]">Approved exhibitor placements for your account.</p>
                                    </div>

                                    {summary.bookedBooths.length === 0 ? (
                                        <div className="rounded-2xl border border-dashed border-white/10 bg-white/3 p-6 text-[#a0a0b0]">
                                            You have no booked booths yet.
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {summary.bookedBooths.map((entry) => (
                                                <div key={`${entry.expoId._id}-${entry.boothId._id}`} className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-3">
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div>
                                                            <h3 className="text-white font-semibold">{entry.expoId.title}</h3>
                                                            <p className="text-sm text-[#a0a0b0]">{entry.expoId.location}</p>
                                                        </div>
                                                        <span className="text-xs px-3 py-1 rounded-full border bg-[#36d399]/15 border-[#36d399]/30 text-[#86efac]">
                                                            Booth {entry.boothId.boothNumber}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-[#d4d4d8]">
                                                        Grid position: Row {entry.boothId.row}, Column {entry.boothId.col}
                                                    </p>
                                                    <p className="text-sm text-[#a0a0b0]">Booked on {formatDate(entry.bookedAt)}</p>
                                                    <button
                                                        onClick={() => navigate(`/expo/${entry.expoId._id}/floor`)}
                                                        className="px-4 py-2 rounded-xl bg-[#4c9aff]/15 border border-[#4c9aff]/30 text-[#93c5fd] hover:bg-[#4c9aff]/25 transition"
                                                    >
                                                        Open floor plan
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </section>

                                <section className="space-y-4">
                                    <div>
                                        <h2 className="text-2xl font-semibold text-white">Booth applications</h2>
                                        <p className="text-sm text-[#a0a0b0]">Track pending, approved, or rejected booth requests.</p>
                                    </div>

                                    {summary.boothApplications.length === 0 ? (
                                        <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] p-6 text-[#a0a0b0]">
                                            You have not submitted any booth applications yet.
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                            {summary.boothApplications.map((application) => (
                                                <ApplicationCard key={application._id} application={application} onPay={setPaymentApplicationId} />
                                            ))}
                                        </div>
                                    )}
                                </section>
                            </>
                        )}
                    </div>
                )}
            </div>
            {paymentApplicationId && (
                <PaymentSimulationModal
                    title="Complete booth payment"
                    subtitle={`Fee: ${formatCurrencyFromCents(selectedApplication?.paymentAmount || 499)}`}
                    ctaLabel="Pay and allot booth"
                    onClose={() => setPaymentApplicationId(null)}
                    onConfirm={handleApplicationPayment}
                />
            )}
        </div>
    );
};

export default MyTicketsPage;

