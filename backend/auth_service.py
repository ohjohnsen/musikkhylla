import logging
from sqlalchemy.orm import Session
from models import User, AuthCode
from datetime import datetime, timedelta, timezone
import jwt
import os
from typing import Optional

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class EmailService:
    """Mock email service for development. Logs emails to console."""
    
    @staticmethod
    def send_auth_code(email, code):
        """Send authentication code via email (mocked for development)"""
        try:
            # In development, just log the email to console
            logger.info("=" * 60)
            logger.info("📧 AUTHENTICATION EMAIL")
            logger.info("=" * 60)
            logger.info(f"To: {email}")
            logger.info(f"Subject: Your Musikkhylla Login Code")
            logger.info("")
            logger.info(f"Your verification code is: {code}")
            logger.info("")
            logger.info("This code will expire in 10 minutes.")
            logger.info("Enter this code on the Musikkhylla login page to continue.")
            logger.info("=" * 60)
            
            return True
        except Exception as e:
            logger.error(f"Failed to send email to {email}: {str(e)}")
            return False

class AuthService:
    """Authentication service using email codes"""
    
    @staticmethod
    def request_login_code(email: str, db: Session):
        """Send login code to user email"""
        try:
            # Normalize email
            email = email.lower().strip()
            
            # Find or create user
            user = db.query(User).filter(User.email == email).first()
            if not user:
                user = User(email=email)
                db.add(user)
                db.flush()  # Get user ID
            
            # Invalidate any existing codes for this user
            existing_codes = db.query(AuthCode).filter(
                AuthCode.user_id == user.id,
                AuthCode.used == False
            ).all()
            
            for code in existing_codes:
                code.used = True
            
            # Create new auth code
            auth_code = AuthCode(user_id=user.id)
            db.add(auth_code)
            db.commit()
            
            # Send email
            if EmailService.send_auth_code(email, auth_code.code):
                return {"success": True, "message": "Login code sent to your email"}
            else:
                return {"success": False, "error": "Failed to send email"}
                
        except Exception as e:
            db.rollback()
            logger.error(f"Error requesting login code: {str(e)}")
            return {"success": False, "error": "Internal server error"}
    
    @staticmethod
    def verify_login_code(email: str, code: str, db: Session):
        """Verify login code and return JWT token"""
        try:
            # Normalize email
            email = email.lower().strip()
            
            # Find user
            user = db.query(User).filter(User.email == email).first()
            if not user:
                return {"success": False, "error": "User not found"}
            
            # Find valid auth code
            auth_code = db.query(AuthCode).filter(
                AuthCode.user_id == user.id,
                AuthCode.code == code,
                AuthCode.used == False
            ).first()
            
            if not auth_code:
                return {"success": False, "error": "Invalid or expired code"}
            
            if auth_code.is_expired():
                return {"success": False, "error": "Code has expired"}
            
            # Mark code as used
            auth_code.used = True
            
            # Update last login
            user.last_login = datetime.now(timezone.utc)
            
            db.commit()
            
            # Generate JWT token
            token = AuthService.generate_token(user.id)
            
            return {
                "success": True,
                "token": token,
                "user": user.to_dict()
            }
            
        except Exception as e:
            db.rollback()
            logger.error(f"Error verifying login code: {str(e)}")
            return {"success": False, "error": "Internal server error"}
    
    @staticmethod
    def generate_token(user_id: int) -> str:
        """Generate JWT token for user"""
        payload = {
            'user_id': user_id,
            'exp': datetime.now(timezone.utc) + timedelta(days=30),  # Token expires in 30 days
            'iat': datetime.now(timezone.utc)
        }
        
        secret_key = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')
        return jwt.encode(payload, secret_key, algorithm='HS256')
    
    @staticmethod
    def verify_token(token: str, db: Session) -> Optional[User]:
        """Verify JWT token and return user"""
        try:
            secret_key = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')
            payload = jwt.decode(token, secret_key, algorithms=['HS256'])
            user_id = payload.get('user_id')
            
            if not user_id:
                return None
            
            user = db.query(User).filter(User.id == user_id).first()
            return user
            
        except jwt.ExpiredSignatureError:
            logger.warning("Token expired")
            return None
        except jwt.InvalidTokenError:
            logger.warning("Invalid token")
            return None
        except Exception as e:
            logger.error(f"Error verifying token: {str(e)}")
            return None
