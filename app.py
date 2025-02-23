from flask import  Flask,render_template
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager,Login_user,login_required,logout_user, current_user