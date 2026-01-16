import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

function Dashboard({
    products,
    currentUser,
    onLogout,
    wishlist,
    setWishlist,
    cart,
    setCart
}) {
    const navigate = useNavigate()
    const [selectedCategory, setSelectedCategory] = useState('All')
    const [searchQuery, setSearchQuery] = useState('')
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [selectedSize, setSelectedSize] = useState(null)
    const [quickAddProduct, setQuickAddProduct] = useState(null)

    // Get unique categories from products
    const categories = useMemo(() => {
        const uniqueCategories = [...new Set(products.map(p => p.category))];
        return ['All', ...uniqueCategories];
    }, [products]);

    // Filter products based on category and search
    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            // Category filter
            const categoryMatch = selectedCategory === 'All' || product.category === selectedCategory

            // Search filter
            const searchMatch = product.name.toLowerCase().includes(searchQuery.toLowerCase())

            return categoryMatch && searchMatch
        })
    }, [selectedCategory, searchQuery, products])

    const toggleWishlist = (productId) => {
        setWishlist(prev =>
            prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        )
    }

    const addToCart = (productId, size = null) => {
        setCart(prev => {
            // Find existing item with same product ID AND size
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
        <div className="app">
            {/* Sliding Sidebar */}
            <aside className={`sliding-sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <h2 className="sidebar-title">Filters</h2>
                    <button
                        className="close-btn"
                        onClick={() => setIsSidebarOpen(false)}
                        aria-label="Close menu"
                    >
                        ✕
                    </button>
                </div>

                <div className="filter-section">
                    <h3 className="filter-title">Category</h3>
                    <div className="filter-buttons">
                        {categories.map(category => (
                            <button
                                key={category}
                                className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
                                onClick={() => setSelectedCategory(category)}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="sidebar-section" style={{ marginTop: '2rem' }}>
                    <h3 className="filter-title">Quick Links</h3>
                    <div className="filter-buttons">
                        <button
                            className="filter-btn"
                            onClick={() => navigate('/orders')}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
                                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                                <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                                <line x1="12" y1="22.08" x2="12" y2="12"></line>
                            </svg>
                            Order History
                        </button>
                        <button
                            className="filter-btn"
                            onClick={() => navigate('/profile')}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                            My Profile
                        </button>
                    </div>
                </div>


            </aside>

            {/* Main App Container */}
            <div className={`app-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
                {/* Header */}
                <header className="header">
                    <div className="container header-content">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                            <button
                                className="hamburger-btn"
                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                aria-label="Toggle menu"
                            >
                                <span className="hamburger-icon">☰</span>
                            </button>
                            <a href="/" className="logo">
                                MIMO
                                <span className="logo-tagline">LET BE UNIQUE</span>
                            </a>
                        </div>

                        <div className="search-bar">
                            <input
                                type="text"
                                className="search-input"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
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
                <main className="main-content">
                    <div className="container">
                        <div className="layout">
                            {/* Products Grid */}
                            <section className="products-section">
                                <div className="products-grid">
                                    {filteredProducts.map((product, index) => (
                                        <article
                                            key={product.id}
                                            className="product-card fade-in"
                                            style={{ animationDelay: `${index * 50}ms` }}
                                        >
                                            <div
                                                className="product-image-container"
                                                onClick={() => setSelectedProduct(product)}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="product-image"
                                                />
                                                <button
                                                    className={`wishlist-btn ${wishlist.includes(product.id) ? 'active' : ''}`}
                                                    onClick={() => toggleWishlist(product.id)}
                                                    aria-label="Add to wishlist"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill={wishlist.includes(product.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            const defaultSize = product.sizes && product.sizes[0]
                                                            setSelectedSize(defaultSize)
                                                            setQuickAddProduct(product)
                                                        }}
                                                    >
                                                        Put in cart
                                                    </button>
                                                </div>
                                            </div>
                                        </article>
                                    ))}
                                </div>

                                {filteredProducts.length === 0 && (
                                    <div style={{
                                        textAlign: 'center',
                                        padding: '3rem',
                                        color: 'var(--text-secondary)'
                                    }}>
                                        <p style={{ fontSize: '1.25rem' }}>No products found</p>
                                        <p>Try adjusting your filters or search query</p>
                                    </div>
                                )}
                            </section>
                        </div>
                    </div>
                </main>
            </div>

            {/* Product Detail Modal */}
            {selectedProduct && (
                <div className="modal-overlay" onClick={() => {
                    setSelectedProduct(null)
                    setSelectedSize(null)
                }}>
                    <div className="product-modal" onClick={(e) => e.stopPropagation()}>
                        <button
                            className="modal-close-btn"
                            onClick={() => {
                                setSelectedProduct(null)
                                setSelectedSize(null)
                            }}
                            aria-label="Close modal"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>

                        <div className="modal-content">
                            <div className="modal-image-column">
                                <div className="modal-image-section">
                                    <img
                                        src={selectedProduct.image}
                                        alt={selectedProduct.name}
                                        className="modal-product-image"
                                    />
                                </div>
                                {selectedProduct.sizes && selectedProduct.sizes.length > 0 && (
                                    <div className="modal-sizes-display">
                                        <span className="sizes-label">Available Sizes</span>
                                        <div className="sizes-list">
                                            {selectedProduct.sizes.map(size => (
                                                <button
                                                    key={size}
                                                    className={`size-badge ${selectedSize === size ? 'active' : ''}`}
                                                    onClick={() => setSelectedSize(size)}
                                                >
                                                    {size}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="modal-details-section">
                                <div className="modal-category">{selectedProduct.category}</div>
                                <h2 className="modal-product-name">{selectedProduct.name}</h2>



                                <div className="modal-price">
                                    ₹{selectedProduct.sizePricing && (selectedSize || (selectedProduct.sizes && selectedProduct.sizes[0]))
                                        ? selectedProduct.sizePricing[selectedSize || selectedProduct.sizes[0]]
                                        : selectedProduct.price}
                                </div>

                                <div className="modal-description">
                                    <h3>Product Description</h3>
                                    <p>
                                        {selectedProduct.description}
                                    </p>

                                </div>

                                <div className="modal-actions">
                                    <button
                                        className={`modal-wishlist-btn ${wishlist.includes(selectedProduct.id) ? 'active' : ''}`}
                                        onClick={() => toggleWishlist(selectedProduct.id)}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill={wishlist.includes(selectedProduct.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                        </svg>
                                        {wishlist.includes(selectedProduct.id) ? 'Saved' : 'Save to Wishlist'}
                                    </button>
                                    <button
                                        className="modal-add-to-cart-btn"
                                        onClick={() => {
                                            const sizeToAdd = selectedSize || (selectedProduct.sizes && selectedProduct.sizes[0])
                                            addToCart(selectedProduct.id, sizeToAdd)
                                            setSelectedProduct(null)
                                            setSelectedSize(null)
                                        }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="9" cy="21" r="1"></circle>
                                            <circle cx="20" cy="21" r="1"></circle>
                                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                                        </svg>
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Quick Add Modal */}
            {quickAddProduct && (
                <div className="quick-add-overlay" onClick={() => setQuickAddProduct(null)}>
                    <div className="quick-add-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="quick-add-close" onClick={() => setQuickAddProduct(null)}>✕</button>

                        <div className="quick-add-content">
                            <div className="quick-add-product-summary">
                                <img src={quickAddProduct.image} alt={quickAddProduct.name} className="quick-add-image" />
                                <div className="quick-add-product-info">
                                    <h3 className="quick-add-name">{quickAddProduct.name}</h3>

                                    <button className="see-details-link" onClick={() => {
                                        setSelectedProduct(quickAddProduct)
                                        setQuickAddProduct(null)
                                    }}>See all item details</button>
                                </div>
                            </div>

                            <div className="quick-add-divider"></div>

                            <div className="quick-add-selection">
                                <label className="quick-add-label">Size:</label>
                                <select
                                    className="quick-add-size-select"
                                    value={selectedSize || ''}
                                    onChange={(e) => setSelectedSize(e.target.value)}
                                >
                                    {quickAddProduct.sizes && quickAddProduct.sizes.map(size => (
                                        <option key={size} value={size}>{size}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="quick-add-pricing">
                                <div className="quick-add-main-price">
                                    <span className="currency-symbol-small">₹</span>
                                    <span className="price-amount">
                                        {quickAddProduct.sizePricing && selectedSize
                                            ? quickAddProduct.sizePricing[selectedSize]
                                            : quickAddProduct.price}
                                    </span>
                                </div>
                            </div>


                            <div className="quick-add-actions">
                                <button className="quick-add-cancel" onClick={() => setQuickAddProduct(null)}>Cancel</button>
                                <button
                                    className="quick-add-submit"
                                    onClick={() => {
                                        addToCart(quickAddProduct.id, selectedSize)
                                        setQuickAddProduct(null)
                                        setSelectedSize(null)
                                    }}
                                >
                                    Add to cart
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Dashboard
