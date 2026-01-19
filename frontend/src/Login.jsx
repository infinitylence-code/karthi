import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from './firebase'
import './Auth.css'

function Login({ onLogin }) {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const [errors, setErrors] = useState({})
    const [isLoading, setIsLoading] = useState(false)

    const [showPassword, setShowPassword] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }))
        }
    }

    const validateForm = () => {
        const newErrors = {}

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required'
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid'
        }

        if (!formData.password) {
            newErrors.password = 'Password is required'
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (validateForm()) {
            setIsLoading(true)

            try {
                // Sign in with Firebase Authentication
                const userCredential = await signInWithEmailAndPassword(
                    auth,
                    formData.email,
                    formData.password
                )

                // Create user data from Firebase Auth (works even if Firestore is offline)
                let userData = {
                    id: userCredential.user.uid,
                    name: userCredential.user.displayName || formData.email.split('@')[0],
                    email: userCredential.user.email,
                    createdAt: userCredential.user.metadata.creationTime || new Date().toISOString(),
                    isAdmin: userCredential.user.email.toLowerCase() === import.meta.env.VITE_ADMIN_EMAIL?.toLowerCase()
                }

                // Try to get additional data from Firestore (but don't fail if offline)
                try {
                    const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid))
                    if (userDoc.exists()) {
                        // Merge Firestore data with auth data
                        userData = { ...userData, ...userDoc.data() }
                    }
                } catch (firestoreError) {
                }

                onLogin(userData)
                navigate('/')
            } catch (error) {

                let errorMessage = 'Invalid email or password'

                if (error.code === 'auth/user-not-found') {
                    errorMessage = 'No account found with this email'
                } else if (error.code === 'auth/wrong-password') {
                    errorMessage = 'Incorrect password'
                } else if (error.code === 'auth/invalid-email') {
                    errorMessage = 'Invalid email address'
                } else if (error.code === 'auth/user-disabled') {
                    errorMessage = 'This account has been disabled'
                } else if (error.code === 'auth/invalid-credential') {
                    errorMessage = 'Invalid email or password'
                } else if (error.code === 'auth/operation-not-allowed') {
                    errorMessage = '⚠️ Email/Password authentication is not enabled in Firebase Console!'
                } else if (error.code === 'auth/network-request-failed') {
                    errorMessage = 'Network error. Please check your internet connection.'
                } else if (error.code === 'auth/too-many-requests') {
                    errorMessage = 'Too many failed login attempts. Please try again later.'
                }

                setErrors({ general: errorMessage })
                setIsLoading(false)
            }
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1 className="auth-logo">MIMO</h1>
                    <p className="auth-tagline">LET BE UNIQUE</p>
                    <h2 className="auth-title">Welcome Back</h2>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    {errors.general && (
                        <div className="error-message general-error">
                            {errors.general}
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="email" className="form-label">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className={`form-input ${errors.email ? 'error' : ''}`}
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            autoComplete="email"
                        />
                        {errors.email && <span className="error-message">{errors.email}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="password" className="form-label">Password</label>
                        <div className="password-input-wrapper">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                className={`form-input ${errors.password ? 'error' : ''}`}
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                                autoComplete="current-password"
                            />
                            <button
                                type="button"
                                className="password-toggle-btn"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 19c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                        <line x1="1" y1="1" x2="23" y2="23"></line>
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                        <circle cx="12" cy="12" r="3"></circle>
                                    </svg>
                                )}
                            </button>
                        </div>
                        {errors.password && <span className="error-message">{errors.password}</span>}
                    </div>

                    <button
                        type="submit"
                        className="auth-button"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p className="auth-switch">
                        Don't have an account?{' '}
                        <button
                            type="button"
                            className="auth-link"
                            onClick={() => navigate('/signup')}
                        >
                            Sign up
                        </button>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login
