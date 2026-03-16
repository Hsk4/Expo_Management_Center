import { useId, useState } from 'react';

interface ImagePickerFieldProps {
    label: string;
    value: string;
    onChange: (next: string) => void;
    placeholder?: string;
    helperText?: string;
}

const MAX_FILE_SIZE_MB = 2;

const ImagePickerField = ({ label, value, onChange, placeholder = 'https://example.com/image.jpg', helperText }: ImagePickerFieldProps) => {
    const inputId = useId();
    const [error, setError] = useState('');
    const [imgBroken, setImgBroken] = useState(false);

    const handleFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setError('Please select an image file.');
            return;
        }

        if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
            setError(`Image must be smaller than ${MAX_FILE_SIZE_MB}MB.`);
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            const result = String(reader.result || '');
            onChange(result);
            setError('');
            setImgBroken(false);
        };
        reader.onerror = () => setError('Could not read the selected file.');
        reader.readAsDataURL(file);
    };

    return (
        <div className="space-y-2">
            <label htmlFor={inputId} className="text-xs text-[#a0a0b0] block">{label}</label>
            <input
                id={inputId}
                value={value}
                onChange={(e) => {
                    onChange(e.target.value);
                    setError('');
                    setImgBroken(false);
                }}
                placeholder={placeholder}
                className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-700 text-white focus:border-[#4c9aff] outline-none"
            />
            <div className="flex items-center gap-2 flex-wrap">
                <label className="px-3 py-1.5 text-xs rounded-lg border border-[#4c9aff]/40 text-[#93c5fd] cursor-pointer hover:bg-[#4c9aff]/10 transition">
                    Select image
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileSelected} />
                </label>
                {value && (
                    <button
                        type="button"
                        onClick={() => {
                            onChange('');
                            setError('');
                            setImgBroken(false);
                        }}
                        className="px-3 py-1.5 text-xs rounded-lg border border-white/20 text-[#a0a0b0] hover:text-white hover:bg-white/5 transition"
                    >
                        Clear
                    </button>
                )}
                {helperText && <span className="text-xs text-[#707085]">{helperText}</span>}
            </div>
            {error && <p className="text-xs text-[#f87171]">{error}</p>}
            {value && !imgBroken && (
                <img
                    src={value}
                    alt="Selected preview"
                    className="w-full max-h-44 rounded-lg object-cover border border-white/10"
                    onError={() => setImgBroken(true)}
                />
            )}
            {value && imgBroken && <p className="text-xs text-[#f87171]">Image preview could not be loaded from this URL.</p>}
        </div>
    );
};

export default ImagePickerField;

