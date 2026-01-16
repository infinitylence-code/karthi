import { useState, useEffect, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { doc, getDoc, updateDoc, collection, onSnapshot, setDoc, getDocs, query, orderBy, deleteField } from 'firebase/firestore'
import { auth, db } from './firebase'
import './App.css'
import Login from './Login'
import Signup from './Signup'
import LoadingSpinner from './LoadingSpinner'

// Lazy load heavy components for better performance with prefetch
const Dashboard = lazy(() => import(/* webpackPrefetch: true */ './Dashboard'))
const Profile = lazy(() => import(/* webpackPrefetch: true */ './Profile'))
const Wishlist = lazy(() => import(/* webpackPrefetch: true */ './Wishlist'))
const Cart = lazy(() => import(/* webpackPrefetch: true */ './Cart'))
const Payment = lazy(() => import(/* webpackPrefetch: true */ './Payment'))
const Orders = lazy(() => import(/* webpackPrefetch: true */ './Orders'))
const CheckoutAddress = lazy(() => import(/* webpackPrefetch: true */ './CheckoutAddress'))


// Import generated product images


function App() {
  const [currentUser, setCurrentUser] = useState(null)
  const [authView, setAuthView] = useState('login')
  const [wishlist, setWishlist] = useState([])
  const [cart, setCart] = useState([])
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  // Listen for products from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'products'), (snapshot) => {
      const productsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setProducts(productsData)
    }, (error) => {
      console.error("Error fetching products:", error)
    })

    return () => unsubscribe()
  }, [])

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in - create basic user data from auth
        let userData = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
          email: firebaseUser.email,
          createdAt: firebaseUser.metadata.creationTime || new Date().toISOString(),
          isAdmin: firebaseUser.email.toLowerCase() === 'karthi@gmail.com'
        }

        // Try to enhance with Firestore data
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
          if (userDoc.exists()) {
            const data = userDoc.data()
            userData = { ...userData, ...data }
            // Load saved data explicitly
            if (data.wishlist) setWishlist(data.wishlist)
            if (data.cart) setCart(data.cart)

            // Cleanup: remove orders from main doc if they exist to fix 1MB error
            if (data.orders) {
              await updateDoc(doc(db, 'users', firebaseUser.uid), {
                orders: deleteField()
              });
            }

            // Load orders from sub-collection (Scalable)
            const ordersRef = collection(db, 'users', firebaseUser.uid, 'orders')
            const q = query(ordersRef, orderBy('date', 'desc'))
            const ordersSnap = await getDocs(q)
            const ordersData = ordersSnap.docs.map(doc => doc.data())
            setOrders(ordersData)
          }
        } catch (error) {
          console.warn('Firestore unavailable, using auth data:', error)
        }

        setCurrentUser(userData)
      } else {
        // User is signed out
        setCurrentUser(null)
      }
      setLoading(false)
    })

    // Cleanup subscription
    return () => unsubscribe()
  }, [])

  // Sync Wishlist to Firestore
  useEffect(() => {
    const syncWishlist = async () => {
      if (currentUser?.id && wishlist.length >= 0) {
        try {
          await updateDoc(doc(db, 'users', currentUser.id), { wishlist })
        } catch (error) {
          console.error("Error syncing wishlist:", error)
        }
      }
    }
    syncWishlist()
  }, [wishlist, currentUser?.id])

  // Sync Cart to Firestore
  useEffect(() => {
    const syncCart = async () => {
      if (currentUser?.id && cart.length >= 0) {
        try {
          await updateDoc(doc(db, 'users', currentUser.id), { cart })
        } catch (error) {
          console.error("Error syncing cart:", error)
        }
      }
    }
    syncCart()
  }, [cart, currentUser?.id])

  // Orders sync is now handled document-by-document in addOrder to prevent 1MB limit errors


  // Authentication handlers
  const handleLogin = (user) => {
    setCurrentUser({ ...user })
  }

  const handleSignup = (user) => {
    setCurrentUser({ ...user })
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
      setCurrentUser(null)
      setCart([])
      setWishlist([])
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  // PERMANENT STORAGE HANDLERS
  const updateWishlist = async (updates) => {
    // 1. Calculate new state (handle functional updates)
    const newWishlist = typeof updates === 'function' ? updates(wishlist) : updates

    // 2. Update local state
    setWishlist(newWishlist)

    // 3. Save to Firestore
    if (currentUser?.id) {
      try {
        await updateDoc(doc(db, 'users', currentUser.id), {
          wishlist: newWishlist
        })
      } catch (error) {
        console.error("Error saving wishlist:", error)
      }
    }
  }

  const updateCart = async (updates) => {
    // 1. Calculate new state (handle functional updates)
    const newCart = typeof updates === 'function' ? updates(cart) : updates

    // 2. Update local state
    setCart(newCart)

    // 3. Save to Firestore
    if (currentUser?.id) {
      try {
        await updateDoc(doc(db, 'users', currentUser.id), {
          cart: newCart
        })
      } catch (error) {
        console.error("Error saving cart:", error)
      }
    }
  }

  const addOrder = async (orderData) => {
    const orderId = `ORD-${Date.now()}`
    const newOrder = {
      id: orderId,
      date: new Date().toISOString(),
      status: 'Processing',
      ...orderData
    }

    // Update local state
    setOrders(prev => [newOrder, ...prev])

    // Save to Firestore sub-collection (Scalable - No 1MB Limit)
    if (currentUser?.id) {
      try {
        await setDoc(doc(db, 'users', currentUser.id, 'orders', orderId), newOrder)
      } catch (error) {
        console.error("Error saving order to sub-collection:", error)
      }
    }
  }

  const handleUpdateUser = async (updatedUser) => {
    // 1. Update current session state
    setCurrentUser({ ...updatedUser })

    // 2. Update the user in Firestore
    try {
      await updateDoc(doc(db, 'users', updatedUser.id), updatedUser)
    } catch (error) {
      console.error('Error updating user in Firestore:', error)
    }
  }

  // Show loading state while checking auth
  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Auth Routes */}
          <Route
            path="/login"
            element={
              currentUser ? (
                <Navigate to="/" replace />
              ) : (
                <Login onLogin={handleLogin} />
              )
            }
          />
          <Route
            path="/signup"
            element={
              currentUser ? (
                <Navigate to="/" replace />
              ) : (
                <Signup onSignup={handleSignup} />
              )
            }
          />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              currentUser ? (
                <Dashboard
                  products={products}
                  currentUser={currentUser}
                  onLogout={handleLogout}
                  wishlist={wishlist}
                  setWishlist={updateWishlist}
                  cart={cart}
                  setCart={updateCart}
                />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/profile"
            element={
              currentUser ? (
                <Profile
                  user={currentUser}
                  onLogout={handleLogout}
                  onUpdateUser={handleUpdateUser}
                  wishlist={wishlist}
                  cart={cart}
                />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/wishlist"
            element={
              currentUser ? (
                <Wishlist
                  products={products}
                  currentUser={currentUser}
                  wishlist={wishlist}
                  setWishlist={updateWishlist}
                  cart={cart}
                  setCart={updateCart}
                />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/cart"
            element={
              currentUser ? (
                <Cart
                  products={products}
                  currentUser={currentUser}
                  wishlist={wishlist}
                  setWishlist={updateWishlist}
                  cart={cart}
                  setCart={updateCart}
                />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/checkout/address"
            element={
              currentUser ? (
                <CheckoutAddress
                  currentUser={currentUser}
                  cart={cart}
                  products={products}
                />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/payment"
            element={
              currentUser ? (
                <Payment
                  cart={cart}
                  setCart={updateCart}
                  products={products}
                  currentUser={currentUser}
                  addOrder={addOrder}
                />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/orders"
            element={
              currentUser ? (
                <Orders
                  orders={orders}
                  products={products}
                  currentUser={currentUser}
                />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
