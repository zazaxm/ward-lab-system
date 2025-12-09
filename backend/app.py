from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash, check_password_hash
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///ward_lab.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'your-secret-key-change-in-production')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=8)

db = SQLAlchemy(app)
jwt = JWTManager(app)
CORS(app)

# Database Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(50), nullable=False)  # admin, charge_nurse, lab_staff, quality
    name = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Ward(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Room(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    ward_id = db.Column(db.Integer, db.ForeignKey('ward.id'), nullable=False)
    room_number = db.Column(db.String(20), nullable=False)
    patient_name = db.Column(db.String(100))
    patient_id = db.Column(db.String(50))
    primary_nurse_name = db.Column(db.String(100), nullable=False)
    primary_nurse_extension = db.Column(db.String(20), nullable=False)
    backup_nurse_name = db.Column(db.String(100))
    backup_nurse_extension = db.Column(db.String(20))
    charge_nurse_name = db.Column(db.String(100))
    notes = db.Column(db.Text)
    shift_type = db.Column(db.String(20))  # day, night
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    updated_by = db.Column(db.Integer, db.ForeignKey('user.id'))
    
    ward = db.relationship('Ward', backref=db.backref('rooms', lazy=True))

class AddOnRequest(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    ward_id = db.Column(db.Integer, db.ForeignKey('ward.id'), nullable=False)
    room_id = db.Column(db.Integer, db.ForeignKey('room.id'))
    room_number = db.Column(db.String(20), nullable=False)
    patient_id = db.Column(db.String(50), nullable=False)
    requested_test = db.Column(db.String(200), nullable=False)
    reason = db.Column(db.Text, nullable=False)
    is_urgent = db.Column(db.Boolean, default=False)
    has_previous_sample = db.Column(db.Boolean, default=False)
    previous_sample_id = db.Column(db.String(50))
    additional_comment = db.Column(db.Text)
    status = db.Column(db.String(20), default='pending')  # pending, approved, rejected, completed
    rejection_reason = db.Column(db.Text)
    approval_action = db.Column(db.String(50))  # add_to_same_sample, need_new_sample
    requested_by = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    reviewed_by = db.Column(db.Integer, db.ForeignKey('user.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    reviewed_at = db.Column(db.DateTime)
    completed_at = db.Column(db.DateTime)
    
    ward = db.relationship('Ward', backref=db.backref('addon_requests', lazy=True))
    room = db.relationship('Room', backref=db.backref('addon_requests', lazy=True))
    requester = db.relationship('User', foreign_keys=[requested_by], backref='addon_requests_made')
    reviewer = db.relationship('User', foreign_keys=[reviewed_by], backref='addon_requests_reviewed')

class AddOnLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    request_id = db.Column(db.Integer, db.ForeignKey('add_on_request.id'), nullable=False)
    action = db.Column(db.String(50), nullable=False)
    performed_by = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    notes = db.Column(db.Text)
    
    request = db.relationship('AddOnRequest', backref=db.backref('logs', lazy=True))
    user = db.relationship('User', backref=db.backref('addon_logs', lazy=True))

# Root route
@app.route('/')
def root():
    return jsonify({
        'message': 'Ward & Lab Management System API',
        'status': 'running',
        'version': '1.0.0',
        'endpoints': {
            'auth': '/api/auth/login',
            'wards': '/api/wards',
            'rooms': '/api/rooms',
            'addon_requests': '/api/addon-requests',
            'critical_call': '/api/critical-call/search',
            'analytics': '/api/analytics/addon-stats'
        }
    }), 200

# Auth Routes
@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.json
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'error': 'Username already exists'}), 400
    
    user = User(
        username=data['username'],
        email=data['email'],
        password_hash=generate_password_hash(data['password']),
        role=data['role'],
        name=data['name']
    )
    db.session.add(user)
    db.session.commit()
    
    access_token = create_access_token(identity=user.id)
    return jsonify({
        'access_token': access_token,
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'role': user.role,
            'name': user.name
        }
    }), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(username=data['username']).first()
    
    if user and check_password_hash(user.password_hash, data['password']):
        access_token = create_access_token(identity=user.id)
        return jsonify({
            'access_token': access_token,
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'role': user.role,
                'name': user.name
            }
        }), 200
    
    return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/api/auth/me', methods=['GET'])
@jwt_required()
def get_current_user():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'role': user.role,
        'name': user.name
    }), 200

# Ward Directory Routes
@app.route('/api/wards', methods=['GET'])
@jwt_required()
def get_wards():
    wards = Ward.query.all()
    return jsonify([{'id': w.id, 'name': w.name} for w in wards]), 200

@app.route('/api/wards', methods=['POST'])
@jwt_required()
def create_ward():
    data = request.json
    ward = Ward(name=data['name'])
    db.session.add(ward)
    db.session.commit()
    return jsonify({'id': ward.id, 'name': ward.name}), 201

@app.route('/api/rooms', methods=['GET'])
@jwt_required()
def get_rooms():
    ward_id = request.args.get('ward_id')
    query = Room.query
    if ward_id:
        query = query.filter_by(ward_id=ward_id)
    
    rooms = query.all()
    return jsonify([{
        'id': r.id,
        'ward_id': r.ward_id,
        'ward_name': r.ward.name,
        'room_number': r.room_number,
        'patient_name': r.patient_name,
        'patient_id': r.patient_id,
        'primary_nurse_name': r.primary_nurse_name,
        'primary_nurse_extension': r.primary_nurse_extension,
        'backup_nurse_name': r.backup_nurse_name,
        'backup_nurse_extension': r.backup_nurse_extension,
        'charge_nurse_name': r.charge_nurse_name,
        'notes': r.notes,
        'shift_type': r.shift_type,
        'updated_at': r.updated_at.isoformat() if r.updated_at else None
    } for r in rooms]), 200

@app.route('/api/rooms/bulk', methods=['POST'])
@jwt_required()
def bulk_update_rooms():
    user_id = get_jwt_identity()
    data = request.json
    rooms_data = data['rooms']
    
    for room_data in rooms_data:
        if room_data.get('id'):
            room = Room.query.get(room_data['id'])
            if room:
                room.ward_id = room_data['ward_id']
                room.room_number = room_data['room_number']
                room.patient_name = room_data.get('patient_name')
                room.patient_id = room_data.get('patient_id')
                room.primary_nurse_name = room_data['primary_nurse_name']
                room.primary_nurse_extension = room_data['primary_nurse_extension']
                room.backup_nurse_name = room_data.get('backup_nurse_name')
                room.backup_nurse_extension = room_data.get('backup_nurse_extension')
                room.charge_nurse_name = room_data.get('charge_nurse_name')
                room.notes = room_data.get('notes')
                room.shift_type = room_data.get('shift_type', 'day')
                room.updated_by = user_id
                room.updated_at = datetime.utcnow()
        else:
            room = Room(
                ward_id=room_data['ward_id'],
                room_number=room_data['room_number'],
                patient_name=room_data.get('patient_name'),
                patient_id=room_data.get('patient_id'),
                primary_nurse_name=room_data['primary_nurse_name'],
                primary_nurse_extension=room_data['primary_nurse_extension'],
                backup_nurse_name=room_data.get('backup_nurse_name'),
                backup_nurse_extension=room_data.get('backup_nurse_extension'),
                charge_nurse_name=room_data.get('charge_nurse_name'),
                notes=room_data.get('notes'),
                shift_type=room_data.get('shift_type', 'day'),
                updated_by=user_id
            )
            db.session.add(room)
    
    db.session.commit()
    return jsonify({'message': 'Rooms updated successfully'}), 200

# Critical Call Helper Routes
@app.route('/api/critical-call/search', methods=['GET'])
@jwt_required()
def search_critical_call():
    query = request.args.get('q', '')
    ward_id = request.args.get('ward_id')
    search_type = request.args.get('type', 'all')  # ward, room, patient, nurse
    
    rooms_query = Room.query
    
    if ward_id:
        rooms_query = rooms_query.filter_by(ward_id=ward_id)
    
    if search_type == 'ward':
        rooms_query = rooms_query.join(Ward).filter(Ward.name.ilike(f'%{query}%'))
    elif search_type == 'room':
        rooms_query = rooms_query.filter(Room.room_number.ilike(f'%{query}%'))
    elif search_type == 'patient':
        rooms_query = rooms_query.filter(
            (Room.patient_id.ilike(f'%{query}%')) | 
            (Room.patient_name.ilike(f'%{query}%'))
        )
    elif search_type == 'nurse':
        rooms_query = rooms_query.filter(
            (Room.primary_nurse_name.ilike(f'%{query}%')) |
            (Room.backup_nurse_name.ilike(f'%{query}%'))
        )
    else:
        rooms_query = rooms_query.filter(
            (Room.room_number.ilike(f'%{query}%')) |
            (Room.patient_id.ilike(f'%{query}%')) |
            (Room.patient_name.ilike(f'%{query}%')) |
            (Room.primary_nurse_name.ilike(f'%{query}%')) |
            (Room.backup_nurse_name.ilike(f'%{query}%'))
        )
    
    rooms = rooms_query.limit(50).all()
    return jsonify([{
        'id': r.id,
        'ward_name': r.ward.name,
        'room_number': r.room_number,
        'patient_name': r.patient_name,
        'patient_id': r.patient_id,
        'primary_nurse_name': r.primary_nurse_name,
        'primary_nurse_extension': r.primary_nurse_extension,
        'backup_nurse_name': r.backup_nurse_name,
        'backup_nurse_extension': r.backup_nurse_extension,
        'charge_nurse_name': r.charge_nurse_name,
        'updated_at': r.updated_at.isoformat() if r.updated_at else None
    } for r in rooms]), 200

# Add-On Request Routes
@app.route('/api/addon-requests', methods=['GET'])
@jwt_required()
def get_addon_requests():
    status = request.args.get('status')
    ward_id = request.args.get('ward_id')
    
    query = AddOnRequest.query
    
    if status:
        query = query.filter_by(status=status)
    if ward_id:
        query = query.filter_by(ward_id=ward_id)
    
    requests = query.order_by(AddOnRequest.created_at.desc()).all()
    return jsonify([{
        'id': r.id,
        'ward_id': r.ward_id,
        'ward_name': r.ward.name,
        'room_id': r.room_id,
        'room_number': r.room_number,
        'patient_id': r.patient_id,
        'requested_test': r.requested_test,
        'reason': r.reason,
        'is_urgent': r.is_urgent,
        'has_previous_sample': r.has_previous_sample,
        'previous_sample_id': r.previous_sample_id,
        'additional_comment': r.additional_comment,
        'status': r.status,
        'rejection_reason': r.rejection_reason,
        'approval_action': r.approval_action,
        'requested_by': r.requested_by,
        'requester_name': r.requester.name,
        'reviewed_by': r.reviewed_by,
        'reviewer_name': r.reviewer.name if r.reviewer else None,
        'created_at': r.created_at.isoformat(),
        'reviewed_at': r.reviewed_at.isoformat() if r.reviewed_at else None,
        'completed_at': r.completed_at.isoformat() if r.completed_at else None
    } for r in requests]), 200

@app.route('/api/addon-requests', methods=['POST'])
@jwt_required()
def create_addon_request():
    user_id = get_jwt_identity()
    data = request.json
    
    request_obj = AddOnRequest(
        ward_id=data['ward_id'],
        room_id=data.get('room_id'),
        room_number=data['room_number'],
        patient_id=data['patient_id'],
        requested_test=data['requested_test'],
        reason=data['reason'],
        is_urgent=data.get('is_urgent', False),
        has_previous_sample=data.get('has_previous_sample', False),
        previous_sample_id=data.get('previous_sample_id'),
        additional_comment=data.get('additional_comment'),
        requested_by=user_id
    )
    
    db.session.add(request_obj)
    db.session.commit()
    
    # Create log entry
    log = AddOnLog(
        request_id=request_obj.id,
        action='created',
        performed_by=user_id,
        notes='Add-on request created'
    )
    db.session.add(log)
    db.session.commit()
    
    # TODO: Send notification (email/SMS)
    
    return jsonify({
        'id': request_obj.id,
        'message': 'Add-on request created successfully'
    }), 201

@app.route('/api/addon-requests/<int:request_id>/approve', methods=['POST'])
@jwt_required()
def approve_addon_request(request_id):
    user_id = get_jwt_identity()
    data = request.json
    
    request_obj = AddOnRequest.query.get(request_id)
    if not request_obj:
        return jsonify({'error': 'Request not found'}), 404
    
    request_obj.status = 'approved'
    request_obj.approval_action = data['action']  # add_to_same_sample or need_new_sample
    request_obj.reviewed_by = user_id
    request_obj.reviewed_at = datetime.utcnow()
    
    # Create log entry
    log = AddOnLog(
        request_id=request_obj.id,
        action='approved',
        performed_by=user_id,
        notes=f"Approved with action: {data['action']}"
    )
    db.session.add(log)
    db.session.commit()
    
    # TODO: Send notification to requester
    
    return jsonify({'message': 'Request approved successfully'}), 200

@app.route('/api/addon-requests/<int:request_id>/reject', methods=['POST'])
@jwt_required()
def reject_addon_request(request_id):
    user_id = get_jwt_identity()
    data = request.json
    
    request_obj = AddOnRequest.query.get(request_id)
    if not request_obj:
        return jsonify({'error': 'Request not found'}), 404
    
    request_obj.status = 'rejected'
    request_obj.rejection_reason = data['reason']
    request_obj.reviewed_by = user_id
    request_obj.reviewed_at = datetime.utcnow()
    
    # Create log entry
    log = AddOnLog(
        request_id=request_obj.id,
        action='rejected',
        performed_by=user_id,
        notes=f"Rejected: {data['reason']}"
    )
    db.session.add(log)
    db.session.commit()
    
    # TODO: Send notification to requester
    
    return jsonify({'message': 'Request rejected successfully'}), 200

@app.route('/api/addon-requests/<int:request_id>/complete', methods=['POST'])
@jwt_required()
def complete_addon_request(request_id):
    user_id = get_jwt_identity()
    
    request_obj = AddOnRequest.query.get(request_id)
    if not request_obj:
        return jsonify({'error': 'Request not found'}), 404
    
    request_obj.status = 'completed'
    request_obj.completed_at = datetime.utcnow()
    
    # Create log entry
    log = AddOnLog(
        request_id=request_obj.id,
        action='completed',
        performed_by=user_id,
        notes='Add-on test completed'
    )
    db.session.add(log)
    db.session.commit()
    
    return jsonify({'message': 'Request marked as completed'}), 200

# Analytics Routes
@app.route('/api/analytics/addon-stats', methods=['GET'])
@jwt_required()
def get_addon_stats():
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    
    query = AddOnRequest.query
    
    if start_date:
        query = query.filter(AddOnRequest.created_at >= datetime.fromisoformat(start_date))
    if end_date:
        query = query.filter(AddOnRequest.created_at <= datetime.fromisoformat(end_date))
    
    requests = query.all()
    
    # Ward statistics
    ward_stats = {}
    test_stats = {}
    reason_stats = {}
    shift_stats = {'day': 0, 'night': 0}
    user_stats = {}
    preventable_count = 0
    
    for req in requests:
        # Ward stats
        ward_name = req.ward.name
        ward_stats[ward_name] = ward_stats.get(ward_name, 0) + 1
        
        # Test stats
        test_stats[req.requested_test] = test_stats.get(req.requested_test, 0) + 1
        
        # Reason stats
        reason_stats[req.reason] = reason_stats.get(req.reason, 0) + 1
        
        # Shift stats (would need to get from room or request time)
        hour = req.created_at.hour
        if 7 <= hour < 19:
            shift_stats['day'] += 1
        else:
            shift_stats['night'] += 1
        
        # User stats
        user_name = req.requester.name
        user_stats[user_name] = user_stats.get(user_name, 0) + 1
        
        # Preventable (if reason indicates missing test)
        if 'missing' in req.reason.lower() or 'forgot' in req.reason.lower():
            preventable_count += 1
    
    total = len(requests)
    preventable_percentage = (preventable_count / total * 100) if total > 0 else 0
    
    return jsonify({
        'total_requests': total,
        'ward_stats': ward_stats,
        'test_stats': test_stats,
        'reason_stats': reason_stats,
        'shift_stats': shift_stats,
        'user_stats': user_stats,
        'preventable_count': preventable_count,
        'preventable_percentage': round(preventable_percentage, 2),
        'status_breakdown': {
            'pending': len([r for r in requests if r.status == 'pending']),
            'approved': len([r for r in requests if r.status == 'approved']),
            'rejected': len([r for r in requests if r.status == 'rejected']),
            'completed': len([r for r in requests if r.status == 'completed'])
        }
    }), 200

@app.route('/api/analytics/addon-trends', methods=['GET'])
@jwt_required()
def get_addon_trends():
    days = int(request.args.get('days', 30))
    start_date = datetime.utcnow() - timedelta(days=days)
    
    requests = AddOnRequest.query.filter(AddOnRequest.created_at >= start_date).all()
    
    # Group by date
    daily_stats = {}
    for req in requests:
        date_key = req.created_at.date().isoformat()
        if date_key not in daily_stats:
            daily_stats[date_key] = 0
        daily_stats[date_key] += 1
    
    return jsonify({
        'daily_stats': daily_stats,
        'period_days': days
    }), 200

# Initialize database and create admin user
def init_db():
    with app.app_context():
        db.create_all()
        
        # Create default admin user if not exists
        if not User.query.filter_by(username='admin').first():
            admin = User(
                username='admin',
                email='admin@hospital.com',
                password_hash=generate_password_hash('admin123'),
                role='admin',
                name='System Administrator'
            )
            db.session.add(admin)
            db.session.commit()
            print("✅ Admin user created: admin / admin123")

# Initialize on startup
init_db()

if __name__ == '__main__':
    app.run(debug=True, port=5000)

