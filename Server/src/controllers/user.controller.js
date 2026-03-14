const User = require('../models/user.model');
const BoothApplication = require('../models/boothApplication.model');

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

		res.status(200).json({
			success: true,
			data: {
				attendedExpos,
				bookedBooths,
				boothApplications,
			},
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

