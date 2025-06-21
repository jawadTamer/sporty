# Sportswear Store - Angular Application

A modern e-commerce application built with Angular 17, featuring a responsive design and comprehensive admin dashboard.

## 🚀 Features

- **User Authentication**: Login/Signup with Firebase Auth
- **Product Management**: Browse, search, and filter products
- **Shopping Cart**: Add/remove items with quantity management
- **Admin Dashboard**: Complete CRUD operations for products, users, and orders
- **Responsive Design**: Mobile-first approach with Bootstrap 5
- **Real-time Updates**: Firebase integration for live data
- **Modern UI**: Material Design components with custom styling

## 🛠️ Tech Stack

- **Frontend**: Angular 17
- **UI Framework**: Angular Material + Bootstrap 5
- **Backend**: Firebase (Firestore, Auth, Storage)
- **Styling**: CSS3 with CSS Variables
- **Animations**: AOS (Animate On Scroll)
- **Notifications**: SweetAlert2
- **Deployment**: Netlify

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd sportswear-store
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure Firebase**

   - Create a Firebase project
   - Enable Authentication, Firestore, and Storage
   - Update `src/environments/environment.ts` with your Firebase config

4. **Run development server**
   ```bash
   npm start
   ```

## 🚀 Deployment to Netlify

### Automatic Deployment (Recommended)

1. **Connect to Netlify**

   - Push your code to GitHub/GitLab
   - Connect your repository to Netlify
   - Netlify will automatically detect the build settings from `netlify.toml`

2. **Build Settings** (Auto-configured)
   - Build command: `npm run build`
   - Publish directory: `dist/sportswear-store/browser`

### Manual Deployment

1. **Build the project**

   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Drag and drop the `dist/sportswear-store/browser` folder to Netlify
   - Or use Netlify CLI:
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod --dir=dist/sportswear-store/browser
   ```

## 🔧 Build Configuration

The project is configured for optimal production builds:

- **Bundle Optimization**: Code splitting and lazy loading
- **Asset Optimization**: Compressed images and minified assets
- **Caching**: Proper cache headers for static assets
- **Security**: Security headers configured in Netlify

### Build Budgets

- Initial bundle: 3MB max
- Component styles: 15KB max per component

## 📱 Responsive Design

The application is fully responsive with breakpoints:

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🔐 Environment Variables

For production deployment, ensure these are set in Netlify:

- `NODE_VERSION`: 18.x or higher
- Firebase configuration (already in environment files)

## 🎨 Styling

The application uses a custom color scheme defined in CSS variables:

- Primary colors: Purple/Blue gradient
- Secondary: Light green accents
- Consistent spacing and typography

## 📊 Performance

- **Lighthouse Score**: Optimized for 90+ scores
- **Bundle Size**: Optimized with tree shaking
- **Loading Speed**: Lazy loading for better performance

## 🐛 Troubleshooting

### Common Issues

1. **Build Failures**

   - Ensure Node.js version 18+ is installed
   - Clear npm cache: `npm cache clean --force`
   - Delete node_modules and reinstall: `rm -rf node_modules && npm install`

2. **Styling Issues**

   - Check if all CSS files are properly imported
   - Verify Bootstrap and Material Design are loaded

3. **Firebase Issues**
   - Verify Firebase configuration in environment files
   - Check Firebase console for authentication rules

## 📝 Project Structure

```
src/
├── app/
│   ├── components/          # Reusable components
│   │   ├── auth/           # Authentication pages
│   │   ├── dashboard/      # Admin dashboard
│   │   └── ...
│   └── services/           # API and business logic
├── assets/                 # Static assets
└── environments/           # Environment configurations
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, please open an issue in the repository or contact the development team.

---
