from flask import Flask, render_template, request, make_response, jsonify
from db import engine
import json
from sqlalchemy.orm import Session, sessionmaker
from models import User, UserInfo

app = Flask(__name__)

session = sessionmaker(bind=engine)

@app.route('/')
def index():
    return render_template("picture.html")

@app.route('/add_user', methods=['POST'])
def add_user():
    form_data = request.form
    form_errors = []
    required_fields = (
        'userName',
        'userSurname',
        'gender',
        'dateBorn',
    )
    
    for field in required_fields:
        if field not in form_data or form_data[field] == '':
            form_errors.append({
                'field': field, 
                'text': 'Поле обязательно к заполнению'
            })
    if form_errors:
        success = False
        message = 'Not OK'
    else:
        name = form_data.get('userName')
        surname = form_data.get('userSurname')
        gender = form_data.get('gender')
        citizen = 0
        if form_data.get('citizen'):
            citizen = 1
        date_born = form_data.get('dateBorn')
        education = form_data.get('education')
        is_education_selected = form_data['education'] != '0'
        if not is_education_selected:
            education = ''
        comment = form_data.get('comment')

        new_user = User(
            name = name,
            middle_name = surname,
            bornDate = date_born,
            gender = gender
        )
        s = session()
        s.add(new_user)
        s.flush()

        new_user_info = UserInfo(
            user_id = new_user.id,
            education = education,
            comment = comment,
            citizenship = citizen
        )

        s.add(new_user_info)
        s.commit()
        success = True
        message = 'Данные успешно добавлены в базу'

    errors = form_errors
    response = make_response(
        jsonify({
            'success' : success,
            'message': message,
            'errors': errors,
        })
    )
    return response
    

if __name__ == '__main__':
    app.run(debug=True)
