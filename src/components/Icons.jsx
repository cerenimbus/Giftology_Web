// RHCM: Created on 2026-01-05
import React from 'react'

const IconWrapper = ({ children, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{display:'inline-block',verticalAlign:'middle'}}>
    {children}
  </svg>
)

export const DashboardIcon = ({ size = 16, color = '#333' }) => (
  <IconWrapper size={size}>
    <rect x="3" y="3" width="7" height="7" fill={color} />
    <rect x="14" y="3" width="7" height="4" fill={color} />
    <rect x="14" y="10" width="7" height="11" fill={color} />
  </IconWrapper>
)

export const ReportsIcon = ({ size = 16, color = '#333' }) => (
  <IconWrapper size={size}>
    <rect x="3" y="5" width="18" height="14" rx="2" stroke={color} fill="none" />
    <path d="M7 9h3v6H7zM12 7h3v8h-3z" fill={color} />
  </IconWrapper>
)

export const CalendarIcon = ({ size = 16, color = '#333' }) => (
  <IconWrapper size={size}>
    <rect x="3" y="5" width="18" height="16" rx="2" stroke={color} fill="none" />
    <path d="M16 3v4M8 3v4" stroke={color} strokeWidth="1.2" />
  </IconWrapper>
)

export const ContactsIcon = ({ size = 16, color = '#333' }) => (
  <IconWrapper size={size}>
    <circle cx="9" cy="8" r="3" fill={color} />
    <path d="M3 20c1.5-4 6-6 9-6s7.5 2 9 6" stroke={color} strokeWidth="1.2" fill="none" />
  </IconWrapper>
)

export const HelpIcon = ({ size = 16, color = '#333' }) => (
  <IconWrapper size={size}>
    <circle cx="12" cy="12" r="9" stroke={color} fill="none" />
    <path d="M9.5 10a2.5 2.5 0 115 0c0 2-2 2-2 4" stroke={color} strokeWidth="1.2" fill="none" />
    <circle cx="12" cy="17" r="1" fill={color} />
  </IconWrapper>
)

export const FeedbackIcon = ({ size = 16, color = '#333' }) => (
  <IconWrapper size={size}>
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke={color} fill="none" />
  </IconWrapper>
)

export default IconWrapper
