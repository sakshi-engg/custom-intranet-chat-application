@echo off
call venv\Scripts\activate
set FLASK_APP=app.py
flask run