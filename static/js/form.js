document.addEventListener("DOMContentLoaded", function(){

    let phoneInputs = document.querySelectorAll("input[data-tel-input]");

    let addUser = function(event){ 
        event.preventDefault();
        let div = document.querySelector(".user").cloneNode(true);
        div.id = `user_${Date.now()}`;
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
        //console.log(document.querySelector(`#${this.parentNode.id}`));
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
        console.log(Date.now());
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
            let firstSymbols = (inputNumbersValue[0] == "8") ? "8" : "+7";
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
        let formFields = Array.from(document.getElementsByTagName("input"), e => e);
        formFields.forEach(element => {
            element.style.border = "";
            let prevEl = element.previousSibling;
            if (prevEl.className == "errorLabel") {
                prevEl.remove();
            }
        });
        let formData = new FormData(document.querySelector("form"));

        let name = capitalizeFirstLetter(document.querySelector("#userName").value);
        let surname = capitalizeFirstLetter(document.querySelector("#userSurname").value);

        
        let education = document.querySelector("#education");
        formData.set("userName", name);
        formData.set("userSurname", surname);
        formData.set("education", education.value);
        let response = await fetch("/add_user", {
            method: "POST",
            body: formData
        });
        let response_json = await response.json();
    if (response_json.success) {
        let body = document.querySelector("body");
        body.style.backgroundColor = "#f2f7ff";
        body.style.display = "block";
        body.innerHTML = response_json.message;
    }
    else {
        for (index in response_json.errors) {
            let error = response_json.errors[index];
            let errorField = error.field;
            let errorText = error.text;
            let formFieldWithError = document.querySelector(`input[name=${errorField}]`);
            formFieldWithError.style.border = "1px solid red";
            let errorLabel = document.querySelector(`#err${errorField}`);
            if (!errorLabel) {

            }
            errorLabel = document.createElement("p");
            errorLabel.id = `err${errorField}`;
            errorLabel.className = "errorLabel";
            errorLabel.innerHTML = errorText;
            errorLabel.style.color = "red";
            formFieldWithError.before(errorLabel);
        }
    }
    })
})