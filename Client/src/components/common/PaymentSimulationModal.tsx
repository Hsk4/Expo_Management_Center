import { useState } from 'react';
import type { CSSProperties } from 'react';
import type { PaymentSimulationPayload } from '../../services/expo.service';

interface PaymentSimulationModalProps {
    title?: string;
    subtitle?: string;
    ctaLabel?: string;
    onClose: () => void;
    onConfirm: (payload: PaymentSimulationPayload) => Promise<void> | void;
}

const cardIcons = {
    visa: (
        <svg viewBox="0 0 48 32" width="42" height="28" xmlns="http://www.w3.org/2000/svg">
            <rect width="48" height="32" rx="4" fill="#1A1F71" />
            <text x="8" y="22" fontFamily="Arial" fontSize="14" fontWeight="700" fill="#FFFFFF" letterSpacing="1">VISA</text>
        </svg>
    ),
    mastercard: (
        <svg viewBox="0 0 48 32" width="42" height="28" xmlns="http://www.w3.org/2000/svg">
            <rect width="48" height="32" rx="4" fill="#252525" />
            <circle cx="18" cy="16" r="9" fill="#EB001B" fillOpacity="0.9" />
            <circle cx="30" cy="16" r="9" fill="#F79E1B" fillOpacity="0.9" />
            <path d="M24 9.5a9 9 0 0 1 0 13A9 9 0 0 1 24 9.5z" fill="#FF5F00" />
        </svg>
    ),
    amex: (
        <svg viewBox="0 0 48 32" width="42" height="28" xmlns="http://www.w3.org/2000/svg">
            <rect width="48" height="32" rx="4" fill="#2E77BC" />
            <text x="5" y="21" fontFamily="Arial" fontSize="10" fontWeight="700" fill="#FFFFFF" letterSpacing="0.5">AMEX</text>
        </svg>
    ),
};

function detectCard(num: string) {
    const n = num.replace(/\s/g, '');
    if (/^4/.test(n)) return 'visa';
    if (/^5[1-5]/.test(n)) return 'mastercard';
    if (/^3[47]/.test(n)) return 'amex';
    return null;
}

function formatCardNumber(val: string) {
    const digits = val.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(.{4})/g, '$1 ').trim();
}

function formatExpiry(val: string) {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
}

const PaymentSimulationModal = ({
    title = 'Payment Details',
    subtitle = 'Complete your purchase securely',
    ctaLabel = 'Pay Now',
    onClose,
    onConfirm,
}: PaymentSimulationModalProps) => {
    const [cardNumber, setCardNumber] = useState('');
    const [cardName, setCardName] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');
    const [flipped, setFlipped] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submitting, setSubmitting] = useState(false);

    const cardType = detectCard(cardNumber);

    const validate = () => {
        const e: Record<string, string> = {};
        if (cardNumber.replace(/\s/g, '').length < 16) e.cardNumber = 'Enter a valid 16-digit card number';
        if (!cardName.trim()) e.cardName = 'Cardholder name is required';
        if (expiry.length < 5) e.expiry = 'Enter a valid expiry date';
        if (cvv.length < 3) e.cvv = 'Enter a valid CVV';
        return e;
    };

    const handlePay = async () => {
        const e = validate();
        if (Object.keys(e).length) {
            setErrors(e);
            return;
        }

        try {
            setSubmitting(true);
            await onConfirm({ paymentMethod: 'card', cardNumber, cardName, expiry, cvv });
        } catch (err: unknown) {
            const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Payment simulation failed';
            setErrors({ form: message });
        } finally {
            setSubmitting(false);
        }
    };

    const styles: Record<string, CSSProperties | ((active: boolean) => CSSProperties)> = {
        wrapper: {
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            minHeight: '100vh',
            background: '#0a0a0a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "'Segoe UI', system-ui, sans-serif",
            padding: '40px 16px',
        },
        container: { width: '100%', maxWidth: '420px', position: 'relative' },
        close: {
            position: 'absolute',
            top: '-36px',
            right: '0',
            background: 'transparent',
            border: '1px solid #333',
            color: '#aaa',
            borderRadius: '8px',
            width: '32px',
            height: '32px',
            cursor: 'pointer',
        },
        heading: { color: '#fff', fontSize: '24px', fontWeight: '600', marginBottom: '6px', letterSpacing: '-0.3px' },
        subtext: { color: '#666', fontSize: '14px', marginBottom: '32px' },
        card3d: { perspective: '1000px', marginBottom: '32px', height: '190px' },
        cardInner: {
            position: 'relative',
            width: '100%',
            height: '190px',
            transformStyle: 'preserve-3d',
            transition: 'transform 0.6s ease',
            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        },
        cardFace: {
            position: 'absolute',
            inset: 0,
            borderRadius: '16px',
            padding: '24px',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
            border: '1px solid #333',
        },
        cardBack: {
            position: 'absolute',
            inset: 0,
            borderRadius: '16px',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
            border: '1px solid #333',
            overflow: 'hidden',
        },
        chip: {
            width: '38px',
            height: '28px',
            borderRadius: '6px',
            background: 'linear-gradient(135deg, #d4a843, #f0c060)',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        cardNum: { color: '#e5e5e5', fontSize: '18px', letterSpacing: '3px', fontFamily: 'monospace', marginBottom: '20px' },
        cardMeta: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' },
        cardLabel: { color: '#666', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '2px' },
        cardValue: { color: '#ccc', fontSize: '13px', letterSpacing: '0.5px' },
        stripe: { height: '44px', background: '#111', margin: '20px -24px 16px' },
        cvvBox: {
            margin: '0 24px',
            background: '#fff',
            borderRadius: '4px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            padding: '0 12px',
        },
        cvvVal: { color: '#111', fontFamily: 'monospace', fontSize: '16px', letterSpacing: '4px' },
        acceptedCards: { display: 'flex', gap: '8px', marginBottom: '24px', alignItems: 'center' },
        cardBadge: (active: boolean) => ({
            borderRadius: '6px',
            padding: '3px 6px',
            border: active ? '1.5px solid #444' : '1.5px solid #222',
            opacity: active ? 1 : 0.35,
            transition: 'all 0.2s',
            background: '#111',
            display: 'flex',
            alignItems: 'center',
        }),
        group: { marginBottom: '18px' },
        label: {
            display: 'block',
            color: '#888',
            fontSize: '12px',
            letterSpacing: '0.8px',
            textTransform: 'uppercase',
            marginBottom: '8px',
        },
        input: (hasErr: boolean) => ({
            width: '100%',
            background: '#111',
            border: `1px solid ${hasErr ? '#c0392b' : '#2a2a2a'}`,
            borderRadius: '10px',
            color: '#fff',
            fontSize: '15px',
            padding: '13px 14px',
            outline: 'none',
            boxSizing: 'border-box',
            letterSpacing: '0.3px',
            transition: 'border-color 0.2s',
        }),
        error: { color: '#e74c3c', fontSize: '11px', marginTop: '5px' },
        row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' },
        payBtn: {
            width: '100%',
            padding: '15px',
            borderRadius: '12px',
            border: 'none',
            background: '#fff',
            color: '#0a0a0a',
            fontSize: '15px',
            fontWeight: '700',
            cursor: 'pointer',
            marginTop: '8px',
            letterSpacing: '0.3px',
            transition: 'background 0.2s, transform 0.1s',
        },
        lockRow: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            marginTop: '14px',
            color: '#444',
            fontSize: '12px',
        },
    };

    const maskedNum = cardNumber ? cardNumber.padEnd(19, ' ').slice(0, 19) : '#### #### #### ####';

    return (
        <div style={styles.wrapper as CSSProperties} onClick={onClose}>
            <div style={styles.container as CSSProperties} onClick={(e) => e.stopPropagation()}>
                <button style={styles.close as CSSProperties} onClick={onClose} aria-label="Close payment modal">x</button>
                <h1 style={styles.heading as CSSProperties}>{title}</h1>
                <p style={styles.subtext as CSSProperties}>{subtitle}</p>

                <div style={styles.card3d as CSSProperties}>
                    <div style={styles.cardInner as CSSProperties}>
                        <div style={styles.cardFace as CSSProperties}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={styles.chip as CSSProperties}>
                                    <svg width="22" height="18" viewBox="0 0 22 18" fill="none">
                                        <rect x="1" y="1" width="20" height="16" rx="2" stroke="#a07820" strokeWidth="1" />
                                        <line x1="1" y1="6" x2="21" y2="6" stroke="#a07820" strokeWidth="1" />
                                        <line x1="1" y1="12" x2="21" y2="12" stroke="#a07820" strokeWidth="1" />
                                        <line x1="8" y1="1" x2="8" y2="17" stroke="#a07820" strokeWidth="1" />
                                        <line x1="14" y1="1" x2="14" y2="17" stroke="#a07820" strokeWidth="1" />
                                    </svg>
                                </div>
                                {cardType ? cardIcons[cardType as keyof typeof cardIcons] : null}
                            </div>
                            <div style={styles.cardNum as CSSProperties}>{maskedNum}</div>
                            <div style={styles.cardMeta as CSSProperties}>
                                <div>
                                    <div style={styles.cardLabel as CSSProperties}>Card Holder</div>
                                    <div style={styles.cardValue as CSSProperties}>{cardName || 'Full Name'}</div>
                                </div>
                                <div>
                                    <div style={styles.cardLabel as CSSProperties}>Expires</div>
                                    <div style={styles.cardValue as CSSProperties}>{expiry || 'MM/YY'}</div>
                                </div>
                            </div>
                        </div>

                        <div style={styles.cardBack as CSSProperties}>
                            <div style={styles.stripe as CSSProperties} />
                            <div style={{ padding: '0 16px' }}>
                                <div style={{ color: '#555', fontSize: '11px', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>CVV</div>
                                <div style={styles.cvvBox as CSSProperties}>
                                    <span style={styles.cvvVal as CSSProperties}>{cvv || '***'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={styles.acceptedCards as CSSProperties}>
                    <span style={{ color: '#444', fontSize: '12px', marginRight: '4px' }}>Accepted:</span>
                    {['visa', 'mastercard', 'amex'].map((t) => (
                        <div key={t} style={(styles.cardBadge as (active: boolean) => CSSProperties)(!cardType || cardType === t)}>
                            {cardIcons[t as keyof typeof cardIcons]}
                        </div>
                    ))}
                </div>

                <div style={styles.group as CSSProperties}>
                    <label style={styles.label as CSSProperties}>Card Number</label>
                    <input
                        style={(styles.input as (active: boolean) => CSSProperties)(Boolean(errors.cardNumber))}
                        type="text"
                        inputMode="numeric"
                        placeholder="0000 0000 0000 0000"
                        value={cardNumber}
                        maxLength={19}
                        onChange={(e) => {
                            setCardNumber(formatCardNumber(e.target.value));
                            setErrors((p) => ({ ...p, cardNumber: '' }));
                        }}
                    />
                    {errors.cardNumber && <div style={styles.error as CSSProperties}>{errors.cardNumber}</div>}
                </div>

                <div style={styles.group as CSSProperties}>
                    <label style={styles.label as CSSProperties}>Cardholder Name</label>
                    <input
                        style={(styles.input as (active: boolean) => CSSProperties)(Boolean(errors.cardName))}
                        type="text"
                        placeholder="Name on card"
                        value={cardName}
                        onChange={(e) => {
                            setCardName(e.target.value);
                            setErrors((p) => ({ ...p, cardName: '' }));
                        }}
                    />
                    {errors.cardName && <div style={styles.error as CSSProperties}>{errors.cardName}</div>}
                </div>

                <div style={styles.row as CSSProperties}>
                    <div style={styles.group as CSSProperties}>
                        <label style={styles.label as CSSProperties}>Expiry Date</label>
                        <input
                            style={(styles.input as (active: boolean) => CSSProperties)(Boolean(errors.expiry))}
                            type="text"
                            inputMode="numeric"
                            placeholder="MM/YY"
                            value={expiry}
                            maxLength={5}
                            onChange={(e) => {
                                setExpiry(formatExpiry(e.target.value));
                                setErrors((p) => ({ ...p, expiry: '' }));
                            }}
                        />
                        {errors.expiry && <div style={styles.error as CSSProperties}>{errors.expiry}</div>}
                    </div>
                    <div style={styles.group as CSSProperties}>
                        <label style={styles.label as CSSProperties}>CVV</label>
                        <input
                            style={(styles.input as (active: boolean) => CSSProperties)(Boolean(errors.cvv))}
                            type="text"
                            inputMode="numeric"
                            placeholder="***"
                            value={cvv}
                            maxLength={4}
                            onFocus={() => setFlipped(true)}
                            onBlur={() => setFlipped(false)}
                            onChange={(e) => {
                                setCvv(e.target.value.replace(/\D/g, ''));
                                setErrors((p) => ({ ...p, cvv: '' }));
                            }}
                        />
                        {errors.cvv && <div style={styles.error as CSSProperties}>{errors.cvv}</div>}
                    </div>
                </div>

                {errors.form && <div style={styles.error as CSSProperties}>{errors.form}</div>}

                <button
                    style={styles.payBtn as CSSProperties}
                    onClick={handlePay}
                    disabled={submitting}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#e5e5e5';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#fff';
                    }}
                >
                    {submitting ? 'Processing...' : ctaLabel}
                </button>

                <div style={styles.lockRow as CSSProperties}>
                    <svg width="13" height="14" viewBox="0 0 13 14" fill="none">
                        <rect x="1" y="6" width="11" height="7" rx="2" stroke="#555" strokeWidth="1.2" />
                        <path d="M4 6V4.5a2.5 2.5 0 0 1 5 0V6" stroke="#555" strokeWidth="1.2" strokeLinecap="round" />
                    </svg>
                    Secured by 256-bit SSL encryption
                </div>
            </div>
        </div>
    );
};

export default PaymentSimulationModal;

