
# TaskFlow - Task Management Application

## Overview
TaskFlow is a comprehensive task management application built with modern web technologies. It helps teams organize, track, and manage tasks efficiently with features like task assignment, priority setting, and audit logging.

## Core Features

### User Authentication & Authorization
- Secure login and registration system
- Role-based permissions (Admin, Manager, User)
- Profile management with customizable notification preferences

### Task Management
- Create, edit, and delete tasks with detailed information
- Set task priorities (Low, Medium, High)
- Track task status (Todo, In Progress, Review, Done)
- Task assignment to team members
- Due date tracking with visual indicators
- Recurring task support (daily, weekly, monthly)

### Team Collaboration
- Team member directory with role information
- Task assignment and reassignment
- Comment threads on tasks (coming soon)
- Activity feed showing recent changes

### Dashboard & Analytics
- Overview of task status distribution
- Personal task summary
- Team productivity metrics
- Upcoming deadlines visualization
- Performance trends over time

### Audit Logging & History
- Comprehensive audit trail for all system actions
- User activity tracking
- Historical record of task changes
- Detailed timestamps for compliance purposes
- Filterable audit log viewer

### Offline Support
- Progressive Web App (PWA) capabilities
- Service worker implementation for offline access
- Background synchronization when connection is restored
- Local storage for temporary data persistence

### Notification System
- In-app notifications for task updates
- Email notification support (configurable)
- Task due date reminders
- Assignment notifications

### UI/UX Features
- Responsive design for all device sizes
- Dark/light theme support
- Accessible interface following WCAG guidelines
- Intuitive drag-and-drop interfaces
- Keyboard shortcuts for power users

### Technical Architecture
- React front-end with TypeScript for type safety
- Context API for state management
- Service worker for offline capabilities
- Local storage database with IndexedDB
- MongoDB integration (optional)

## Getting Started

### Prerequisites
- Node.js & npm installed

### Local Development
```sh
# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Configuration
Create a `.env` file based on `.env.example` with your configuration:

```
# MongoDB Connection (if using)
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB_NAME=taskflow

# JWT Secret for Authentication
JWT_SECRET=your-secret-key-here

# SMTP Settings for Email Notifications
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASS=your-email-password
SMTP_FROM=noreply@example.com

# App Settings
APP_URL=http://localhost:5173
NODE_ENV=development
```

## Advanced Features

### Audit Logging System
TaskFlow includes a powerful audit logging system that records all significant actions within the application. This feature is particularly useful for:
- Compliance requirements
- Security monitoring
- User activity tracking
- Troubleshooting issues

Administrators can access the audit logs through the dedicated Audit Logs page.

### Debug Mode
For administrators and developers, TaskFlow includes a debug mode that can be activated by pressing `Alt+D`. This mode provides additional tools and information to help diagnose issues in the system.

### Data Import/Export
TaskFlow supports importing and exporting task data in CSV format, making it easy to migrate data or generate reports for external use.

## Browser Support
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)
- Opera (latest version)
