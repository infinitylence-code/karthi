# Karthi Store - Modern E-Commerce Platform

A high-performance, modern e-commerce platform built with React, Vite, and Firebase.

## 🚀 Features

- **Authentication**: Secure user authentication with Firebase Auth
- **Product Management**: Browse, search, and filter products
- **Shopping Cart**: Add items to cart with quantity management
- **Wishlist**: Save favorite items for later
- **User Profile**: Manage account details and preferences
- **Admin Dashboard**: Product upload and user management (admin only)
- **Responsive Design**: Optimized for all devices

## ⚡ Performance Optimizations

This application is optimized for **maximum performance** with Lighthouse scores of 90+:

- ✅ **Async Font Loading** - Non-blocking Google Fonts
- ✅ **Code Splitting** - Lazy-loaded route components
- ✅ **Compression** - Gzip & Brotli compression
- ✅ **Minification** - Terser with aggressive optimization
- ✅ **Image Lazy Loading** - Custom IntersectionObserver implementation
- ✅ **Vendor Chunking** - Optimized caching strategy
- ✅ **CSS Code Splitting** - Per-route CSS bundles

📖 See [PERFORMANCE.md](./PERFORMANCE.md) for detailed optimization guide.

## 🛠️ Tech Stack

- **Frontend**: React 19, React Router DOM
- **Build Tool**: Vite (rolldown-vite)
- **Backend**: Firebase (Auth, Firestore)
- **Styling**: Vanilla CSS with modern design tokens
- **Compression**: vite-plugin-compression

## 📦 Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Firebase credentials
```

## 🔧 Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## 🧪 Testing Performance

### Method 1: Lighthouse in Chrome DevTools
1. Build the project: `npm run build`
2. Preview the build: `npm run preview`
3. Open Chrome DevTools (F12)
4. Go to "Lighthouse" tab
5. Click "Analyze page load"

### Method 2: Lighthouse CLI
```bash
npm install -g lighthouse
npm run build
npm run preview
lighthouse http://localhost:4173 --view
```

## 📊 Expected Performance Metrics

- **Performance**: 90-100
- **Accessibility**: 90-100
- **Best Practices**: 90-100
- **SEO**: 90-100

### Bundle Size (Production)
- **Total JS**: ~475 KB (uncompressed) / ~115 KB (gzip)
- **Total CSS**: ~55 KB (uncompressed) / ~11 KB (gzip)
- **Vendor Chunks**: Separated for optimal caching

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## 📁 Project Structure

```
frontend/
├── public/              # Static assets
├── src/
│   ├── assets/         # Images, fonts, etc.
│   ├── utils/          # Utility functions (LazyImage, etc.)
│   ├── App.jsx         # Main app component
│   ├── Dashboard.jsx   # Product listing page
│   ├── Profile.jsx     # User profile & admin dashboard
│   ├── Cart.jsx        # Shopping cart
│   ├── Wishlist.jsx    # Wishlist page
│   ├── Login.jsx       # Login page
│   ├── Signup.jsx      # Signup page
│   ├── firebase.js     # Firebase configuration
│   └── *.css           # Component styles
├── .env                # Environment variables
├── vite.config.js      # Vite configuration
├── PERFORMANCE.md      # Performance optimization guide
└── package.json        # Dependencies
```

## 🎨 Design System

The application uses a modern design system with:
- **Color Palette**: Cyan/Teal primary colors
- **Typography**: Inter font family
- **Spacing**: Consistent spacing scale
- **Animations**: Smooth transitions and micro-interactions
- **Responsive**: Mobile-first approach

## 🔒 Security

- Environment variables for sensitive data
- Firebase security rules
- Input validation and sanitization
- Secure authentication flow

## 📝 Documentation

- [Authentication Guide](./AUTHENTICATION_GUIDE.md)
- [Performance Guide](./PERFORMANCE.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is private and proprietary.

## 🙏 Acknowledgments

- React Team for React 19
- Vite Team for the amazing build tool
- Firebase for backend services
- Google Fonts for typography

---

Built with ❤️ by Karthi
