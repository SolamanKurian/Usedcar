# PreCar - Used Car Marketplace

A modern web application for buying and selling used cars, built with Next.js, Firebase, and Cloudflare R2.

## Features

- **Landing Page**: Modern, responsive design showcasing the used car marketplace
- **Admin Authentication**: Secure login system using Firebase Auth
- **Admin Dashboard**: Comprehensive dashboard for managing car inventory
- **Image Storage**: Cost-effective image storage using Cloudflare R2
- **Database**: Text data storage using Firebase Firestore
- **Responsive Design**: Mobile-first approach with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore
- **Image Storage**: Cloudflare R2
- **Deployment**: Vercel (recommended)

## Prerequisites

Before running this project, you need to set up:

1. **Firebase Project**:
   - Create a new Firebase project
   - Enable Authentication (Email/Password)
   - Enable Firestore Database
   - Get your Firebase configuration

2. **Cloudflare R2**:
   - Create a Cloudflare account
   - Set up R2 storage
   - Create an API token with R2 permissions
   - Get your R2 credentials

## Installation

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd precar
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env.local` file in the root directory with the following variables:

   ```env
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

   # Cloudflare R2 Configuration
   CLOUDFLARE_ACCOUNT_ID=your_cloudflare_account_id
   CLOUDFLARE_ACCESS_KEY_ID=your_access_key_id
   CLOUDFLARE_SECRET_ACCESS_KEY=your_secret_access_key
   CLOUDFLARE_R2_BUCKET_NAME=your_bucket_name
   CLOUDFLARE_R2_ENDPOINT=https://your_account_id.r2.cloudflarestorage.com
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── admin/             # Admin pages
│   │   ├── login/         # Admin login
│   │   └── page.tsx       # Admin dashboard
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Landing page
├── contexts/              # React contexts
│   └── AuthContext.tsx    # Authentication context
└── lib/                   # Utility libraries
    ├── firebase.ts        # Firebase configuration
    └── cloudflare.ts      # Cloudflare R2 configuration
```

## Firebase Setup

1. **Create a Firebase project**:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Add project"
   - Follow the setup wizard

2. **Enable Authentication**:
   - In Firebase Console, go to Authentication
   - Click "Get started"
   - Enable Email/Password authentication
   - Create an admin user with email and password

3. **Enable Firestore**:
   - In Firebase Console, go to Firestore Database
   - Click "Create database"
   - Choose production mode or test mode
   - Select a location

4. **Get Firebase config**:
   - In Firebase Console, go to Project Settings
   - Scroll down to "Your apps"
   - Click the web app icon
   - Copy the configuration object

## Cloudflare R2 Setup

1. **Create Cloudflare account**:
   - Go to [Cloudflare](https://cloudflare.com/)
   - Sign up for an account

2. **Set up R2 storage**:
   - In Cloudflare Dashboard, go to R2 Object Storage
   - Click "Create bucket"
   - Choose a bucket name and location

3. **Create API token**:
   - Go to "My Profile" > "API Tokens"
   - Click "Create Token"
   - Use "Custom token" template
   - Add R2 permissions for your bucket
   - Copy the token credentials

4. **Get R2 endpoint**:
   - Your R2 endpoint will be: `https://your_account_id.r2.cloudflarestorage.com`

## Usage

### Landing Page
- Visit the homepage to see the landing page
- Navigate through different sections
- Click "Admin Login" to access the admin area

### Admin Login
- Go to `/admin/login`
- Use the Firebase Auth credentials you created
- After successful login, you'll be redirected to the admin dashboard

### Admin Dashboard
- View the main dashboard with various management options
- Access different sections like Cars, Analytics, Settings, etc.
- Use the logout button to sign out

## Development

### Adding New Features
1. Create new pages in the `src/app` directory
2. Add authentication protection where needed
3. Update the navigation and routing
4. Test thoroughly before deployment

### Styling
- The project uses Tailwind CSS for styling
- Custom styles can be added to `src/app/globals.css`
- Follow the existing design patterns for consistency

### Database Operations
- Use Firebase Firestore for data operations
- Follow Firebase security rules best practices
- Implement proper error handling

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms
- The app can be deployed to any platform that supports Next.js
- Make sure to set all environment variables
- Configure proper build settings

## Security Considerations

1. **Environment Variables**: Never commit `.env.local` to version control
2. **Firebase Rules**: Set up proper Firestore security rules
3. **Authentication**: Use strong passwords for admin accounts
4. **CORS**: Configure CORS settings for your domain
5. **API Keys**: Rotate API keys regularly

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Email: info@precar.com
- Create an issue in the GitHub repository

## Roadmap

- [ ] Car listing management
- [ ] Image upload functionality
- [ ] Search and filtering
- [ ] User registration
- [ ] Payment integration
- [ ] Mobile app
- [ ] Analytics dashboard
- [ ] Email notifications
