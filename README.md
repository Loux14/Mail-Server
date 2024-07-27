# ***Mail Server***



* Front-end is a derivation of my other project "Mail Client", in *HTML, CSS, JavaScript*
* Back-end in Javascript, using *Node.js* and *Express.js*
* Requests are done thank to *Ajax* and *JQuery*

* Cryptography by *Node-Forge*

![pic1](https://github.com/Loux14/Mail-Server/assets/122696881/a29b2c37-c300-409f-b199-49e0e785cfa0)




## Procedure

* create a user by logging in (Public and Private keys are created)
* once loggued, the computer is set for this specific user, impossible to log out (data loss in local storage)

* When sending email, encryption is performed and posted on server
* When retrieving emails (GET), all emails are retrieved, but only the decrypted ones are displayed

![Picture1](https://github.com/Loux14/Mail-Server/assets/122696881/55c2ec2b-59c1-4c07-a145-d8240e0bf783)

![Picture2](https://github.com/Loux14/Mail-Server/assets/122696881/91ca14d5-b88a-4f73-b5ab-88662661e669)

![Picture3](https://github.com/Loux14/Mail-Server/assets/122696881/4e01ea07-679f-4d44-a32b-5564024c615f)


## Enhancement

This is a non-perfect university project (first session). 
Known issues :
* Letters.json never populated
* Slow encryption
* GET requests not always successful





