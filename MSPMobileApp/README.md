# MSP Automation Solution - Mobile App

A React Native mobile application built with Expo for the MSP (Managed Service Provider) Automation Solution. This app provides technicians and administrators with mobile access to ticket management, system monitoring, and notifications.

## 🚀 Features

### Authentication
- **Secure Login**: Email and password authentication
- **Demo Mode**: Quick access with predefined demo credentials
- **Session Management**: Automatic session handling and logout functionality

### Dashboard
- **System Metrics**: Real-time monitoring of CPU, Memory, and Disk usage
- **Recent Tickets**: Quick overview of the latest support tickets
- **Refresh Capability**: Pull-to-refresh for updated data
- **Visual Indicators**: Color-coded status and priority indicators

### Ticket Management
- **Complete Ticket Listing**: View all support tickets with detailed information
- **Advanced Filtering**: Filter tickets by status (All, Open, In Progress, Resolved, Closed)
- **Search Functionality**: Search tickets by title, description, or client
- **Priority System**: Visual priority badges (High, Medium, Low)
- **Status Tracking**: Real-time status updates with color coding
- **Responsive Design**: Optimized for mobile viewing and interaction

### Notifications Center
- **Real-time Notifications**: Instant alerts for system events and ticket updates
- **Multiple Types**: Support for info, warning, error, success, alert, ticket, and system notifications
- **Priority Levels**: Low, medium, and high priority classification
- **Interactive Management**: Mark notifications as read/unread
- **Delete Functionality**: Remove unwanted notifications
- **Timestamp Display**: Clear time indicators for all notifications

## 🛠 Technology Stack

- **Framework**: React Native with Expo
- **Navigation**: React Navigation (Stack & Bottom Tabs)
- **Language**: TypeScript
- **Styling**: React Native StyleSheet
- **Icons**: Expo Vector Icons
- **State Management**: React Context API
- **Authentication**: Custom authentication context

## 📱 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- Expo Go app (for mobile testing)

### Installation Steps

1. **Navigate to the mobile app directory**:
   ```bash
   cd MSPMobileApp
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```

4. **Run on different platforms**:
   - **Web**: Press `w` or visit `http://localhost:8081`
   - **iOS**: Press `i` (requires iOS Simulator)
   - **Android**: Press `a` (requires Android Emulator)
   - **Mobile Device**: Scan QR code with Expo Go app

## 🔐 Demo Credentials

For testing purposes, use these demo credentials:

### Administrator Account
- **Email**: `admin@msp.com`
- **Password**: `admin123`
- **Role**: Full access to all features

### Technician Account
- **Email**: `tech@msp.com`
- **Password**: `tech123`
- **Role**: Standard technician access

## 📋 Usage Guide

### Getting Started
1. Launch the app and you'll see the login screen
2. Use demo credentials or tap "Use Demo Credentials" for quick access
3. After login, you'll be taken to the Dashboard

### Navigation
- **Dashboard Tab**: System overview and recent tickets
- **Tickets Tab**: Complete ticket management
- **Notifications Tab**: Real-time alerts and updates

### Dashboard Usage
- View system health metrics at the top
- Check recent tickets in the lower section
- Pull down to refresh data
- Tap on tickets to view details

### Ticket Management
- **View All Tickets**: Browse complete ticket list
- **Filter by Status**: Use the filter buttons at the top
- **Search**: Use the search bar to find specific tickets
- **Priority Indicators**: 
  - 🔴 High Priority (Red)
  - 🟡 Medium Priority (Orange)
  - 🟢 Low Priority (Green)
- **Status Colors**:
  - Open: Blue
  - In Progress: Orange
  - Resolved: Green
  - Closed: Gray

### Notifications Management
- **View Notifications**: All notifications appear in chronological order
- **Mark as Read**: Tap on unread notifications to mark them as read
- **Delete**: Swipe or use delete button to remove notifications
- **Priority Indicators**: Visual badges show notification priority
- **Type Icons**: Different icons for different notification types

## 🔧 Development

### Project Structure
```
MSPMobileApp/
├── src/
│   ├── contexts/          # React contexts (Auth, etc.)
│   ├── navigation/        # Navigation configuration
│   ├── screens/          # App screens (Login, Dashboard, etc.)
│   ├── services/         # API services and utilities
│   └── types/            # TypeScript type definitions
├── assets/               # Images, icons, and static assets
├── App.tsx              # Main app component
└── package.json         # Dependencies and scripts
```

### Key Components
- **AuthContext**: Manages user authentication state
- **AppNavigator**: Handles app navigation flow
- **LoginScreen**: User authentication interface
- **DashboardScreen**: System overview and metrics
- **TicketsScreen**: Ticket management interface
- **NotificationsScreen**: Notification center

### API Integration
The app uses a mock API service that simulates real backend interactions:
- User authentication
- Ticket management
- System metrics
- Notifications

## 🚀 Deployment

### Web Deployment
```bash
npx expo export --platform web
```

### Mobile App Store Deployment
1. **Build for iOS**:
   ```bash
   npx expo build:ios
   ```

2. **Build for Android**:
   ```bash
   npx expo build:android
   ```

## 🔍 Testing

The app includes comprehensive testing capabilities:
- Unit tests for components
- Integration tests for user flows
- End-to-end testing support

Run tests with:
```bash
npm test
```

## 📞 Support

For technical support or questions about the mobile app:
- Check the main project documentation
- Review the troubleshooting section
- Contact the development team

## 🔄 Updates

The mobile app is designed to work seamlessly with the main MSP Automation Solution web application, sharing the same data structures and authentication system for a consistent user experience across platforms.

---

**Version**: 1.0.0  
**Last Updated**: January 2025  
**Compatibility**: iOS 11+, Android 6.0+, Web Browsers