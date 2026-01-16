import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './CheckoutAddress.css'

function CheckoutAddress({ currentUser, cart, products }) {
    const navigate = useNavigate()

    // Check for saved address in localStorage
    const saved = localStorage.getItem('checkoutAddress')
    const savedAddress = saved ? JSON.parse(saved) : null

    const [address, setAddress] = useState({
        fullName: savedAddress?.fullName || currentUser?.name || '',
        phone: savedAddress?.phone || '',
        street: savedAddress?.street || '',
        city: savedAddress?.city || '',
        state: savedAddress?.state || '',
        zipCode: savedAddress?.zipCode || '',
        type: savedAddress?.type || 'Home'
    })

    const [showSuggestion, setShowSuggestion] = useState(true)
    const [errors, setErrors] = useState({})

    const handleChange = (e) => {
        const { name, value } = e.target
        setAddress(prev => ({ ...prev, [name]: value }))
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
    }

    const validate = () => {
        const newErrors = {}
        if (!address.fullName.trim()) newErrors.fullName = 'Full name is required'
        if (!address.phone.trim()) newErrors.phone = 'Phone number is required'
        if (!/^\d{10}$/.test(address.phone.trim())) newErrors.phone = 'Invalid phone number (10 digits)'
        if (!address.street.trim()) newErrors.street = 'Street address is required'
        if (!address.city.trim()) newErrors.city = 'City is required'
        if (!address.state.trim()) newErrors.state = 'State is required'
        if (!address.zipCode.trim()) newErrors.zipCode = 'ZIP code is required'

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (validate()) {
            // Save address to local storage or state to use in Payment
            localStorage.setItem('checkoutAddress', JSON.stringify(address))
            navigate('/payment')
        }
    }

    return (
        <div className="checkout-address-page">
            <header className="checkout-header">
                <div className="container header-inner">
                    <button className="back-btn" onClick={() => navigate('/cart')}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <div className="logo">MIMO<span>CHECKOUT</span></div>
                </div>
            </header>

            <main className="checkout-main container">
                <div className="checkout-steps">
                    <div className="step active"><span>1</span> Address</div>
                    <div className="step-line"></div>
                    <div className="step"><span>2</span> Payment</div>
                </div>

                <div className="address-form-container card-shadow">
                    <h2>Shipping Address</h2>
                    <p className="subtitle">Where should we deliver your order?</p>

                    {savedAddress && showSuggestion && (
                        <div className="address-suggestion" onClick={() => {
                            setAddress({ ...savedAddress })
                            setShowSuggestion(false)
                        }}>
                            <div className="suggestion-icon">💡</div>
                            <div className="suggestion-content">
                                <span className="suggestion-label">Use previously used address:</span>
                                <p className="suggestion-text">
                                    {savedAddress.fullName}, {savedAddress.street}, {savedAddress.city}...
                                </p>
                            </div>
                            <button type="button" className="apply-suggestion-btn">Auto-fill</button>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="address-form">
                        <div className="form-group full-width">
                            <label>Full Name</label>
                            <input
                                type="text"
                                name="fullName"
                                value={address.fullName}
                                onChange={handleChange}
                                placeholder="Receiver's Name"
                                className={errors.fullName ? 'error' : ''}
                            />
                            {errors.fullName && <span className="error-text">{errors.fullName}</span>}
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Phone Number</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={address.phone}
                                    onChange={handleChange}
                                    placeholder="10-digit mobile number"
                                    className={errors.phone ? 'error' : ''}
                                />
                                {errors.phone && <span className="error-text">{errors.phone}</span>}
                            </div>
                            <div className="form-group">
                                <label>Address Type</label>
                                <div className="type-buttons">
                                    <button
                                        type="button"
                                        className={address.type === 'Home' ? 'active' : ''}
                                        onClick={() => setAddress(prev => ({ ...prev, type: 'Home' }))}
                                    >Home</button>
                                    <button
                                        type="button"
                                        className={address.type === 'Office' ? 'active' : ''}
                                        onClick={() => setAddress(prev => ({ ...prev, type: 'Office' }))}
                                    >Office</button>
                                </div>
                            </div>
                        </div>

                        <div className="form-group full-width">
                            <label>Street Address</label>
                            <textarea
                                name="street"
                                value={address.street}
                                onChange={handleChange}
                                placeholder="House No, Building, Street, Area"
                                className={errors.street ? 'error' : ''}
                                rows="3"
                            ></textarea>
                            {errors.street && <span className="error-text">{errors.street}</span>}
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>City</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={address.city}
                                    onChange={handleChange}
                                    className={errors.city ? 'error' : ''}
                                />
                                {errors.city && <span className="error-text">{errors.city}</span>}
                            </div>
                            <div className="form-group">
                                <label>State</label>
                                <input
                                    type="text"
                                    name="state"
                                    value={address.state}
                                    onChange={handleChange}
                                    className={errors.state ? 'error' : ''}
                                />
                                {errors.state && <span className="error-text">{errors.state}</span>}
                            </div>
                        </div>

                        <div className="form-group">
                            <label>ZIP / Postal Code</label>
                            <input
                                type="text"
                                name="zipCode"
                                value={address.zipCode}
                                onChange={handleChange}
                                className={errors.zipCode ? 'error' : ''}
                            />
                            {errors.zipCode && <span className="error-text">{errors.zipCode}</span>}
                        </div>

                        <button type="submit" className="continue-btn">
                            Proceed to Payment
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </button>
                    </form>
                </div>
            </main>
        </div>
    )
}

export default CheckoutAddress
