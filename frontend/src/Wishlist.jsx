import { useNavigate } from 'react-router-dom'
import './Wishlist.css'

function Wishlist({ products, currentUser, wishlist, setWishlist, cart, setCart }) {
    const navigate = useNavigate()

    // Get wishlist products
    const wishlistProducts = products.filter(product => wishlist.includes(product.id))

    const toggleWishlist = (productId) => {
        setWishlist(prev =>
            prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        )
    }

    const addToCart = (productId, size = null) => {
        setCart(prev => {
            const existingItem = prev.find(item => item.id === productId && item.size === size)
            if (existingItem) {
                return prev.map(item =>
                    item.id === productId && item.size === size
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            }
            return [...prev, { id: productId, size, quantity: 1 }]
        })
    }

    const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0)

    return (
        <div className="wishlist-page">
            {/* Header */}
            <header className="wishlist-header">
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
                            className="icon-button active"
                            aria-label="Wishlist"
                            onClick={() => navigate('/wishlist')}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                            {wishlist.length > 0 && <span className="badge">{wishlist.length}</span>}
                        </button>
                        <button
                            className="icon-button"
                            aria-label="Shopping Cart"
                            onClick={() => navigate('/cart')}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="9" cy="21" r="1"></circle>
                                <circle cx="20" cy="21" r="1"></circle>
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                            </svg>
                            {cartItemsCount > 0 && <span className="badge">{cartItemsCount}</span>}
                        </button>
                        {currentUser ? (
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
                        ) : (
                            <button
                                className="filter-btn"
                                onClick={() => navigate('/login')}
                                style={{ marginLeft: '8px' }}
                            >
                                Login
                            </button>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="wishlist-content">
                <div className="container">
                    <div className="wishlist-title-section">
                        <h1 className="wishlist-title">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                            My Wishlist
                        </h1>
                        <p className="wishlist-subtitle">
                            {wishlistProducts.length} {wishlistProducts.length === 1 ? 'item' : 'items'} saved
                        </p>
                    </div>

                    {wishlistProducts.length === 0 ? (
                        <div className="empty-wishlist">
                            <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                            <h2>Your wishlist is empty</h2>
                            <p>Start adding products you love!</p>
                            <button className="browse-btn" onClick={() => navigate('/')}>
                                Browse Products
                            </button>
                        </div>
                    ) : (
                        <div className="wishlist-grid">
                            {wishlistProducts.map((product, index) => (
                                <article
                                    key={product.id}
                                    className="wishlist-card fade-in"
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    <div className="product-image-container">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="product-image"
                                        />
                                        <button
                                            className="remove-btn active"
                                            onClick={() => toggleWishlist(product.id)}
                                            aria-label="Remove from wishlist"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                            </svg>
                                        </button>
                                    </div>

                                    <div className="product-info">
                                        <h4 className="product-name">{product.name}</h4>
                                        <p className="product-description-small">{product.description}</p>



                                        <div className="product-footer">
                                            <span className="product-price">
                                                ₹{product.sizePricing && product.sizes && product.sizes.length > 0
                                                    ? product.sizePricing[product.sizes[0]]
                                                    : product.price}
                                            </span>
                                            <button
                                                className="add-to-cart-btn"
                                                onClick={() => {
                                                    const defaultSize = product.sizes && product.sizes[0]
                                                    addToCart(product.id, defaultSize)
                                                }}
                                            >
                                                Put in cart
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}

export default Wishlist
