import { useNavigate } from 'react-router-dom'
import './Orders.css'

function Orders({ orders, currentUser }) {
    const navigate = useNavigate()

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    return (
        <div className="orders-page">
            <header className="orders-header">
                <div className="container header-content">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <button className="back-btn" onClick={() => navigate('/')} aria-label="Back">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M19 12H5M12 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <div className="logo">MIMO<span>ORDERS</span></div>
                    </div>

                    <button className="profile-btn" onClick={() => navigate('/profile')}>
                        {currentUser.profilePhoto ? (
                            <img src={currentUser.profilePhoto} alt="Profile" />
                        ) : (
                            <div className="profile-placeholder">{currentUser.name ? currentUser.name[0] : 'U'}</div>
                        )}
                    </button>
                </div>
            </header>

            <main className="orders-main container">
                <div className="orders-title-section">
                    <h1>Order History</h1>
                </div>

                {orders.length === 0 ? (
                    <div className="empty-orders fade-in">
                        <div className="empty-icon">📦</div>
                        <h2>No orders yet</h2>
                        <p>Looks like you haven't placed any orders. Start shopping today!</p>
                        <button className="shop-now-btn" onClick={() => navigate('/')}>
                            Explore Store
                        </button>
                    </div>
                ) : (
                    <div className="orders-list">
                        {orders.map((order, index) => (
                            <div key={order.id} className="order-card fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                                <div className="order-card-header">
                                    <div className="order-info">
                                        <span className="order-id">Order ID: {order.id}</span>
                                        <span className="order-date">{formatDate(order.date)}</span>
                                    </div>
                                </div>

                                <div className="order-items">
                                    {order.items.map((item, idx) => (
                                        <div key={idx} className="order-item">
                                            <div className="item-image">
                                                <img src={item.image} alt={item.name} />
                                            </div>
                                            <div className="item-details">
                                                <span className="item-name">{item.name}</span>
                                                <span className="item-meta">Size: {item.size} | Qty: {item.quantity}</span>
                                            </div>
                                            <div className="item-price">
                                                ₹{(item.price * item.quantity).toFixed(2)}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="order-card-footer">
                                    <div className="order-total">
                                        <span>Total Amount</span>
                                        <span className="total-price">₹{order.total.toFixed(2)}</span>
                                    </div>
                                    <button className="reorder-btn" onClick={() => navigate('/')}>
                                        Shop More
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    )
}

export default Orders
