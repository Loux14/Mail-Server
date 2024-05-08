
/////////////////////////////////////////////////////////////////////////////
///////////////////////   Server Requests Code        ///////////////////////
/////////////////////////////////////////////////////////////////////////////


// LOGIN + ADD CONTACT//////////////////////////////////////////////////////////////////////////////
// Login and keys generation
function login() {
  let myEmail = document.getElementById('myAdress').value;
  generateRSAKeyPair();
  publicKey = generateRSAKeyPair().publicKey;
  privateKey = generateRSAKeyPair().privateKey;
  $.ajax({
    url: "addContact",
    type: "POST",
    data: JSON.stringify({ "email": myEmail, "publicKey": publicKey }),
    contentType: "application/json",
    success: function (data) {
      console.log('SUCCESS CONTACT SENT');
      document.getElementById('loginButton').style.display = 'none';
      document.getElementById("myAdress").disabled = true;
      logbutton.classList.add('logged');
      localStorage.setItem("email", myEmail);
      localStorage.setItem("privateKey", privateKey);
      localStorage.setItem('logged', 'true');
      console.log('LOGGED');
      console.log('EMAIL IS: ' + localStorage.getItem('email'));
      getContacts();
      //getLetters();
      showContent('contacts');
    },
    error: function (data) {
      console.log('FAILURE CONTACT NOT SENT');
      $.ajax({
        url: "addContact",
        type: "POST",
        data: JSON.stringify({ "email": myEmail, "publicKey": publicKey }),
        contentType: "application/json",
        success: function (data) {
          console.log('SUCCESS CONTACT SENT 2');
          document.getElementById('loginButton').style.display = 'none';
          document.getElementById("myAdress").disabled = true;
          logbutton.classList.add('logged');
          localStorage.setItem("email", myEmail);
          localStorage.setItem("privateKey", privateKey);
          localStorage.setItem('logged', 'true');
          console.log('LOGGED');
          console.log('EMAIL IS: ' + localStorage.getItem('email'));
          getContacts();
          getLetters();
          showContent('contacts');
        },
        error: function (data) {
          console.log('FAILURE CONTACT NOT SENT 2');
        }
      });
    }
  });
}


// GET CONTACT //////////////////////////////////////////////////////////////////////////////////////////
// Retrieve contact list and display it
function getContacts() {
  let people = [];
  let peopleList = document.getElementById('contacts-list');

  $.ajax({
    url: "getContacts",
    datatype: "json",
    success: function (data) {
      $.each(data, function (index, person) {
        people.push(person);
      })

      // Add the contacts to the HTML with click event
      peopleList.innerHTML = '';

      for (let i = 0; i < people.length; i++) {
        let person = people[i];
        const li = document.createElement('li');
        const span2 = document.createElement('span');
        const a = document.createElement('a');
        a.href = '#';
        span2.textContent = person.email;
        li.appendChild(span2);
        li.appendChild(a);
        peopleList.appendChild(li);

        // Add the selected class when clicking on a contact
        li.addEventListener('click', function () {
          let selected = peopleList.querySelector('.selected');
          if (selected) {
            selected.classList.remove('selected');
          }
          li.classList.add('selected');
        });

        // Remove the selected class when clicking outside the list
        document.addEventListener('click', function (event) {
          if (!peopleList.contains(event.target)) {
            let selected = peopleList.querySelector('.selected');
            if (selected) {
              selected.classList.remove('selected');
            }
          }
        });
      }
    }
  });
}



// GET LETTERS//////////////////////////////////////////////////////////////////////////////////////////
// Retrieve letters and display them
function getLetters() {
  let letters = [];
  let lettersList = document.getElementById('inbox-list');

  $.ajax({
    url: "getLetters",
    datatype: "json",
    success: function (data) {
      $.each(data, function (index, letter) {
        //try to decrypt with private key and if success add to letters
        let decryptedLetter = decryptLetter(letter, localStorage.getItem('privateKey'));
        if (decryptedLetter) {
          letters.push(decryptedLetter);
        }
      })

      // Add the letters to the HTML with click event
      lettersList.innerHTML = '';

      for (let i = 0; i < letters.length; i++) {
        let letter = letters[i];
        const li = document.createElement('li');
        const span2 = document.createElement('span');
        const a = document.createElement('a');
        a.href = '#';

        span2.textContent = letter.from;
        li.appendChild(span2);
        li.appendChild(a);
        lettersList.appendChild(li);

        // Add the selected class when clicking on a letter
        li.addEventListener('click', function () {  
          let selected = lettersList.querySelector('.selected');
          if (selected) {
            selected.classList.remove('selected');
          }
          li.classList.add('selected');
        });

        // Remove the selected class when clicking outside the list
        document.addEventListener('click', function (event) {
          if (!lettersList.contains(event.target)) {
            let selected = lettersList.querySelector('.selected');
            if (selected) {
              selected.classList.remove('selected');
            }
          }
        });
      }
    }
  });
}



// ADD LETTER//////////////////////////////////////////////////////////////////////////////////////////
//Send the letter
let targetPublicKey = '';

function send() {
  // Find Public Key and encrypt the letter
  let from = localStorage.getItem('email');
  let to = document.getElementById('to').value;
  let subject = document.getElementById('subject').value;
  let content = document.getElementById('message').value;
  let letter = { from, subject, content };
  // Retrieve public key and encrypt the letter
  $.ajax({
    url: "getContacts",
    datatype: "json",
    success: function (data) {
      $.each(data, function (index, person) {
        if (person.email === to) {
          targetPublicKey = person.publicKey;
          console.log('SUCCESS RETRIEVING PUBLIC KEY');
          console.log(targetPublicKey);
          let encryptedLetter = encryptLetter(letter, targetPublicKey);
          console.log('LETTER ENCRYPTED');
          console.log(encryptedLetter);
          sendLetter(encryptedLetter);
          showContent('inbox');

        }
      })
    },
    error: function (err) {
      console.log('ERROR RETRIEVING PUBLIC KEY');
      $.ajax({
        url: "getContacts",
        datatype: "json",
        success: function (data) {
          $.each(data, function (index, person) {
            if (person.email === to) {
              targetPublicKey = person.publicKey;
              console.log('SUCCESS RETRIEVING PUBLIC KEY 2');
              console.log(targetPublicKey);
              let encryptedLetter = encryptLetter(letter, targetPublicKey);
              console.log('LETTER ENCRYPTED');
              console.log(encryptedLetter);
              sendLetter(encryptedLetter);
              showContent('inbox');

            }
          })
        },
        error: function (err) {
          console.log('ERROR RETRIEVING PUBLIC KEY 2');
        }
      });
    }
  });
}


//Send the encrypted letter
function sendLetter(x) {
  let encryptedLetter = x;
  let from = localStorage.getItem('email');
  let letter = { from, encryptedLetter };
  $.ajax({
    url: "addLetter",
    type: "POST",
    data: JSON.stringify(letter),
    datatype: "application/json",
    success: function (data) {
      console.log("SUCCESS SENDING ENCRYPTED LETTER");
      console.log(letter);
    },
    error: function (err) {
      console.log("ERROR SENDING ENCRYPTED LETTER");
    }
  });
}







/////////////////////////////////////////////////////////////////////////////
////////////////////////////   Functionality  ///////////////////////////////
/////////////////////////////////////////////////////////////////////////////



let logbutton = document.getElementById('login-button');
if (localStorage.getItem('logged') == 'true') {
  document.getElementById('loginButton').style.display = 'none';
  document.getElementById("myAdress").disabled = true;
  logbutton.classList.add('logged');
}
else {
  logbutton.classList.remove('logged');
  localStorage.setItem("logged", false);
}


//Key generation
function generateRSAKeyPair() {
  const keys = forge.pki.rsa.generateKeyPair({ bits: 1024 });
  const privateKey = forge.pki.privateKeyToPem(keys.privateKey);
  const publicKey = forge.pki.publicKeyToPem(keys.publicKey);
  return { privateKey, publicKey };
}


//Encryption
function encryptLetter(letter, targetPublicKey) {
  console.log(letter);
  let publicKey = targetPublicKey;
  let publicKeyForge = forge.pki.publicKeyFromPem(publicKey);
  let message = JSON.stringify(letter);
  let encryptedMessage = publicKeyForge.encrypt(message);
  let encodedMessage = forge.util.encode64(encryptedMessage);
  return encodedMessage;
}

//Decryption
function decryptLetter(letter, privateKey) {
  privateKey = privateKey;
  let privateKeyForge = forge.pki.privateKeyFromPem(privateKey);
  let decodedMessage = forge.util.decode64(letter);
  let decryptedMessage = privateKeyForge.decrypt(decodedMessage);
  let decryptedLetter = JSON.parse(decryptedMessage);
  return decryptedLetter;
}


// Log out and erase localStorge
function logOut() {
  if (window.confirm('Are you sure you want to log out? You will lose all your mails and won\'t be able to access them again.') == true) {
    localStorage.setItem("logged", 'false');
    showContent('login');
    logbutton.classList.remove('logged');
    document.getElementById('loginButton').style.display = 'block';
    document.getElementById("myAdress").disabled = false;
    localStorage.clear();
    console.log('UNLOGGED');
  }
  else {
    getContacts();
  }

}


// Cancel Button
function cancelContact() {
  let form = document.getElementById('contact-form');
  form.style.display = 'none';
  contactList.style.display = 'block';
  form.reset();
}


// Message to contact Button
function messageContact() {
  let selected = document.querySelector('.selected');
  if (selected) {
    let email = selected.querySelector('span:nth-child(1)').textContent;
    document.getElementById('to').value = email;
    showContent('compose');
  }
}

// Cancel Message Button
function cancelMessage() {
  let form = document.getElementById('compose-form');
  form.reset();
  showContent('inbox');
}



// Search Bar Filter

// Contacts
let searchBarContacts = document.getElementById('search-bar');
let contactList = document.getElementById('contacts-list');
let contacts = contactList.getElementsByTagName('li');

searchBarContacts.addEventListener('keyup', function () {
  let searchTerm = searchBarContacts.value.toLowerCase();
  for (let i = 0; i < contacts.length; i++) {
    let contact = contacts[i];
    let contactName = contact.getElementsByTagName('span')[0].innerText.toLowerCase();
    let contactEmail = contact.getElementsByTagName('a')[0].innerText.toLowerCase(); 
    if (contactName.includes(searchTerm) || contactEmail.includes(searchTerm)) {
      contact.style.display = "";
    } else {
      contact.style.display = 'none';
    }
  }
});

// Emails
let searchBarEmails = document.getElementById('search-bar');
let emailList = document.getElementById('emails-list');
let emails = emailList.getElementsByTagName('li');

searchBarEmails.addEventListener('keyup', function () {
  let searchTerm = searchBarEmails.value.toLowerCase();
  for (let i = 0; i < emails.length; i++) {
    let email = emails[i];
    let emailName = email.getElementsByTagName('span')[0].innerText.toLowerCase();
    let emailSubject = email.getElementsByTagName('a')[0].innerText.toLowerCase(); 
    if (emailName.includes(searchTerm) || emailSubject.includes(searchTerm)) {
      email.style.display = "";
    } else {
      email.style.display = 'none';
    }
  }
});




// Nav Bar Buttons
function showContent(contentId) {
  let content = document.getElementById(contentId);
  let allContents = document.getElementsByClassName('content');
  for (let i = 0; i < allContents.length; i++) {
    allContents[i].style.display = 'none';
  }
  content.style.display = 'block';
}





/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////   Load first  /////////////////////////////
/////////////////////////////////////////////////////////////////////////////

// Load first page depending on if user is logged in or not
if (localStorage.getItem('logged') == 'true')
  window.onload = function () { showContent('inbox') }
else
  window.onload = function () { showContent('login') }











