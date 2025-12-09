# Ward & Lab Management System

A comprehensive healthcare management system for managing ward directories, critical calls, and add-on test requests.

## Features

### 1. Ward Directory
- Update room and nurse information for each shift
- Bulk update capabilities
- Auto-fill functionality
- Extension number validation
- Daily auto-reset capability (7 AM and 7 PM)

### 2. Critical Call Helper
- Quick search by ward, room, patient ID, or nurse name
- Instant access to nurse extension numbers
- Click-to-call functionality

### 3. Add-On Test Request System
- Submit add-on test requests from wards
- Lab staff can approve/reject requests
- Track request status (pending, approved, rejected, completed)
- Urgent request flagging
- Previous sample tracking

### 4. Analytics Dashboard
- Add-on statistics by ward
- Most requested tests analysis
- Day vs Night shift comparison
- Preventable request tracking
- Top requesters analysis
- Daily trends visualization

## Tech Stack

### Backend
- Python 3.8+
- Flask
- SQLAlchemy
- Flask-JWT-Extended
- SQLite (can be upgraded to PostgreSQL)

### Frontend
- React 18
- Vite
- Tailwind CSS
- React Router
- Axios
- Recharts (for analytics)

## Installation

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

5. Update `.env` with your configuration:
```
DATABASE_URL=sqlite:///ward_lab.db
JWT_SECRET_KEY=your-secret-key-change-in-production
FLASK_ENV=development
```

6. Run the backend server:
```bash
python app.py
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## Default Login

- **Username:** admin
- **Password:** admin123

## User Roles

1. **Admin** - Full access to all features
2. **Charge Nurse** - Can update ward data and request add-ons
3. **Lab Staff** - Can manage add-on requests and use critical call helper
4. **Quality** - Can view analytics and reports

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Ward Directory
- `GET /api/wards` - Get all wards
- `POST /api/wards` - Create ward
- `GET /api/rooms` - Get rooms (with optional ward_id filter)
- `POST /api/rooms/bulk` - Bulk update rooms

### Critical Call
- `GET /api/critical-call/search` - Search for nurse/room information

### Add-On Requests
- `GET /api/addon-requests` - Get requests (with optional status/ward_id filter)
- `POST /api/addon-requests` - Create request
- `POST /api/addon-requests/<id>/approve` - Approve request
- `POST /api/addon-requests/<id>/reject` - Reject request
- `POST /api/addon-requests/<id>/complete` - Mark request as completed

### Analytics
- `GET /api/analytics/addon-stats` - Get add-on statistics
- `GET /api/analytics/addon-trends` - Get daily trends

## Database Schema

The system uses SQLite by default with the following main tables:
- `users` - User accounts and roles
- `wards` - Ward information
- `rooms` - Room and nurse assignments
- `add_on_request` - Add-on test requests
- `add_on_log` - Request action logs

## Future Enhancements

1. **Notifications**
   - Email notifications for new requests
   - SMS notifications via Twilio
   - In-app notifications

2. **Integration**
   - LIS (Laboratory Information System) integration
   - HIS (Hospital Information System) integration
   - WhatsApp API integration

3. **Smart Features**
   - Auto-alerts for excessive add-ons
   - Add-on prevention suggestions
   - QR code generation for quick ward updates

4. **Advanced Analytics**
   - Predictive analytics
   - Custom report generation
   - Export to Excel/PDF

## Development

### Running in Production

1. Set `FLASK_ENV=production` in `.env`
2. Use a production database (PostgreSQL recommended)
3. Set a strong `JWT_SECRET_KEY`
4. Build the frontend: `npm run build`
5. Serve the frontend build with a web server (nginx, Apache, etc.)

### Database Migration

To upgrade to PostgreSQL:
1. Update `DATABASE_URL` in `.env`:
   ```
   DATABASE_URL=postgresql://user:password@localhost/ward_lab
   ```
2. Install PostgreSQL adapter:
   ```bash
   pip install psycopg2-binary
   ```

## License

This project is ready for deployment and can be customized for your organization's needs.

## Support

For questions or issues, please contact your IT department or system administrator.

