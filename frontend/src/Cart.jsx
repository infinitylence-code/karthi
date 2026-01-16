import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Cart.css'

function Cart({ products, currentUser, wishlist, setWishlist, cart, setCart }) {
    const navigate = useNavigate()
    const [promoCode, setPromoCode] = useState('')
    const [discount, setDiscount] = useState(0)

    // Get cart products with quantities
    const cartItems = cart.map(cartItem => {
        const product = products.find(p => p.id === cartItem.id)
        if (!product) return null
        // Get price for the specific size selected
        const currentPrice = (product.sizePricing && cartItem.size)
            ? product.sizePricing[cartItem.size]
            : (product.price || 0)
        return {
            ...product,
            quantity: cartItem.quantity,
            selectedSize: cartItem.size,
            currentPrice,
            cartItemId: `${cartItem.id}-${cartItem.size}` // Unique ID for cart item
        }
    }).filter(item => item && item.id)

    const updateQuantity = (productId, size, newQuantity) => {
        if (newQuantity <= 0) {
            removeFromCart(productId, size)
            return
        }
        setCart(prev =>
            prev.map(item =>
                item.id === productId && item.size === size
                    ? { ...item, quantity: newQuantity }
                    : item
            )
        )
    }

    const removeFromCart = (productId, size) => {
        setCart(prev => prev.filter(item => !(item.id === productId && item.size === size)))
    }

    const toggleWishlist = (productId) => {
        setWishlist(prev =>
            prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        )
    }

    const applyPromoCode = () => {
        // Validation logic removed as requested
        setDiscount(0)
        alert('Invalid promo code')
    }

    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => sum + (item.currentPrice * item.quantity), 0)
    const discountAmount = (subtotal * discount) / 100
    const shipping = subtotal > 100 ? 0 : 10
    const total = subtotal - discountAmount + shipping

    const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0)

    return (
        <div className="cart-page">
            {/* Header */}
            <header className="cart-header">
                <div className="container header-content">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                        <button
                            className="back-btn"
                            onClick={() => navigate('/')}
                            aria-label="Go back"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M19 12H5M12 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <a href="/" className="logo">
                            MIMO
                            <span className="logo-tagline">LET BE UNIQUE</span>
                        </a>
                    </div>

                    <div className="header-actions">
                        <button
                            className="icon-button"
                            aria-label="Wishlist"
                            onClick={() => navigate('/wishlist')}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                            {wishlist.length > 0 && <span className="badge">{wishlist.length}</span>}
                        </button>
                        <button
                            className="icon-button active"
                            aria-label="Shopping Cart"
                            onClick={() => navigate('/cart')}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="9" cy="21" r="1"></circle>
                                <circle cx="20" cy="21" r="1"></circle>
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                            </svg>
                            {cartItemsCount > 0 && <span className="badge">{cartItemsCount}</span>}
                        </button>
                        <button
                            className="icon-button profile-button"
                            aria-label="Profile"
                            onClick={() => navigate('/profile')}
                        >
                            {currentUser.profilePhoto ? (
                                <img src={currentUser.profilePhoto} alt={currentUser.name} className="dashboard-profile-img" />
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="cart-content">
                <div className="container">
                    <div className="cart-title-section">
                        <h1 className="cart-title">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="9" cy="21" r="1"></circle>
                                <circle cx="20" cy="21" r="1"></circle>
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                            </svg>
                            Shopping Cart
                        </h1>
                        <p className="cart-subtitle">
                            {cartItemsCount} {cartItemsCount === 1 ? 'item' : 'items'} in your cart
                        </p>
                    </div>

                    {cartItems.length === 0 ? (
                        <div className="empty-cart">
                            <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="9" cy="21" r="1"></circle>
                                <circle cx="20" cy="21" r="1"></circle>
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                            </svg>
                            <h2>Your cart is empty</h2>
                            <p>Add some products to get started!</p>
                            <button className="browse-btn" onClick={() => navigate('/')}>
                                Browse Products
                            </button>
                        </div>
                    ) : (
                        <div className="cart-layout">
                            {/* Cart Items */}
                            <div className="cart-items-section">
                                {cartItems.map((item, index) => (
                                    <div
                                        key={item.cartItemId}
                                        className="cart-item fade-in"
                                        style={{ animationDelay: `${index * 50}ms` }}
                                    >
                                        <div className="cart-item-image">
                                            <img src={item.image} alt={item.name} />
                                        </div>

                                        <div className="cart-item-details">
                                            <div className="cart-item-header">
                                                <div>
                                                    <h3 className="cart-item-name">{item.name}</h3>
                                                    <p className="cart-item-description">{item.description}</p>
                                                    {item.selectedSize && (
                                                        <p className="cart-item-size">Size: <strong>{item.selectedSize}</strong></p>
                                                    )}
                                                </div>
                                                <button
                                                    className="remove-item-btn"
                                                    onClick={() => removeFromCart(item.id, item.selectedSize)}
                                                    aria-label="Remove item"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <polyline points="3 6 5 6 21 6"></polyline>
                                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                    </svg>
                                                </button>
                                            </div>

                                            <div className="cart-item-footer">
                                                <div className="quantity-controls">
                                                    <button
                                                        className="quantity-btn"
                                                        onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity - 1)}
                                                    >
                                                        −
                                                    </button>
                                                    <span className="quantity-value">{item.quantity}</span>
                                                    <button
                                                        className="quantity-btn"
                                                        onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity + 1)}
                                                    >
                                                        +
                                                    </button>
                                                </div>

                                                <div className="cart-item-actions">
                                                    <button
                                                        className={`wishlist-toggle-btn ${wishlist.includes(item.id) ? 'active' : ''}`}
                                                        onClick={() => toggleWishlist(item.id)}
                                                        aria-label="Add to wishlist"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={wishlist.includes(item.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                                        </svg>
                                                        Save for later
                                                    </button>
                                                    <span className="cart-item-price">₹{(item.currentPrice * item.quantity).toFixed(2)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Order Summary */}
                            <div className="order-summary">
                                <h2 className="summary-title">Order Summary</h2>

                                {discount > 0 && (
                                    <div className="promo-applied">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                        {discount}% discount applied!
                                    </div>
                                )}

                                <div className="summary-details">
                                    <div className="summary-row">
                                        <span>Subtotal</span>
                                        <span>₹{subtotal.toFixed(2)}</span>
                                    </div>
                                    {discount > 0 && (
                                        <div className="summary-row discount">
                                            <span>Discount ({discount}%)</span>
                                            <span>-₹{discountAmount.toFixed(2)}</span>
                                        </div>
                                    )}
                                    <div className="summary-row">
                                        <span>Shipping</span>
                                        <span>{shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`}</span>
                                    </div>
                                    {shipping === 0 && (
                                        <p className="free-shipping-note">
                                            🎉 You got free shipping!
                                        </p>
                                    )}
                                    <div className="summary-divider"></div>
                                    <div className="summary-row total">
                                        <span>Total</span>
                                        <span>₹{total.toFixed(2)}</span>
                                    </div>
                                </div>

                                <button
                                    className="checkout-btn"
                                    onClick={() => navigate('/checkout/address')}
                                >
                                    Proceed to Checkout
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}

export default Cart
