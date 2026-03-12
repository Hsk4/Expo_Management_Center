import { useState } from "react"
import { motion } from "framer-motion"
import type { BoothData, BoothCompanyProfileInput } from "../../services/expo.service"
import { submitBoothApplication } from "../../services/expo.service"

interface BoothApplicationModalProps {
    booth: BoothData
    expoId: string
    onClose: () => void
    onSuccess: () => void
}

interface ApplicationQuestion {
    id: string
    question: string
    options: string[]
    required: boolean
}

const APPLICATION_QUESTIONS: ApplicationQuestion[] = [
    {
        id: "company_size",
        question: "What is the size of your company?",
        options: ["1-10 employees", "11-50 employees", "51-200 employees", "201-500 employees", "500+ employees"],
        required: true
    },
    {
        id: "industry",
        question: "Which industry does your company belong to?",
        options: ["Technology", "Manufacturing", "Retail", "Healthcare", "Finance", "Education", "Other"],
        required: true
    },
    {
        id: "booth_purpose",
        question: "What is your primary purpose for booking this booth?",
        options: ["Product Launch", "Brand Awareness", "Networking", "Lead Generation", "Recruitment", "Other"],
        required: true
    },
    {
        id: "previous_experience",
        question: "Have you exhibited at trade shows before?",
        options: ["Yes, multiple times", "Yes, once or twice", "No, this is my first time"],
        required: true
    },
    {
        id: "expected_visitors",
        question: "How many visitors do you expect at your booth?",
        options: ["Less than 50", "50-100", "100-200", "200-500", "500+"],
        required: false
    }
]

const BoothApplicationModal = ({ booth, expoId, onClose, onSuccess }: BoothApplicationModalProps) => {
    const [answers, setAnswers] = useState<Record<string, string>>({})
    const [companyProfile, setCompanyProfile] = useState<BoothCompanyProfileInput>({
        companyName: "",
        bannerImage: "",
        website: "",
        linkedin: "",
        instagram: "",
        description: "",
    })
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState("")

    const handleAnswerChange = (questionId: string, answer: string) => {
        setAnswers(prev => ({ ...prev, [questionId]: answer }))
        setError("")
    }

    const handleCompanyFieldChange = (field: keyof BoothCompanyProfileInput, value: string) => {
        setCompanyProfile((prev) => ({ ...prev, [field]: value }))
        setError("")
    }

    const validateForm = () => {
        if (!companyProfile.companyName?.trim()) {
            setError("Company name is required")
            return false
        }

        const requiredQuestions = APPLICATION_QUESTIONS.filter(q => q.required)
        for (const question of requiredQuestions) {
            if (!answers[question.id]) {
                setError(`Please answer: ${question.question}`)
                return false
            }
        }
        return true
    }

    const handleSubmit = async () => {
        if (!validateForm()) return

        try {
            setSubmitting(true)
            setError("")

            const response = await submitBoothApplication(expoId, booth._id, answers, companyProfile)

            if (response.success) {
                onSuccess()
            }
        } catch (err: unknown) {
            const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to submit application"
            setError(message)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#0a0a0f]/90 backdrop-blur-sm flex items-center justify-center z-50 overflow-y-auto"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.5, y: 100 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.5, y: 100 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="bg-[#0a0a0f] border border-[#4c9aff]/30 rounded-2xl p-8 max-w-3xl w-full mx-4 my-8 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-2">
                            Booth Application
                        </h2>
                        <p className="text-[#a0a0b0]">
                            Booth {booth.boothNumber} - Row {booth.row}, Col {booth.col}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-[#a0a0b0] hover:text-white transition"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Info */}
                <div className="mb-6 p-4 rounded-lg bg-[#4c9aff]/10 border border-[#4c9aff]/30">
                    <p className="text-sm text-[#4c9aff]">
                        📋 Please complete the following questions. Your application will be reviewed by the expo organizers.
                    </p>
                </div>

                {/* Company Profile */}
                <div className="mb-6 p-4 rounded-lg bg-white/5 border border-white/10">
                    <h3 className="text-white font-semibold mb-3">Company Public Profile</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="md:col-span-2">
                            <label className="text-xs text-[#a0a0b0] mb-1 block">Company Name *</label>
                            <input
                                value={companyProfile.companyName}
                                onChange={(e) => handleCompanyFieldChange("companyName", e.target.value)}
                                placeholder="Your company name"
                                className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-700 text-white focus:border-[#4c9aff] outline-none"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="text-xs text-[#a0a0b0] mb-1 block">Banner Image URL (optional)</label>
                            <input
                                value={companyProfile.bannerImage || ""}
                                onChange={(e) => handleCompanyFieldChange("bannerImage", e.target.value)}
                                placeholder="https://..."
                                className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-700 text-white focus:border-[#4c9aff] outline-none"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-[#a0a0b0] mb-1 block">Website</label>
                            <input
                                value={companyProfile.website || ""}
                                onChange={(e) => handleCompanyFieldChange("website", e.target.value)}
                                placeholder="https://yourcompany.com"
                                className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-700 text-white focus:border-[#4c9aff] outline-none"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-[#a0a0b0] mb-1 block">LinkedIn</label>
                            <input
                                value={companyProfile.linkedin || ""}
                                onChange={(e) => handleCompanyFieldChange("linkedin", e.target.value)}
                                placeholder="https://linkedin.com/..."
                                className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-700 text-white focus:border-[#4c9aff] outline-none"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="text-xs text-[#a0a0b0] mb-1 block">Instagram</label>
                            <input
                                value={companyProfile.instagram || ""}
                                onChange={(e) => handleCompanyFieldChange("instagram", e.target.value)}
                                placeholder="https://instagram.com/..."
                                className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-700 text-white focus:border-[#4c9aff] outline-none"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="text-xs text-[#a0a0b0] mb-1 block">Short Description</label>
                            <textarea
                                value={companyProfile.description || ""}
                                onChange={(e) => handleCompanyFieldChange("description", e.target.value)}
                                placeholder="Tell visitors what your company does"
                                rows={3}
                                className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-700 text-white focus:border-[#4c9aff] outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Questions */}
                <div className="space-y-6 mb-6 max-h-96 overflow-y-auto pr-2">
                    {APPLICATION_QUESTIONS.map((question, index) => (
                        <div key={question.id} className="p-4 rounded-lg bg-white/5 border border-white/10">
                            <h3 className="text-white font-semibold mb-3">
                                {index + 1}. {question.question}
                                {question.required && <span className="text-[#f87171] ml-1">*</span>}
                            </h3>
                            <div className="space-y-2">
                                {question.options.map((option) => (
                                    <label
                                        key={option}
                                        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition ${
                                            answers[question.id] === option
                                                ? "bg-[#4c9aff]/20 border-2 border-[#4c9aff]"
                                                : "bg-white/5 border-2 border-transparent hover:border-[#4c9aff]/30"
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name={question.id}
                                            value={option}
                                            checked={answers[question.id] === option}
                                            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                            className="w-4 h-4 text-[#4c9aff] bg-neutral-800 border-neutral-600 focus:ring-[#4c9aff]"
                                        />
                                        <span className="text-[#a0a0b0] text-sm">{option}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-4 rounded-lg bg-[#f87171]/10 border border-[#f87171]/30">
                        <p className="text-sm text-[#f87171]">{error}</p>
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-4">
                    <button
                        onClick={onClose}
                        className="flex-1 px-6 py-3 rounded-lg border border-[#4c9aff]/30 hover:bg-white/5 text-white font-semibold transition"
                        disabled={submitting}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-[#4c9aff] to-[#a78bfa] hover:from-[#3b82f6] hover:to-[#9333ea] disabled:from-[#4c9aff]/60 disabled:to-[#a78bfa]/60 text-white font-semibold transition shadow-lg"
                    >
                        {submitting ? "Submitting..." : "Submit Application"}
                    </button>
                </div>

                <p className="text-center text-xs text-[#707085] mt-4">
                    * Required fields
                </p>
            </motion.div>
        </motion.div>
    )
}

export default BoothApplicationModal
