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
	
				window.location.href = "contacts.html";
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

function escapeHtml(text)
{
	if (typeof text !== 'string') return text;
	return text
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');
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
                document.getElementById("loginResult").innerHTML = "Registration successful! Redirecting to login...";
                
                setTimeout(function() {
                    window.location.href = "index.html";
                }, 2000);
            }
        };
        xhr.send(jsonPayload);
    }
    catch(err)
    {
        document.getElementById("loginResult").innerHTML = err.message;
    }
}

// CONTACTS
function addContact()
{
    let firstName = document.getElementById("firstNameText").value;
    let lastName = document.getElementById("lastNameText").value;
    let phone = document.getElementById("phoneText").value;
    let email = document.getElementById("emailText").value;

    if(firstName == "" && lastName == "" && phone == "" && email == "")
    {
        document.getElementById("contactAddResult").innerHTML = "All fields are empty. Contact not added.";
        return;
    }

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

                //Clear fields
                document.getElementById("firstNameText").value = "";
                document.getElementById("lastNameText").value = "";
                document.getElementById("phoneText").value = "";
                document.getElementById("emailText").value = "";
            }
        };
        xhr.send(jsonPayload);
    }
    catch(err)
    {
        document.getElementById("contactAddResult").innerHTML = err.message;
    }
}

function searchContact(searchQuery)
{
    let search = typeof searchQuery === 'string' ? searchQuery : document.getElementById("searchText").value;
    if (typeof searchQuery === 'string') {
        document.getElementById("searchText").value = search;
    }

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
                    let firstName = escapeHtml(c.FirstName);
                    let lastName = escapeHtml(c.LastName);
                    let phone = escapeHtml(c.Phone);
                    let email = escapeHtml(c.Email);

                    contactList += `
                        <div class="contact-card" data-contact-id="${c.ID}">
                            <div class="input-row">
                                <div class="input-group">
                                    <label>First Name</label>
                                    <input type="text" class="contact-field" value="${firstName}" disabled />
                                </div>
                                <div class="input-group">
                                    <label>Last Name</label>
                                    <input type="text" class="contact-field" value="${lastName}" disabled />
                                </div>
                            </div>
                            <div class="input-group">
                                <label>Phone</label>
                                <input type="text" class="contact-field" value="${phone}" disabled />
                            </div>
                            <div class="input-group">
                                <label>Email</label>
                                <input type="text" class="contact-field" value="${email}" disabled />
                            </div>
                            <div class="contact-actions">
                                <button type="button" class="btn-danger" onclick="deleteContact(${c.ID})">Delete</button>
                                <button type="button" class="btn-primary" onclick="startEditContact(this)">Edit</button>
                            </div>
                        </div>`;
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

function clearSearchResults()
{
    document.getElementById("searchText").value = "";
    document.getElementById("contactList").innerHTML = '<h3 style="font-style: italic; display: flex; justify-content: center; align-items: center; height: inherit">Start searching to see your contacts!</h3>';
}

function deleteContact(contactId)
{

    if (!confirm("Are you sure you want to delete this contact?"))
    {
        return; 
    }

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

function startEditContact(button)
{
    //Find closest .contact-card
    const card = button.closest('.contact-card');
    if (!card) return;

    //Select each field and enable editing
    card.querySelectorAll('.contact-field').forEach(field => {
        field.dataset.originalValue = field.value;
        field.disabled = false;
    });

    const contactId = card.dataset.contactId;
    card.querySelector('.contact-actions').innerHTML = `
        <button type="button" class="btn-success" onclick="confirmEditContact(this, ${contactId})">Confirm</button>
        <button type="button" class="btn-secondary" onclick="cancelEditContact(this)">Cancel</button>
    `;
}

function cancelEditContact(button)
{
    const card = button.closest('.contact-card');
    if (!card) return;

    card.querySelectorAll('.contact-field').forEach(field => {
        if (field.dataset.originalValue !== undefined) {
            field.value = field.dataset.originalValue;
        }
        field.disabled = true;
    });

    restoreCardActions(card);
}

function confirmEditContact(button, contactId)
{
    const card = button.closest('.contact-card');
    if (!card) return;

    //Setup edited values
    const fields = card.querySelectorAll('.contact-field');
    const updatedValues = {
        id: contactId,
        firstName: fields[0].value,
        lastName: fields[1].value,
        phone: fields[2].value,
        email: fields[3].value,
        userId: userId
    };

    //Update
    const jsonPayload = JSON.stringify(updatedValues);
    const url = urlBase + '/UpdateContact.' + extension;

    const xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-type', 'application/json; charset=UTF-8');
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            const jsonObject = JSON.parse(xhr.responseText);
            if (jsonObject.error != '') {
                card.querySelector('.contact-actions').insertAdjacentHTML('beforeend', `<span class="error-text">${escapeHtml(jsonObject.error)}</span>`);
                return;
            }

            fields.forEach(field => field.disabled = true);
            restoreCardActions(card);
        }
    };
    xhr.send(jsonPayload);
}

function restoreCardActions(card)
{
    const contactId = card.dataset.contactId;
    card.querySelector('.contact-actions').innerHTML = `
        <button type="button" class="btn-danger" onclick="deleteContact(${contactId})">Delete</button>
        <button type="button" class="btn-primary" onclick="startEditContact(this)">Edit</button>
    `;
}

function editContact(id, fn, ln, phone, email)
{
    document.getElementById("firstNameText").value = fn;
    document.getElementById("lastNameText").value = ln;
    document.getElementById("phoneText").value = phone;
    document.getElementById("emailText").value = email;
    document.getElementById("editContactId").innerHTML = id;
    document.getElementById("updateButton").style.display = "inline-block";
}

function updateContact()
{
	// Validate that a contact is selected for update
    let id = document.getElementById("editContactId").innerHTML;
    let firstName = document.getElementById("firstNameText").value; 
    let lastName = document.getElementById("lastNameText").value;
    let phone = document.getElementById("phoneText").value;
    let email = document.getElementById("emailText").value;

    let tmp = {id:id, firstName:firstName, lastName:lastName, phone:phone, email:email, userId:userId}; 
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/UpdateContact.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try
    {
        xhr.onreadystatechange = function()
        {
			// Check for successful response
            if (this.readyState == 4 && this.status == 200)
            {
				// Parse response and check for errors
                let jsonObject = JSON.parse(xhr.responseText);
                if(jsonObject.error != "")
                {
                    document.getElementById("contactUpdateResult").innerHTML = jsonObject.error;
                    return;
                }
                document.getElementById("contactUpdateResult").innerHTML = "Contact updated!";
                document.getElementById("updateButton").style.display = "none";
                searchContact();
            }
        };
        xhr.send(jsonPayload);
    }
    catch(err)
    {
        document.getElementById("contactUpdateResult").innerHTML = err.message;
    }
}
