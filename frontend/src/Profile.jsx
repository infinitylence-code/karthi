import { useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { db } from './firebase'
import './Profile.css'

function Profile({ user, onLogout, onUpdateUser, wishlist = [], cart = [] }) {
    const navigate = useNavigate()
    const fileInputRef = useRef(null)
    const productImageRef = useRef(null)

    // Check if user is admin (either by email or isAdmin field)
    const isAdmin = user.email.toLowerCase() === 'karthi@gmail.com' || user.isAdmin === true

    // Debug logging
    console.log('Profile - User Email:', user.email)
    console.log('Profile - User isAdmin field:', user.isAdmin)
    console.log('Profile - Computed isAdmin:', isAdmin)

    // Tab state
    const [activeTab, setActiveTab] = useState('account')

    // Messages/Orders state
    const [allMessages, setAllMessages] = useState([])
    const [loadingMessages, setLoadingMessages] = useState(false)

    // Admin states
    const [productData, setProductData] = useState({
        name: '',
        category: '',
        description: '',
        sizePricing: {}, // { 'S': 100, 'M': 120, 'L': 150, etc. }
        image: null,
        imagePreview: null
    })
    const [productErrors, setProductErrors] = useState({})
    const [uploadSuccess, setUploadSuccess] = useState(false)

    // User Dashboard states
    const [allUsers, setAllUsers] = useState([])
    const [loadingUsers, setLoadingUsers] = useState(false)


    const handleLogout = () => {
        onLogout()
        navigate('/login')
    }

    const handleBack = () => {
        navigate('/')
    }

    const handleAvatarClick = () => {
        fileInputRef.current.click()
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            if (file.size > 1024 * 1024) { // 1MB limit for Firestore
                alert('Image size is too large. Please select an image under 1MB.')
                return
            }

            const reader = new FileReader()
            reader.onloadend = () => {
                const base64String = reader.result
                onUpdateUser({
                    ...user,
                    profilePhoto: base64String
                })
            }
            reader.readAsDataURL(file)
        }
    }

    const handleProductInputChange = (e) => {
        const { name, value } = e.target
        setProductData(prev => ({
            ...prev,
            [name]: value
        }))
        if (productErrors[name]) {
            setProductErrors(prev => ({ ...prev, [name]: '' }))
        }
    }

    const handleSizePriceChange = (size, price) => {
        setProductData(prev => {
            const newSizePricing = { ...prev.sizePricing }

            if (price === '' || price === null) {
                // Remove size if price is cleared
                delete newSizePricing[size]
            } else {
                // Add or update size with price
                newSizePricing[size] = parseFloat(price)
            }

            if (productErrors.sizePricing && Object.keys(newSizePricing).length > 0) {
                setProductErrors(prev => ({ ...prev, sizePricing: '' }))
            }

            return { ...prev, sizePricing: newSizePricing }
        })
    }

    const handleProductImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            if (file.size > 2 * 1024 * 1024) { // 2MB limit
                alert('Image size is too large. Please select an image under 2MB.')
                return
            }

            const reader = new FileReader()
            reader.onloadend = () => {
                setProductData(prev => ({
                    ...prev,
                    image: reader.result,
                    imagePreview: reader.result
                }))
            }
            reader.readAsDataURL(file)
        }
    }

    const validateProductForm = () => {
        const newErrors = {}
        if (!productData.name.trim()) newErrors.name = 'Product name is required'
        if (!productData.category.trim()) newErrors.category = 'Category is required'
        if (!productData.description.trim()) newErrors.description = 'Description is required'
        if (Object.keys(productData.sizePricing).length === 0) newErrors.sizePricing = 'At least one size with price is required'
        if (!productData.image) newErrors.image = 'Product image is required'

        setProductErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleProductSubmit = async (e) => {
        e.preventDefault()
        if (validateProductForm()) {
            try {
                const newProduct = {
                    id: Date.now().toString(),
                    name: productData.name,
                    category: productData.category,
                    description: productData.description,
                    sizePricing: productData.sizePricing,
                    sizes: Object.keys(productData.sizePricing), // For backward compatibility
                    image: productData.image
                }

                // Save to Firebase Firestore
                const { setDoc, doc } = await import('firebase/firestore')
                await setDoc(doc(db, 'products', newProduct.id), newProduct)

                // Show success message
                setUploadSuccess(true)
                setTimeout(() => setUploadSuccess(false), 3000)

                // Reset form
                setProductData({
                    name: '',
                    category: '',
                    description: '',
                    sizePricing: {},
                    image: null,
                    imagePreview: null
                })
                setProductErrors({})
            } catch (error) {
                console.error('Error uploading product:', error)
                alert('Failed to upload product. Please try again.')
            }
        }
    }

    const getTabTitle = () => {
        switch (activeTab) {
            case 'account': return 'My Account'
            case 'users': return 'User Dashboard'
            case 'admin': return 'Admin Dashboard'
            case 'messages': return 'Messages'
            default: return 'My Account'
        }
    }

    // Fetch all messages/orders from Firebase
    const fetchMessages = async () => {
        setLoadingMessages(true)
        try {
            const { collection, getDocs, query, orderBy } = await import('firebase/firestore')
            const messagesQuery = query(collection(db, 'admin_orders'), orderBy('timestamp', 'desc'))
            const querySnapshot = await getDocs(messagesQuery)
            const messages = []
            querySnapshot.forEach((doc) => {
                messages.push({ id: doc.id, ...doc.data() })
            })
            setAllMessages(messages)
        } catch (error) {
            console.error('Error fetching messages:', error)
            alert('Failed to load messages. Please try again.')
        } finally {
            setLoadingMessages(false)
        }
    }

    // Mark message as done (delete from database)
    const handleMarkAsDone = async (messageId) => {
        if (!confirm('Are you sure you want to mark this order as done? This will remove it from the list.')) {
            return
        }

        try {
            const { doc, deleteDoc } = await import('firebase/firestore')
            await deleteDoc(doc(db, 'admin_orders', messageId))

            // Remove from local state immediately for better UX
            setAllMessages(prevMessages => prevMessages.filter(msg => msg.id !== messageId))

            alert('Order marked as done and removed successfully!')
        } catch (error) {
            console.error('Error deleting message:', error)
            alert('Failed to mark order as done. Please try again.')
        }
    }

    // Load messages when Messages tab is active
    useEffect(() => {
        if (activeTab === 'messages' && isAdmin) {
            fetchMessages()
        }
    }, [activeTab, isAdmin])

    // Fetch all users from Firebase
    const refreshUsers = async () => {
        setLoadingUsers(true)
        try {
            const { collection, getDocs } = await import('firebase/firestore')
            const querySnapshot = await getDocs(collection(db, 'users'))
            const users = []
            querySnapshot.forEach((doc) => {
                users.push({ id: doc.id, ...doc.data() })
            })
            setAllUsers(users)
        } catch (error) {
            console.error('Error fetching users:', error)
            alert('Failed to load users. Please try again.')
        } finally {
            setLoadingUsers(false)
        }
    }

    // Toggle admin status for a user
    const handleToggleAdmin = async (targetUser) => {
        try {
            const { doc, updateDoc } = await import('firebase/firestore')
            const newAdminStatus = !targetUser.isAdmin
            await updateDoc(doc(db, 'users', targetUser.id), {
                isAdmin: newAdminStatus
            })
            // Refresh the users list
            refreshUsers()
            alert(`${targetUser.name} is now ${newAdminStatus ? 'an admin' : 'a regular user'}`)
        } catch (error) {
            console.error('Error toggling admin status:', error)
            alert('Failed to update admin status. Please try again.')
        }
    }

    // Load users when Users tab is active
    useEffect(() => {
        if (activeTab === 'users' && isAdmin) {
            refreshUsers()
        }
    }, [activeTab, isAdmin])


    const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0)

    return (
        <div className="profile-page">
            <div className="profile-page-container">
                <div className="profile-page-header">
                    <div className="header-left">
                        <button
                            className="profile-back-btn"
                            onClick={handleBack}
                            aria-label="Go back"
                        >
                            ← Back
                        </button>
                    </div>
                    <h2 className="profile-page-title">{getTabTitle()}</h2>
                    <div className="header-right"></div>
                </div>

                {/* Admin Tabs */}
                {isAdmin && (
                    <div className="admin-tabs">
                        <button
                            className={`admin-tab ${activeTab === 'account' ? 'active' : ''}`}
                            onClick={() => setActiveTab('account')}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                            My Account
                        </button>

                        <button
                            className={`admin-tab ${activeTab === 'admin' ? 'active' : ''}`}
                            onClick={() => setActiveTab('admin')}
                        >

                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                            Admin Dashboard
                        </button>

                        <button
                            className={`admin-tab ${activeTab === 'messages' ? 'active' : ''}`}
                            onClick={() => setActiveTab('messages')}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                            </svg>
                            Messages
                        </button>
                    </div>
                )
                }

                <div className="profile-page-content">
                    {/* My Account Tab */}
                    {activeTab === 'account' && (
                        <>
                            {/* Profile Avatar */}
                            <div className="profile-avatar-section">
                                <div
                                    className="profile-avatar adjustable"
                                    onClick={handleAvatarClick}
                                    title="Click to change profile photo"
                                >
                                    {user.profilePhoto ? (
                                        <img src={user.profilePhoto} alt={user.name} className="profile-avatar-img" />
                                    ) : (
                                        <span className="profile-avatar-icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                                <circle cx="12" cy="7" r="4"></circle>
                                            </svg>
                                        </span>
                                    )}
                                    <div className="avatar-edit-overlay">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                                            <circle cx="12" cy="13" r="4"></circle>
                                        </svg>
                                    </div>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                    />
                                </div>
                                <h3 className="profile-user-name">{user.name}</h3>
                                <p className="profile-user-email">{user.email}</p>
                                {isAdmin && <span className="admin-badge">Admin</span>}
                            </div>

                            {/* Account Information */}
                            <div className="profile-section">
                                <h4 className="profile-section-title">Account Information</h4>
                                <div className="profile-info-grid">
                                    <div className="profile-info-item">
                                        <span className="profile-info-label">Full Name</span>
                                        <span className="profile-info-value">{user.name}</span>
                                    </div>
                                    <div className="profile-info-item">
                                        <span className="profile-info-label">Email Address</span>
                                        <span className="profile-info-value">{user.email}</span>
                                    </div>
                                    <div className="profile-info-item">
                                        <span className="profile-info-label">Account ID</span>
                                        <span className="profile-info-value">#{user.id}</span>
                                    </div>
                                    <div className="profile-info-item">
                                        <span className="profile-info-label">Member Since</span>
                                        <span className="profile-info-value">
                                            {new Date(user.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Stats */}
                            <div className="profile-section">
                                <h4 className="profile-section-title">Quick Stats</h4>
                                <div className="profile-stats-grid">
                                    <div
                                        className="profile-stat-card clickable"
                                        onClick={() => navigate('/cart')}
                                        title="View Cart"
                                    >
                                        <div className="profile-stat-icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <circle cx="9" cy="21" r="1"></circle>
                                                <circle cx="20" cy="21" r="1"></circle>
                                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                                            </svg>
                                        </div>
                                        <div className="profile-stat-info">
                                            <span className="profile-stat-value">{cartItemsCount}</span>
                                            <span className="profile-stat-label">Cart Items</span>
                                        </div>
                                    </div>
                                    <div
                                        className="profile-stat-card clickable"
                                        onClick={() => navigate('/wishlist')}
                                        title="View Wishlist"
                                    >
                                        <div className="profile-stat-icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                            </svg>
                                        </div>
                                        <div className="profile-stat-info">
                                            <span className="profile-stat-value">{wishlist.length}</span>
                                            <span className="profile-stat-label">Wishlist Items</span>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            {/* Account Actions */}
                            <div className="profile-section">
                                <h4 className="profile-section-title">Account Actions</h4>
                                <div className="profile-actions">

                                    <button
                                        className="profile-action-btn secondary"
                                        onClick={() => navigate('/orders')}
                                    >
                                        <span className="profile-action-icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                                                <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                                                <line x1="12" y1="22.08" x2="12" y2="12"></line>
                                            </svg>
                                        </span>
                                        Order History
                                    </button>
                                    <button
                                        className="profile-action-btn danger"
                                        onClick={handleLogout}
                                    >
                                        <span className="profile-action-icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                                <polyline points="16 17 21 12 16 7"></polyline>
                                                <line x1="21" y1="12" x2="9" y2="12"></line>
                                            </svg>
                                        </span>
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </>
                    )}

                    {/* User Dashboard Tab */}
                    {activeTab === 'users' && isAdmin && (
                        <div className="admin-section">
                            <div className="admin-section-header">
                                <h4 className="profile-section-title">All Registered Users</h4>
                                <button className="refresh-btn" onClick={refreshUsers}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="23 4 23 10 17 10"></polyline>
                                        <polyline points="1 20 1 14 7 14"></polyline>
                                        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                                    </svg>
                                    Refresh
                                </button>
                            </div>
                            <div className="users-table-container">
                                {loadingUsers ? (
                                    <div className="loading-users">
                                        <svg className="spinner" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="12" cy="12" r="10"></circle>
                                        </svg>
                                        <p>Loading users from Firebase...</p>
                                    </div>
                                ) : allUsers.length === 0 ? (
                                    <div className="no-users">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                            <circle cx="9" cy="7" r="4"></circle>
                                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                        </svg>
                                        <p>No users registered yet</p>
                                    </div>
                                ) : (
                                    <table className="users-table">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Name</th>
                                                <th>Email</th>
                                                <th>Joined Date</th>
                                                <th>Status</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {allUsers.map((u, index) => {
                                                const userIsAdmin = u.email.toLowerCase() === 'karthi@gmail.com' || u.isAdmin === true
                                                return (
                                                    <tr key={u.id || index}>
                                                        <td>#{u.id}</td>
                                                        <td>
                                                            <div className="user-name-cell">
                                                                {u.profilePhoto ? (
                                                                    <img src={u.profilePhoto} alt={u.name} className="user-table-avatar" />
                                                                ) : (
                                                                    <div className="user-table-avatar-placeholder">
                                                                        {u.name.charAt(0).toUpperCase()}
                                                                    </div>
                                                                )}
                                                                {u.name}
                                                            </div>
                                                        </td>
                                                        <td>{u.email}</td>
                                                        <td>
                                                            {new Date(u.createdAt).toLocaleDateString('en-US', {
                                                                year: 'numeric',
                                                                month: 'short',
                                                                day: 'numeric'
                                                            })}
                                                        </td>
                                                        <td>
                                                            <span className={`status-badge ${userIsAdmin ? 'admin' : 'active'}`}>
                                                                {userIsAdmin ? 'Admin' : 'Active'}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            {u.email.toLowerCase() !== 'karthi@gmail.com' && (
                                                                <button
                                                                    className={`admin-toggle-btn ${userIsAdmin ? 'remove' : 'make'}`}
                                                                    onClick={() => handleToggleAdmin(u)}
                                                                    title={userIsAdmin ? 'Remove Admin' : 'Make Admin'}
                                                                >
                                                                    {userIsAdmin ? (
                                                                        <>
                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                                <polyline points="3 6 5 6 21 6"></polyline>
                                                                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                                            </svg>
                                                                            Remove Admin
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                                                                            </svg>
                                                                            Make Admin
                                                                        </>
                                                                    )}
                                                                </button>
                                                            )
                                                            }
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div >
                    )}

                    {/* Admin Dashboard Tab */}
                    {
                        activeTab === 'admin' && isAdmin && (
                            <div className="admin-section">
                                <h4 className="profile-section-title">Upload New Product</h4>
                                {uploadSuccess && (
                                    <div className="success-message">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                        Product uploaded successfully!
                                    </div>
                                )}
                                <form onSubmit={handleProductSubmit} className="product-form">
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Product Name *</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={productData.name}
                                                onChange={handleProductInputChange}
                                                className={productErrors.name ? 'error' : ''}
                                                placeholder="e.g., Classic White Shirt"
                                            />
                                            {productErrors.name && <span className="error-text">{productErrors.name}</span>}
                                        </div>
                                        <div className="form-group">
                                            <label>Category *</label>
                                            <input
                                                type="text"
                                                name="category"
                                                value={productData.category}
                                                onChange={handleProductInputChange}
                                                className={productErrors.category ? 'error' : ''}
                                                placeholder="e.g., Shirts, Accessories"
                                            />
                                            {productErrors.category && <span className="error-text">{productErrors.category}</span>}
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label>Description *</label>
                                        <textarea
                                            name="description"
                                            value={productData.description}
                                            onChange={handleProductInputChange}
                                            className={`profile-edit-input ${productErrors.description ? 'error' : ''}`}
                                            placeholder="Enter product description..."
                                            rows="4"
                                        />
                                        {productErrors.description && <span className="error-text">{productErrors.description}</span>}
                                    </div>

                                    <div className="form-group">
                                        <label>Available Sizes & Prices *</label>
                                        <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1rem' }}>
                                            Enter a price for each size you want to offer. Leave blank to exclude a size.
                                        </p>
                                        <div className="size-pricing-grid">
                                            {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => (
                                                <div key={size} className="size-price-input-group">
                                                    <label className="size-label">{size}</label>
                                                    <div className="price-input-wrapper">
                                                        <span className="currency-symbol">₹</span>
                                                        <input
                                                            type="number"
                                                            value={productData.sizePricing[size] || ''}
                                                            onChange={(e) => handleSizePriceChange(size, e.target.value)}
                                                            placeholder="0.00"
                                                            step="0.01"
                                                            min="0"
                                                            className="size-price-input"
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        {productErrors.sizePricing && <span className="error-text">{productErrors.sizePricing}</span>}
                                    </div>

                                    <div className="form-group">
                                        <label>Product Image *</label>
                                        <div className="image-upload-container">
                                            <input
                                                type="file"
                                                ref={productImageRef}
                                                onChange={handleProductImageChange}
                                                accept="image/*"
                                                style={{ display: 'none' }}
                                            />
                                            <button
                                                type="button"
                                                className="image-upload-btn"
                                                onClick={() => productImageRef.current.click()}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                                    <polyline points="21 15 16 10 5 21"></polyline>
                                                </svg>
                                                {productData.imagePreview ? 'Change Image' : 'Upload Image'}
                                            </button>
                                            {productData.imagePreview && (
                                                <div className="image-preview">
                                                    <img src={productData.imagePreview} alt="Product preview" />
                                                </div>
                                            )}
                                        </div>
                                        {productErrors.image && <span className="error-text">{productErrors.image}</span>}
                                    </div>

                                    <div className="form-actions">
                                        <button type="submit" className="submit-product-btn">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                                <polyline points="17 8 12 3 7 8"></polyline>
                                                <line x1="12" y1="3" x2="12" y2="15"></line>
                                            </svg>
                                            Upload Product
                                        </button>
                                        <button
                                            type="button"
                                            className="reset-product-btn"
                                            onClick={() => {
                                                setProductData({
                                                    name: '',
                                                    category: '',
                                                    price: '',
                                                    description: '',
                                                    sizes: [],
                                                    image: null,
                                                    imagePreview: null
                                                })
                                                setProductErrors({})
                                            }}
                                        >
                                            Reset Form
                                        </button>
                                    </div>
                                </form >
                            </div >
                        )
                    }

                    {/* Messages Tab */}
                    {activeTab === 'messages' && isAdmin && (
                        <div className="admin-section">
                            <div className="admin-section-header">
                                <h4 className="profile-section-title">Order Messages</h4>
                                <button className="refresh-btn" onClick={fetchMessages}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="23 4 23 10 17 10"></polyline>
                                        <polyline points="1 20 1 14 7 14"></polyline>
                                        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                                    </svg>
                                    Refresh
                                </button>
                            </div>

                            <div className="messages-container">
                                {loadingMessages ? (
                                    <div className="loading-users">
                                        <svg className="spinner" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="12" cy="12" r="10"></circle>
                                        </svg>
                                        <p>Loading messages from Firebase...</p>
                                    </div>
                                ) : allMessages.length === 0 ? (
                                    <div className="no-users">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                                        </svg>
                                        <p>No messages yet</p>
                                    </div>
                                ) : (
                                    <div className="messages-list">
                                        {allMessages.map((message, index) => (
                                            <div key={message.id || index} className="message-card">
                                                <div className="message-header">
                                                    <div className="message-info">
                                                        <h5 className="message-customer-name">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                                                <circle cx="12" cy="7" r="4"></circle>
                                                            </svg>
                                                            {message.customer?.name || 'Unknown Customer'}
                                                        </h5>
                                                        <p className="message-customer-email">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                                                <polyline points="22,6 12,13 2,6"></polyline>
                                                            </svg>
                                                            {message.customer?.email || 'No email'}
                                                        </p>
                                                    </div>
                                                    <div className="message-timestamp">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <circle cx="12" cy="12" r="10"></circle>
                                                            <polyline points="12 6 12 12 16 14"></polyline>
                                                        </svg>
                                                        {message.timestamp ? new Date(message.timestamp).toLocaleString('en-US', {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        }) : 'No date'}
                                                    </div>
                                                </div>

                                                <div className="message-body">
                                                    <div className="message-section">
                                                        <h6 className="message-section-title">Order Items</h6>
                                                        <div className="message-items">
                                                            {message.items && message.items.length > 0 ? (
                                                                message.items.map((item, idx) => (
                                                                    <div key={idx} className="message-item">
                                                                        {item.image && (
                                                                            <img src={item.image} alt={item.name} className="message-item-image" />
                                                                        )}
                                                                        <div className="message-item-details">
                                                                            <p className="message-item-name">{item.name}</p>
                                                                            <p className="message-item-meta">
                                                                                Size: {item.size} | Qty: {item.quantity} | ₹{(item.price * item.quantity).toFixed(2)}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                ))
                                                            ) : (
                                                                <p className="no-items">No items in this order</p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="message-section">
                                                        <h6 className="message-section-title">Shipping Address</h6>
                                                        {message.shippingAddress ? (
                                                            <div className="message-address">
                                                                <p><strong>{message.shippingAddress.fullName}</strong></p>
                                                                <p>{message.shippingAddress.street}</p>
                                                                <p>{message.shippingAddress.city}, {message.shippingAddress.state} - {message.shippingAddress.zipCode}</p>
                                                                <p>Phone: {message.shippingAddress.phone}</p>
                                                            </div>
                                                        ) : (
                                                            <p className="no-address">No shipping address provided</p>
                                                        )}
                                                    </div>

                                                    <div className="message-total">
                                                        <span className="message-total-label">Total Amount:</span>
                                                        <span className="message-total-value">₹{message.total?.toFixed(2) || '0.00'}</span>
                                                    </div>

                                                    <div className="message-actions">
                                                        <button
                                                            className="message-done-btn"
                                                            onClick={() => handleMarkAsDone(message.id)}
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                <polyline points="20 6 9 17 4 12"></polyline>
                                                            </svg>
                                                            Mark as Done
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div >
            </div >


        </div >
    )
}

export default Profile
