const User = require('../models/user.model');
const BoothApplication = require('../models/boothApplication.model');
const Expo = require('../models/expo.model');

const getProfileResponse = (user) => ({
	id: user._id,
	name: user.name,
	email: user.email,
	role: user.role,
	isActive: user.isActive,
	createdAt: user.createdAt,
	updatedAt: user.updatedAt,
	profile: {
		avatarUrl: user.profile?.avatarUrl || '',
		phone: user.profile?.phone || '',
		organization: user.profile?.organization || '',
		bio: user.profile?.bio || '',
		companyName: user.profile?.companyName || '',
		companyDescription: user.profile?.companyDescription || '',
		website: user.profile?.website || '',
		linkedin: user.profile?.linkedin || '',
		instagram: user.profile?.instagram || '',
		supportEmail: user.profile?.supportEmail || '',
	},
});

const getResolvedBookmarkedSessions = async (bookmarkedSessions, expoIdFilter) => {
	const filteredBookmarks = expoIdFilter
		? bookmarkedSessions.filter((entry) => entry.expoId.toString() === expoIdFilter.toString())
		: bookmarkedSessions;

	if (filteredBookmarks.length === 0) {
		return [];
	}

	const expoIds = [...new Set(filteredBookmarks.map((entry) => entry.expoId.toString()))];
	const expos = await Expo.find({ _id: { $in: expoIds } }).select('title theme location startDate endDate status sessions');
	const expoMap = new Map(expos.map((expo) => [expo._id.toString(), expo]));

	return filteredBookmarks
		.map((entry) => {
			const expo = expoMap.get(entry.expoId.toString());
			if (!expo) return null;

			const session = expo.sessions.find((item) => item._id.toString() === entry.sessionId.toString());
			if (!session) return null;

			return {
				expoId: {
					_id: expo._id,
					title: expo.title,
					theme: expo.theme,
					location: expo.location,
					startDate: expo.startDate,
					endDate: expo.endDate,
					status: expo.status,
				},
				session: {
					_id: session._id,
					title: session.title,
					speaker: session.speaker,
					topic: session.topic,
					location: session.location,
					description: session.description,
					startTime: session.startTime,
					endTime: session.endTime,
					capacity: session.capacity,
				},
				bookmarkedAt: entry.bookmarkedAt,
			};
		})
		.filter(Boolean)
		.sort((a, b) => new Date(a.session.startTime) - new Date(b.session.startTime));
};

exports.getCurrentUser = async (req, res) => {
	try {
		const user = await User.findById(req.user._id);
		if (!user) {
			return res.status(404).json({ success: false, message: 'User not found' });
		}

		res.status(200).json({
			success: true,
			data: getProfileResponse(user),
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

exports.updateCurrentUser = async (req, res) => {
	try {
		const allowedProfileFields = [
			'avatarUrl',
			'phone',
			'organization',
			'bio',
			'companyName',
			'companyDescription',
			'website',
			'linkedin',
			'instagram',
			'supportEmail',
		];

		const user = await User.findById(req.user._id);
		if (!user) {
			return res.status(404).json({ success: false, message: 'User not found' });
		}

		const { name, email, profile = {} } = req.body;

		if (typeof name === 'string' && name.trim()) {
			user.name = name.trim();
		}

		if (typeof email === 'string' && email.trim() && email.trim().toLowerCase() !== user.email) {
			const normalizedEmail = email.trim().toLowerCase();
			const existingUser = await User.findOne({ email: normalizedEmail, _id: { $ne: user._id } });
			if (existingUser) {
				return res.status(400).json({ success: false, message: 'Another account already uses this email address' });
			}
			user.email = normalizedEmail;
		}

		user.profile = user.profile || {};
		allowedProfileFields.forEach((field) => {
			if (Object.prototype.hasOwnProperty.call(profile, field)) {
				user.profile[field] = typeof profile[field] === 'string' ? profile[field].trim() : '';
			}
		});

		if (!user.profile.supportEmail) {
			user.profile.supportEmail = user.email;
		}

		await user.save();

		res.status(200).json({
			success: true,
			message: 'Profile updated successfully',
			data: getProfileResponse(user),
		});
	} catch (error) {
		res.status(400).json({ success: false, message: error.message });
	}
};

exports.getMyRegistrations = async (req, res) => {
	try {
		const user = await User.findById(req.user._id)
			.populate({
				path: 'attendedExpos.expoId',
				select: 'title theme location startDate endDate status',
			})
			.populate({
				path: 'bookedBooths.expoId',
				select: 'title theme location startDate endDate status',
			})
			.populate({
				path: 'bookedBooths.boothId',
				select: 'boothNumber row col status',
			});

		if (!user) {
			return res.status(404).json({ success: false, message: 'User not found' });
		}

		const boothApplications = await BoothApplication.find({ exhibitorId: user._id })
			.populate('expoId', 'title theme location startDate endDate status')
			.populate('boothId', 'boothNumber row col')
			.sort({ submittedAt: -1 });

		const attendedExpos = user.attendedExpos
			.filter((entry) => entry.expoId)
			.sort((a, b) => new Date(b.visitedAt) - new Date(a.visitedAt));

		const bookedBooths = user.bookedBooths
			.filter((entry) => entry.expoId && entry.boothId)
			.sort((a, b) => new Date(b.bookedAt) - new Date(a.bookedAt));

		const bookmarkedSessions = await getResolvedBookmarkedSessions(user.bookmarkedSessions || []);

		res.status(200).json({
			success: true,
			data: {
				attendedExpos,
				bookedBooths,
				boothApplications,
				bookmarkedSessions,
			},
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

exports.getSessionBookmarks = async (req, res) => {
	try {
		const user = await User.findById(req.user._id).select('bookmarkedSessions');
		if (!user) {
			return res.status(404).json({ success: false, message: 'User not found' });
		}

		const bookmarks = await getResolvedBookmarkedSessions(user.bookmarkedSessions || [], req.query.expoId);
		res.status(200).json({ success: true, data: bookmarks });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

exports.addSessionBookmark = async (req, res) => {
	try {
		const { expoId, sessionId } = req.body;
		if (!expoId || !sessionId) {
			return res.status(400).json({ success: false, message: 'expoId and sessionId are required' });
		}

		const expo = await Expo.findById(expoId).select('sessions');
		if (!expo) {
			return res.status(404).json({ success: false, message: 'Expo not found' });
		}

		const sessionExists = expo.sessions.some((session) => session._id.toString() === sessionId.toString());
		if (!sessionExists) {
			return res.status(404).json({ success: false, message: 'Session not found for this expo' });
		}

		const user = await User.findById(req.user._id);
		if (!user) {
			return res.status(404).json({ success: false, message: 'User not found' });
		}

		const alreadyBookmarked = (user.bookmarkedSessions || []).some(
			(entry) => entry.expoId.toString() === expoId.toString() && entry.sessionId.toString() === sessionId.toString()
		);

		if (!alreadyBookmarked) {
			user.bookmarkedSessions.push({ expoId, sessionId });
			await user.save();
		}

		res.status(200).json({ success: true, message: 'Session bookmarked successfully' });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

exports.removeSessionBookmark = async (req, res) => {
	try {
		const { sessionId } = req.params;
		const { expoId } = req.query;

		const user = await User.findById(req.user._id);
		if (!user) {
			return res.status(404).json({ success: false, message: 'User not found' });
		}

		user.bookmarkedSessions = (user.bookmarkedSessions || []).filter((entry) => {
			const isSameSession = entry.sessionId.toString() === sessionId.toString();
			const isSameExpo = expoId ? entry.expoId.toString() === expoId.toString() : true;
			return !(isSameSession && isSameExpo);
		});

		await user.save();

		res.status(200).json({ success: true, message: 'Session bookmark removed' });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

