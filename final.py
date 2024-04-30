from flask import Flask, render_template, redirect, url_for, flash, request, session

from flask_sqlalchemy import SQLAlchemy
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField
from wtforms.validators import InputRequired, Length, Email

import json
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = os.urandom(24)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    posts = db.relationship('Post', backref='author', lazy=True)
    diagram_data = db.relationship('DiagramData', backref='user', lazy=True)

class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    content = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

class RegistrationForm(FlaskForm):
    username = StringField('Username', validators=[InputRequired(), Length(min=4, max=20)])
    email = StringField('Email', validators=[InputRequired(), Email()])
    password = PasswordField('Password', validators=[InputRequired()])
    submit = SubmitField('Sign Up')

class LoginForm(FlaskForm):
    email = StringField('Email', validators=[InputRequired(), Email()])
    password = PasswordField('Password', validators=[InputRequired(), Length(min=6)])
    submit = SubmitField('Login')

class DiagramData(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    major1 = db.Column(db.String(20))
    major2 = db.Column(db.String(20))
    minor1 = db.Column(db.String(20))
    minor2 = db.Column(db.String(20))
    node_colors = db.Column(db.String(255))

with app.app_context():
    db.create_all()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    form = RegistrationForm()
    if form.validate_on_submit():
        user = User(username=form.username.data, email=form.email.data)
        # Add user to the database or perform other actions
        db.session.add(user)
        db.session.commit()
        flash('Account created successfully!', 'success')
        return redirect(url_for('login')) # Redirect to a different page, e.g., the login page
    return render_template('register.html', title='Register', form=form)

@app.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        email = form.email.data
        user = User.query.filter_by(email=email).first()
        if user:
            username = user.username
            session['username'] = user.username
            session['logged_in'] = True
            flash('Login successful!', 'success')
            return redirect(url_for('index'))
        else:
            flash('User not found', 'error')
    return render_template('login.html', title='Login', form=form)

@app.route('/dashboard')
def dashboard():
    # Ensure the user is logged in
    if 'username' not in session or not session['logged_in']:
        flash('You must be logged in to view this page', 'error')
        return redirect(url_for('login'))
    
    user = User.query.filter_by(username=session['username']).first()
    diagram_data = DiagramData.query.filter_by(user_id=user.id).first()

    return render_template('dashboard.html', diagram_data=diagram_data)

@app.route('/save', methods=['POST'])
def save_diagram():
    if request.method == 'POST':
        user_id = current_user.id 
        diagram_data = request.form.get('data')
        node_colors = request.form.get('node_colors')  # Assuming 'node_colors' is sent along with the form data
        new_diagram_data = DiagramData(user_id=user_id, data=diagram_data, node_colors=node_colors)
        db.session.add(new_diagram_data)
        db.session.commit()
        flash('Diagram data saved successfully!', 'success')
        return redirect(url_for('success'))
    else:
        return "Method Not Allowed", 405

if __name__ == '__main__':
    app.run(debug=True)
