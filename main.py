from flask import Flask, render_template, request, make_response, jsonify
from db import engine
import json
from models import User, UserInfo, UserPhoneNumber
from db import start_session

app = Flask(__name__)

@app.route('/')
def index():
    return render_template("picture.html")


@app.route('/add_user', methods=['POST'])
@start_session
def add_user(s):
    form_data = request.get_json()
    form_errors = []
    required_fields = (
        'userName',
        'userSurname',
        'gender',
        'dateBorn',
    )

    for key in form_data:
        user_info = form_data[key]
        name = user_info['name']
        surname = user_info['surname']
        gender = user_info['gender']
        citizen = 0
        if form_data.get('citizen'):
            citizen = 1
        phone_number = user_info['phoneNumber']
        date_born = user_info['dateBorn']
        education = user_info['education']
        comment = user_info['comment']

        new_user = User(
            name = name,
            middle_name = surname,
            bornDate = date_born,
            gender = gender
        )
        
        s.add(new_user)
        s.flush()

        new_user_info = UserInfo(
            user_id = new_user.id,
            education = education,
            comment = comment,
            citizenship = citizen
        )

        new_user_phone_number = UserPhoneNumber(
            user_id = new_user.id,
            phone_number = phone_number
        )

        s.add(new_user_info)
        s.add(new_user_phone_number)

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
        
    
