document.addEventListener("DOMContentLoaded", function() {
    let btn = document.querySelector("#save");
    btn.addEventListener("click", async function(event) {
        event.preventDefault();
        let formFields = Array.from(document.getElementsByTagName("input"), e => e);
        formFields.forEach(element => {
            element.style.border = '';
            let prevEl = element.previousSibling;
            if (prevEl.className == 'errorLabel') {
                prevEl.remove();
            }
        });
        let formData = new FormData(document.querySelector("form"));
        let education = document.querySelector('#education');
        formData.set('education', education.value);
        let response = await fetch("/add_user", {
            method: "POST",
            body: formData
        });
        let response_json = await response.json();
    if (response_json.success) {
        let body = document.querySelector("body");
        body.style.backgroundColor = '#f2f7ff';
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
            errorLabel = document.createElement('p');
            errorLabel.id = `err${errorField}`;
            errorLabel.className = 'errorLabel';
            errorLabel.innerHTML = errorText;
            errorLabel.style.color = "red";
            formFieldWithError.before(errorLabel);
        }
    }
    })
})