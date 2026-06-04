const urlBase = 'http://cop4331-project.xyz/LAMPAPI';
const extension = 'php';

//VARIABLES
//Login
let userId = 0;
let firstName = "";
let lastName = "";
//Password Validation
const passwordInput = document.getElementById("registerPassword");

// If the field exists...
if (passwordInput) {
	const letter = document.getElementById("letter");
	const capital = document.getElementById("capital");
	const number = document.getElementById("number");
	const length = document.getElementById("length");
	const passwordRequirementsMsg = document.getElementById("passwordRequirementsMsg");

	//Function to verify password strength
	function passwordValidation() {
		const value = passwordInput.value;

		// Checks the icons for each requirement (Tick / Cross)
		const letterIcon = letter.querySelector('.req-icon');
		const capitalIcon = capital.querySelector('.req-icon');
		const numberIcon = number.querySelector('.req-icon');
		const lengthIcon = length.querySelector('.req-icon');

		// Validate lowercase letters
		if (/[a-z]/.test(value)) {
			letter.classList.replace("invalid", "valid");
			if (letterIcon) letterIcon.textContent = '✓';
		} else {
			letter.classList.replace("valid", "invalid");
			if (letterIcon) letterIcon.textContent = '✖';
		}

		// Validate capital letters
		if (/[A-Z]/.test(value)) {
			capital.classList.replace("invalid", "valid");
			if (capitalIcon) capitalIcon.textContent = '✓';
		} else {
			capital.classList.replace("valid", "invalid");
			if (capitalIcon) capitalIcon.textContent = '✖';
		}

		// Validate numbers
		if (/[0-9]/.test(value)) {
			number.classList.replace("invalid", "valid");
			if (numberIcon) numberIcon.textContent = '✓';
		} else {
			number.classList.replace("valid", "invalid");
			if (numberIcon) numberIcon.textContent = '✖';
		}

		// Validate length
		if (value.length >= 8) {
			length.classList.replace("invalid", "valid");
			if (lengthIcon) lengthIcon.textContent = '✓';
		} else {
			length.classList.replace("valid", "invalid");
			if (lengthIcon) lengthIcon.textContent = '✖';
		}

		// Show requirements box when user types
		if (passwordRequirementsMsg) {
			passwordRequirementsMsg.style.display = value.length ? 'block' : 'none';
		}
	}

	// Show when focused
	passwordInput.addEventListener('focus', () => {
		if (passwordRequirementsMsg) passwordRequirementsMsg.style.display = 'block';
	});

	// Hide on blur only if empty
	passwordInput.addEventListener('blur', () => {
		if (passwordRequirementsMsg && passwordInput.value.length === 0) passwordRequirementsMsg.style.display = 'none';
	});

	// Run the function on every edit (and toggle the message visibility)
	passwordInput.addEventListener('input', passwordValidation);
}

//LOGIN
function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
//	var hash = md5( password );
	
	document.getElementById("loginResult").innerHTML = "";

	let tmp = {login:login,password:password};
//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if( userId < 1 )
				{		
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
	
				window.location.href = "color.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function doRegister()
{
    let firstName = document.getElementById("firstName").value;
    let lastName = document.getElementById("lastName").value;
    let login = document.getElementById("registerName").value;
    let password = document.getElementById("registerPassword").value;

    document.getElementById("loginResult").innerHTML = "";

	// Validate password meets requirements before attempting to create an account
	const hasLower = /[a-z]/.test(password);
	const hasUpper = /[A-Z]/.test(password);
	const hasNumber = /[0-9]/.test(password);
	const hasLength = password.length >= 8;

	if (!(hasLower && hasUpper && hasNumber && hasLength)) {
		document.getElementById("loginResult").innerHTML = "Password does not meet requirements.";
		if (document.getElementById("registerPassword")) document.getElementById("registerPassword").focus();
		return;
	}

    let tmp = {firstName:firstName, lastName:lastName, login:login, password:password};
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/Register.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try
    {
        xhr.onreadystatechange = function()
        {
            if (this.readyState == 4 && this.status == 200)
            {
                let jsonObject = JSON.parse(xhr.responseText);

                if(jsonObject.error != "")
                {
                    document.getElementById("loginResult").innerHTML = jsonObject.error;
                    return;
                }

                document.getElementById("loginResult").innerHTML = "Registration successful! Please log in.";
            }
        };
        xhr.send(jsonPayload);
    }
    catch(err)
    {
        document.getElementById("loginResult").innerHTML = err.message;
    }
}

//CONTACTS
function doRegister()
{
    let firstName = document.getElementById("firstName").value;
    let lastName = document.getElementById("lastName").value;
    let login = document.getElementById("loginName").value;
    let password = document.getElementById("loginPassword").value;

    document.getElementById("loginResult").innerHTML = "";

    let tmp = {firstName:firstName, lastName:lastName, login:login, password:password};
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/Register.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try
    {
        xhr.onreadystatechange = function()
        {
            if (this.readyState == 4 && this.status == 200)
            {
                let jsonObject = JSON.parse(xhr.responseText);

                if(jsonObject.error != "")
                {
                    document.getElementById("loginResult").innerHTML = jsonObject.error;
                    return;
                }

                document.getElementById("loginResult").innerHTML = "Registration successful! Please log in.";
            }
        };
        xhr.send(jsonPayload);
    }
    catch(err)
    {
        document.getElementById("loginResult").innerHTML = err.message;
    }
}

function addContact()
{
    let firstName = document.getElementById("firstNameText").value;
    let lastName = document.getElementById("lastNameText").value;
    let phone = document.getElementById("phoneText").value;
    let email = document.getElementById("emailText").value;

    document.getElementById("contactAddResult").innerHTML = "";

    let tmp = {firstName:firstName, lastName:lastName, phone:phone, email:email, userId:userId};
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/AddContact.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try
    {
        xhr.onreadystatechange = function()
        {
            if (this.readyState == 4 && this.status == 200)
            {
                let jsonObject = JSON.parse(xhr.responseText);
                if(jsonObject.error != "")
                {
                    document.getElementById("contactAddResult").innerHTML = jsonObject.error;
                    return;
                }
                document.getElementById("contactAddResult").innerHTML = "Contact added successfully!";
            }
        };
        xhr.send(jsonPayload);
    }
    catch(err)
    {
        document.getElementById("contactAddResult").innerHTML = err.message;
    }
}

function searchContact()
{
    let search = document.getElementById("searchText").value;

    document.getElementById("contactList").innerHTML = "";

    let tmp = {search:search, userId:userId};
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/SearchContacts.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try
    {
        xhr.onreadystatechange = function()
        {
            if (this.readyState == 4 && this.status == 200)
            {
                let jsonObject = JSON.parse(xhr.responseText);

                if(jsonObject.error != "")
                {
                    document.getElementById("contactList").innerHTML = jsonObject.error;
                    return;
                }

                let contactList = "";
                for(let i = 0; i < jsonObject.results.length; i++)
                {
                    let c = jsonObject.results[i];
                    contactList += c.FirstName + " " + c.LastName + " | " + c.Phone + " | " + c.Email;
                    contactList += " <button onclick='deleteContact(" + c.ID + ")'>Delete</button>";
                    contactList += " <button onclick='editContact(" + c.ID + ", \"" + c.FirstName + "\", \"" + c.LastName + "\", \"" + c.Phone + "\", \"" + c.Email + "\")'>Edit</button>";
                    contactList += "<br />";
                }

                document.getElementById("contactList").innerHTML = contactList;
            }
        };
        xhr.send(jsonPayload);
    }
    catch(err)
    {
        document.getElementById("contactList").innerHTML = err.message;
    }
}

function deleteContact(contactId)
{
    let tmp = {id:contactId, userId:userId};
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/DeleteContact.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try
    {
        xhr.onreadystatechange = function()
        {
            if (this.readyState == 4 && this.status == 200)
            {
                let jsonObject = JSON.parse(xhr.responseText);
                if(jsonObject.error != "")
                {
                    document.getElementById("contactList").innerHTML = jsonObject.error;
                    return;
                }
                searchContact();
            }
        };
        xhr.send(jsonPayload);
    }
    catch(err)
    {
        document.getElementById("contactList").innerHTML = err.message;
    }
}

function editContact()
{

=======
>>>>>>> 3da71cbf8621520c083b97a54a085f13f8adb4af
}
