import { useNavigate } from 'react-router-dom'
import './Payment.css'

function Payment({ cart, setCart, products, currentUser, addOrder }) {
    const navigate = useNavigate()

    // Get cart products with quantities
    const cartItems = cart.map(cartItem => {
        const product = products.find(p => p.id === cartItem.id)
        if (!product) return null
        const currentPrice = (product.sizePricing && cartItem.size)
            ? product.sizePricing[cartItem.size]
            : (product.price || 0)
        return {
            ...product,
            quantity: cartItem.quantity,
            selectedSize: cartItem.size,
            currentPrice
        }
    }).filter(item => item && item.id)

    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => sum + (item.currentPrice * item.quantity), 0)
    const shipping = subtotal > 100 ? 0 : 10
    const total = subtotal + shipping

    const upiId = "7373587080@ybl";
    const payName = "MIMO Store";
    const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payName)}&am=${total.toFixed(2)}&cu=INR`;
    const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(upiUrl)}`;

    if (cartItems.length === 0) {
        return (
            <div className="payment-page">
                <div className="container centered">
                    <div className="empty-payment">
                        <h2>No Payment Pending</h2>
                        <p>Your cart is empty. Add items to checkout.</p>
                        <button className="back-to-shop-btn" onClick={() => navigate('/')}>
                            Go to Shop
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="payment-page">
            <header className="payment-header-bar">
                <div className="container header-inner">
                    <button className="back-btn" onClick={() => navigate('/cart')}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <div className="payment-logo">MIMO</div>
                </div>
            </header>

            <main className="payment-main">
                <div className="container payment-container">
                    <div className="payment-layout">
                        {/* QR Section */}
                        <div className="payment-qr-card card-shadow">
                            <div className="payment-card-header">
                                <h2>Scan & Pay</h2>
                                <p>Open any UPI app to complete your payment</p>
                            </div>

                            <div className="qr-visualization">
                                <div className="qr-wrapper">
                                    <img src={qrImageUrl} alt="Payment QR" />
                                </div>
                                <div className="payment-upi-info">
                                    <span className="upi-label">UPI ID</span>
                                    <span className="upi-id">{upiId}</span>
                                </div>
                            </div>

                            <div className="payment-steps">
                                <div className="step">
                                    <span className="step-number">1</span>
                                    <p>Open UPI App</p>
                                </div>
                                <div className="step">
                                    <span className="step-number">2</span>
                                    <p>Scan QR Code</p>
                                </div>
                                <div className="step">
                                    <span className="step-number">3</span>
                                    <p>Amount Pre-filled</p>
                                </div>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="payment-details-card card-shadow">
                            <h3>Order Summary</h3>
                            <div className="payment-summary-list">
                                <div className="payment-summary-row">
                                    <span>Subtotal</span>
                                    <span>₹{subtotal.toFixed(2)}</span>
                                </div>
                                <div className="payment-summary-row border-top">
                                    <span>Shipping</span>
                                    <span>{shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`}</span>
                                </div>
                                <div className="payment-summary-row total-row">
                                    <span>Amount to Pay</span>
                                    <span>₹{total.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="shipping-address-summary">
                                <h4>Shipping to:</h4>
                                {localStorage.getItem('checkoutAddress') ? (
                                    <div className="address-text">
                                        <p><strong>{JSON.parse(localStorage.getItem('checkoutAddress')).fullName}</strong></p>
                                        <p>{JSON.parse(localStorage.getItem('checkoutAddress')).street}</p>
                                        <p>{JSON.parse(localStorage.getItem('checkoutAddress')).city}, {JSON.parse(localStorage.getItem('checkoutAddress')).state} - {JSON.parse(localStorage.getItem('checkoutAddress')).zipCode}</p>
                                        <p>Phone: {JSON.parse(localStorage.getItem('checkoutAddress')).phone}</p>
                                    </div>
                                ) : (
                                    <p>No address found. Please go back.</p>
                                )}
                                <button className="edit-address-link" onClick={() => navigate('/checkout/address')}>Edit Address</button>
                            </div>

                            <div className="payment-order-preview">
                                <h4>Items in Order ({cartItems.length})</h4>
                                <div className="preview-items">
                                    {cartItems.map(item => (
                                        <div key={`${item.id}-${item.selectedSize}`} className="preview-item">
                                            <img src={item.image} alt={item.name} />
                                            <div className="preview-info">
                                                <span className="preview-name">{item.name}</span>
                                                <span className="preview-size">Size: {item.selectedSize}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="payment-confirmation-actions">
                                <button className="confirm-payment-btn" onClick={async () => {
                                    // Get address from localStorage
                                    const shippingAddress = JSON.parse(localStorage.getItem('checkoutAddress') || '{}')

                                    // 1. Create order data
                                    const orderData = {
                                        items: cartItems.map(item => ({
                                            id: item.id,
                                            name: item.name,
                                            price: item.currentPrice,
                                            quantity: item.quantity,
                                            size: item.selectedSize,
                                            image: item.image
                                        })),
                                        total: total,
                                        customer: {
                                            name: currentUser.name,
                                            email: currentUser.email
                                        },
                                        shippingAddress: shippingAddress
                                    };

                                    // 2. Save to User's Order History
                                    addOrder(orderData);

                                    // 3. Save to Admin Orders Collection
                                    try {
                                        const { addDoc, collection } = await import('firebase/firestore');
                                        const { db } = await import('./firebase');
                                        await addDoc(collection(db, 'admin_orders'), {
                                            ...orderData,
                                            timestamp: new Date().toISOString()
                                        });
                                    } catch (err) {
                                        console.error("Failed to save order to admin collection:", err);
                                        alert("Warning: Order saved to your history but may not appear in admin panel. Please contact support.");
                                    }

                                    // 4. Clear Cart & Show Success Message
                                    alert("Congratulations! Your order has been placed successfully!")
                                    setCart([])

                                    // 5. Redirect to Orders Page
                                    navigate('/orders')
                                }}>
                                    I Have Paid
                                </button>
                                <p className="secure-note">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                    </svg>
                                    Secure SSL Encrypted Payment
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Payment
