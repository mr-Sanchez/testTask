document.addEventListener("DOMContentLoaded", function(){

    let phoneInputs = document.querySelectorAll("input[data-tel-input]");
    let userFieldsCount = 2;

    let removeErrorLabels = function(){
        let formFields = Array.from(document.getElementsByTagName("input"), e => e);
        formHasErrors = false;
        formFields.forEach(element => {
            element.style.border = "";
            let prevEl = element.previousSibling;
            if (prevEl.className == "errorLabel") {
                prevEl.remove();
            }
        });
    }

    let addUser = function(event){ 
        event.preventDefault();
        removeErrorLabels();
        let div = document.createElement("div");
        //querySelector(".user").cloneNode(true);
        div.className = "user";
        div.id = `user_${userFieldsCount}`;
        let fieldsID = userFieldsCount;
        userFieldsCount++;
        div.innerHTML = `
        <label for="userName">Имя</label>
                <input type="text" required name="userName" class="userName" id="userName_${fieldsID}" size="40">
                <label for="userSurname">Фамилия</label>
                <input type="text" required name="userSurname" class="userSurname" id="userSurname_${fieldsID}" size="40">
    
                <div>
                    <label class="gender" for="gender">Пол:</label>
                    <input type="radio" name="gender_${fieldsID}" value="Man">Мужчина
                    <input type="radio" name="gender_${fieldsID}" value="Women">Женщина
                </div><br>
    
                <div>
                    <label for="citizen">Гражданин РФ</label>
                    <input type="checkbox" id="citizen" name="citizen" class="citizen" id="citizen_${fieldsID}" value="yes">
                </div>
                <div>
                    <label for="phoneNumber">Телефон</label>
                    <input type="tel" data-tel-input placeholder="+7 (ХХХ) XXX-XX-XX" name="phoneNumber" class="phoneNumber" id="phoneNumber_${fieldsID}" maxlength="18">
                </div>
                <label for="dateBorn">Дата рождения</label>
                <input type="date" class="dateBorn" id="dateBorn_${fieldsID}" name="dateBorn"
                value="1990-01-01"
                min="1900-01-01" max="2021-12-31">
    
                <label for="education">Образование</label>
                <select name="education" class="education" id="education_${fieldsID}">
                    <option value="0">Выберите образование</option>
                    <option value="secondary">Среднее</option>
                    <option value="incomplete higher">Высшее неоконченное</option>
                    <option value="higher">Высшее</option>
                </select>
    
                <label for="comment">Комментарий</label>
                <textarea name="comment" class="comment" id="comment_${fieldsID}"></textarea>
        `;

        /*
        let allInputs = div.querySelectorAll("input");
        allInputs.forEach(input => {
            input.value = '';
        });
        
        div.querySelector(".userName").id = `name_${div.id}`;
        div.querySelector(".userSurname").id = `surname_${div.id}`;
        div.querySelectorAll("input[type=radio]").forEach(radio =>{
            radio.setAttribute("name", `gender${div.id}`);
        });
        let phoneInput = div.querySelector("input[data-tel-input]");
        phoneInput.addEventListener("input", onPhoneInput);
        phoneInput.addEventListener("keydown", onPhoneKeyDown);
        phoneInput.addEventListener("paste", onPhonePaste);
        */
        let btnDelete = document.createElement("i");
        btnDelete.className = "fa fa-times fa-lg";
        btnDelete.onclick = deleteUser;
        div.append(btnDelete);
        document.querySelector("#users").append(div);
        
    }

    let deleteUser = function(event){
        event.preventDefault();
        console.log(this.parentNode.id);
        let userToDelete = document.querySelector(`#${this.parentNode.id}`);
        let speed = 300;
        let seconds = speed / 1000;
        userToDelete.style.transition = "opacity "+seconds+"s ease";
        userToDelete.style.opacity = 0;
        setTimeout(function() {
            userToDelete.remove(userToDelete);
        }, speed);
    }

    let getInputNumbersValue = function(input){
        /*
        Принимает на вход значение input
        и возвращает только введенные цифры
        */
        return input.value.replace(/\D/g, "");
    }

    let onPhoneInput = function(e){
        //console.log(Date.now());
        // Получаем значение из поля ввода номера телефона
        let input = e.target,
            inputNumbersValue = getInputNumbersValue(input),
            formattedInputValue = "",
            selectionStart = input.selectionStart;

        if (!inputNumbersValue){
            return input.value = "";
        }

        if (input.value.length != selectionStart){
            if (e.data && /\D/g.test(e.data)){
                input.value = inputNumbersValue;
            }
            return;
        }

        if (["7", "8", "9"].indexOf(inputNumbersValue[0]) > -1){
            if (inputNumbersValue[0] == "9") inputNumbersValue = "7" + inputNumbersValue;
            let firstSymbols = "+7"; //(inputNumbersValue[0] == "8") ? "8" : 
            formattedInputValue = firstSymbols + " ";
            if (inputNumbersValue.length > 1){
                formattedInputValue += "(" + inputNumbersValue.substring(1, 4);
            }
            if (inputNumbersValue.length >= 5){
                formattedInputValue += ") " + inputNumbersValue.substring(4, 7);
            }
            if (inputNumbersValue.length >= 8){
                formattedInputValue += "-" + inputNumbersValue.substring(7, 9);
            }
            if (inputNumbersValue.length >= 10){
                formattedInputValue += "-" + inputNumbersValue.substring(9, 11);
            }
        }
        else {
            // Не Российский формат номера
            formattedInputValue = "+" + inputNumbersValue.substring(0, 16);
        }
        input.value = formattedInputValue;
    }


    let onPhoneKeyDown = function(e){
        let input = e.target;
        if (e.keyCode == 8 && getInputNumbersValue(input).length == 1){
            input.value = "";
        }
    }

    let onPhonePaste = function(e){
        let pasted = e.clipboardData || window.clipboardData,
            input = e.target,
            inputNumbersValue = getInputNumbersValue(input);
        if (pasted){
            let pastedText = pasted.getData("Text");
            if (!/\D/g.test(pastedText)){
                input.value = inputNumbersValue;
            }
        }
    }

    let capitalizeFirstLetter = function(text){
        return text.charAt(0).toUpperCase() + text.slice(1);
    }


    for (i=0; i<phoneInputs.length; i++){
        let phoneInput = phoneInputs[i];
        phoneInput.addEventListener("input", onPhoneInput);
        phoneInput.addEventListener("keydown", onPhoneKeyDown);
        phoneInput.addEventListener("paste", onPhonePaste);
    }

    let btnAdd = document.querySelector("#addUser");
    btnAdd.onclick = addUser;

    let btnSave = document.querySelector("#save");
    btnSave.addEventListener("click", async function(event) {
        event.preventDefault();

        removeErrorLabels();

        let userRequiredFields = document.querySelectorAll(
            ".userName, .userSurname, .dateBorn, .phoneNumber");
        userRequiredFields.forEach(name => {
            if (name.value.length == 0) {
                name.style.border = "1px solid red";
                errorLabel = document.createElement("span");
                errorLabel.className = "errorLabel";
                errorLabel.innerHTML = "Обязательно к заполнению";
                errorLabel.style.color = "red";
                name.before(errorLabel);
                formHasErrors = true;
            }
        });
        if (!formHasErrors){
            let userFields = document.querySelectorAll(".user");
            let users = {};
            userFields.forEach(user => {
                users[`${user.id}`] = {
                    name: user.querySelector(".userName").value,
                    surname: user.querySelector(".userSurname").value,
                    gender: user.querySelector("[type=radio]:checked").value,
                    citizen: user.querySelector(".citizen").value,
                    phoneNumber: user.querySelector(".phoneNumber").value,
                    dateBorn: user.querySelector(".dateBorn").value,
                    education: user.querySelector(".education").value,
                    comment: user.querySelector(".comment").value
                }
            });
            
            //let formData = new FormData(document.querySelector("form"));

            //let name = capitalizeFirstLetter(document.querySelector("#userName").value);
            //let surname = capitalizeFirstLetter(document.querySelector("#userSurname").value);

            
            // let education = document.querySelector("#education");
            // formData.set("userName", name);
            // formData.set("userSurname", surname);
            // formData.set("education", education.value);
            let response = await fetch("/add_user", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(users),
            });
            let response_json = await response.json();
            if (response_json.success) {
                let body = document.querySelector("body");
                body.style.backgroundColor = "#f2f7ff";
                body.style.display = "block";
                body.innerHTML = response_json.message;
            }
            else {
                console.log("error");
            // for (index in response_json.errors) {
            //     let error = response_json.errors[index];
            //     let errorField = error.field;
            //     let errorText = error.text;
            //     let formFieldWithError = document.querySelector(`input[name=${errorField}]`);
            //     formFieldWithError.style.border = "1px solid red";
            //     let errorLabel = document.querySelector(`#err${errorField}`);
            //     if (!errorLabel) {

            //     }
            //     errorLabel = document.createElement("p");
            //     errorLabel.id = `err${errorField}`;
            //     errorLabel.className = "errorLabel";
            //     errorLabel.innerHTML = errorText;
            //     errorLabel.style.color = "red";
            //     formFieldWithError.before(errorLabel);
            // }
            }
        }
    })
})