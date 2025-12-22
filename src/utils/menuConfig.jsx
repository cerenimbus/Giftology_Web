import React from 'react'
import {
  DashboardIcon,
  ReportsIcon,
  CalendarIcon,
  ContactsIcon,
  HelpIcon,
  FeedbackIcon,
} from '../components/Icons'

/**
 * Shared menu items configuration for all screens
 * This ensures consistency across the application
 */
export const getMenuItems = () => [
  { key: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: <DashboardIcon size={16} color='#e84b4b' /> },
  { key: 'tasks', label: 'Tasks', path: '/tasks', icon: <DashboardIcon size={16} /> },
  { key: 'dov', label: 'DOV & Dates', path: '/dov', icon: <CalendarIcon size={16} /> },
  { key: 'partners', label: 'Potential Partners', path: '/contacts', icon: <ContactsIcon size={16} /> },
  { key: 'reports', label: 'Reports', path: '/reports', icon: <ReportsIcon size={16} /> },
  { key: 'help', label: 'Help', path: '/help', icon: <HelpIcon size={16} /> },
  { key: 'feedback', label: 'Feedback', path: '/feedback', icon: <FeedbackIcon size={16} /> },
  { key: 'setup', label: 'Setup CRM Integration', path: '/setup', icon: <HelpIcon size={16} /> },
  { key: 'logout', label: ' ← Logout' },
]

