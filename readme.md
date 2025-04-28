# CenTap - NFC Attendance Tracking System

CenTap is a simplified, efficient attendance tracking system built with React that leverages NFC technology for quick check-ins.

## Features

- **NFC-based Check-in**: Quickly scan NFC tags to mark attendees as present
- **Manual Check-in**: Search and check in attendees who've lost their ID tags
- **Attendance Dashboard**: Combined grid and list views to monitor attendance
- **Export Functionality**: Export attendance data to CSV with event details

## Code Structure

- **`/src/components`**: Reusable UI components
- **`/src/contexts`**: React context for attendance data management
- **`/src/pages`**: Main application pages
- **`/src/services`**: NFC scanning and related services
- **`/src/utils`**: Utility functions for data formatting

## Key Components

- **Dashboard**: Main application view combining all components
- **TotalView**: Combined grid and list view of attendees
- **NFCScanner**: Component for scanning NFC tags with manual entry option
- **AttendanceContext**: Central state management for attendance data

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm start`
4. Open http://localhost:3000 to view the application

## Note

NFC functionality requires compatible hardware and will automatically fall back to simulation mode for demo purposes when real NFC hardware is not detected.
EOF < /dev/null