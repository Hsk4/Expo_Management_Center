import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyRegistrations, getMySupportRequests, submitSupportRequest, type RegistrationSummary, type SupportRequestItem } from '../../../services/user.service';

// @ts-ignore
const emptySummary: RegistrationSummary = {
	attendedExpos: [],
	bookedBooths: [],
	boothApplications: [],
	bookmarkedSessions: [],
};

const SupportPage = () => {
	const navigate = useNavigate();
	const [summary, setSummary] = useState<RegistrationSummary>(emptySummary);
	const [requests, setRequests] = useState<SupportRequestItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const [form, setForm] = useState({
		type: 'support' as 'support' | 'feedback',
		expoId: '',
		subject: '',
		message: '',
	});

	useEffect(() => {
		const load = async () => {
			try {
				setLoading(true);
				setError('');
				const [registrationsResponse, requestsResponse] = await Promise.all([
					getMyRegistrations(),
					getMySupportRequests(),
				]);

				if (registrationsResponse.success) setSummary(registrationsResponse.data);
				if (requestsResponse.success) setRequests(requestsResponse.data);
			} catch (err: unknown) {
				setError((err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to load support center');
			} finally {
				setLoading(false);
			}
		};

		load();
	}, []);

	const expoOptions = useMemo(() => {
		const expoMap = new Map<string, { _id: string; title: string; location: string }>();

		summary.attendedExpos.forEach((entry) => expoMap.set(entry.expoId._id, {
			_id: entry.expoId._id,
			title: entry.expoId.title,
			location: entry.expoId.location,
		}));
		summary.bookedBooths.forEach((entry) => expoMap.set(entry.expoId._id, {
			_id: entry.expoId._id,
			title: entry.expoId.title,
			location: entry.expoId.location,
		}));
		summary.boothApplications.forEach((entry) => {
			if (entry.expoId?._id) {
				expoMap.set(entry.expoId._id, {
					_id: entry.expoId._id,
					title: entry.expoId.title,
					location: entry.expoId.location,
				});
			}
		});
		summary.bookmarkedSessions.forEach((entry) => expoMap.set(entry.expoId._id, {
			_id: entry.expoId._id,
			title: entry.expoId.title,
			location: entry.expoId.location,
		}));

		return Array.from(expoMap.values());
	}, [summary]);

	const formatDate = (value: string) => new Date(value).toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
	});

	const statusClass = (status: SupportRequestItem['status']) => {
		if (status === 'resolved') return 'bg-[#36d399]/15 border-[#36d399]/30 text-[#86efac]';
		if (status === 'in-review') return 'bg-[#4c9aff]/15 border-[#4c9aff]/30 text-[#93c5fd]';
		return 'bg-[#fbbf24]/15 border-[#fbbf24]/30 text-[#fcd34d]';
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			setSubmitting(true);
			setError('');
			setSuccess('');
			const response = await submitSupportRequest({
				type: form.type,
				subject: form.subject,
				message: form.message,
				expoId: form.expoId || undefined,
			});

			if (response.success) {
				setRequests((prev) => [response.data, ...prev]);
				setSuccess(response.message || 'Request submitted successfully');
				setForm({ type: 'support', expoId: '', subject: '', message: '' });
			}
		} catch (err: unknown) {
			setError((err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to submit request');
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div className="min-h-screen py-24 px-6 bg-[#0a0a0f]">
			<div className="max-w-6xl mx-auto space-y-8">
				<button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[#a0a0b0] hover:text-white transition">
					<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
					</svg>
					Back
				</button>

				<div>
					<h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Support & Feedback</h1>
					<p className="text-[#a0a0b0] max-w-3xl">
						Report issues, ask for help, or share product feedback related to your expo experience.
					</p>
				</div>

				{loading && <p className="text-[#a0a0b0]">Loading support center...</p>}
				{!loading && (
					<div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-6">
						<section className="rounded-2xl border border-white/10 bg-white/5 p-6">
							<h2 className="text-2xl font-semibold text-white mb-2">Create a request</h2>
							<p className="text-sm text-[#a0a0b0] mb-6">Choose whether you need assistance or want to share feedback with the team.</p>

							<form onSubmit={handleSubmit} className="space-y-4">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<label className="space-y-2 text-sm text-[#a0a0b0]">
										<span>Request type</span>
										<select
											value={form.type}
											onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value as 'support' | 'feedback' }))}
											className="w-full px-4 py-3 rounded-xl bg-[#050507] border border-white/10 text-white outline-none focus:border-[#4c9aff]"
										>
											<option value="support">Support request</option>
											<option value="feedback">Product feedback</option>
										</select>
									</label>

									<label className="space-y-2 text-sm text-[#a0a0b0]">
										<span>Related expo</span>
										<select
											value={form.expoId}
											onChange={(e) => setForm((prev) => ({ ...prev, expoId: e.target.value }))}
											className="w-full px-4 py-3 rounded-xl bg-[#050507] border border-white/10 text-white outline-none focus:border-[#4c9aff]"
										>
											<option value="">General / not expo-specific</option>
											{expoOptions.map((expo) => (
												<option key={expo._id} value={expo._id}>
													{expo.title} — {expo.location}
												</option>
											))}
										</select>
									</label>
								</div>

								<label className="space-y-2 text-sm text-[#a0a0b0] block">
									<span>Subject</span>
									<input
										value={form.subject}
										onChange={(e) => setForm((prev) => ({ ...prev, subject: e.target.value }))}
										className="w-full px-4 py-3 rounded-xl bg-[#050507] border border-white/10 text-white outline-none focus:border-[#4c9aff]"
										placeholder="Short summary of your request"
									/>
								</label>

								<label className="space-y-2 text-sm text-[#a0a0b0] block">
									<span>Message</span>
									<textarea
										rows={6}
										value={form.message}
										onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
										className="w-full px-4 py-3 rounded-xl bg-[#050507] border border-white/10 text-white outline-none focus:border-[#4c9aff]"
										placeholder="Describe the issue, suggestion, or help you need"
									/>
								</label>

								{(error || success) && (
									<div className={`rounded-xl p-4 border ${error ? 'bg-[#f87171]/10 border-[#f87171]/30 text-[#fda4af]' : 'bg-[#36d399]/10 border-[#36d399]/30 text-[#86efac]'}`}>
										{error || success}
									</div>
								)}

								<div className="flex gap-3 flex-wrap justify-end">
									<button type="button" onClick={() => navigate('/my-tickets')} className="px-5 py-3 rounded-xl border border-white/10 text-white hover:bg-white/5 transition">
										View registrations
									</button>
									<button type="submit" disabled={submitting} className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#4c9aff] to-[#a78bfa] text-white font-semibold hover:from-[#3b82f6] hover:to-[#9333ea] disabled:opacity-70 transition">
										{submitting ? 'Submitting...' : 'Submit request'}
									</button>
								</div>
							</form>
						</section>

						<section className="rounded-2xl border border-white/10 bg-white/5 p-6">
							<h2 className="text-2xl font-semibold text-white mb-2">Recent requests</h2>
							<p className="text-sm text-[#a0a0b0] mb-6">Track what you have already submitted.</p>

							<div className="space-y-4 max-h-[760px] overflow-y-auto pr-1">
								{requests.length === 0 ? (
									<div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-5 text-[#a0a0b0]">
										No support or feedback submissions yet.
									</div>
								) : (
									requests.map((request) => (
										<div key={request._id} className="rounded-2xl border border-white/10 bg-[#050507] p-5 space-y-3">
											<div className="flex items-start justify-between gap-4">
												<div>
													<h3 className="text-white font-semibold">{request.subject}</h3>
													<p className="text-sm text-[#a0a0b0] mt-1 capitalize">{request.type}</p>
												</div>
												<span className={`text-xs px-3 py-1 rounded-full border capitalize ${statusClass(request.status)}`}>
													{request.status}
												</span>
											</div>
											{request.expoId && <p className="text-sm text-[#93c5fd]">Expo: {request.expoId.title}</p>}
											<p className="text-sm text-[#d4d4d8] leading-6">{request.message}</p>
											<p className="text-xs text-[#707085]">Submitted on {formatDate(request.createdAt)}</p>
										</div>
									))
								)}
							</div>
						</section>
					</div>
				)}
			</div>
		</div>
	);
};

export default SupportPage;

