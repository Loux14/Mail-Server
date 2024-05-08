# ***Mail Server***

//READ.MD IN PROGRESS 08-05-2024//

Côté client :

L'interface web est écrite en utilisant le trio HTML, JavaScript et CSS.
Pour la cryptographie, la librairie Node-Forge est utilisée côté client.
Les requêtes au serveur sont faites via Ajax et JQuery.


Côté server :

Le server est écrit en JavaScript en utilisant Node.js et Express.js.

* NON FUNCTIONNAL - DEBBUGING IN PROCESS

BUG -> LETTERS.JSON IS NEVER POPULATED

BUG -> ENCRYPTION ULTRA SLOW PROCESS

BUG -> SEARCH BAR INACTIVE

- les modules : modules et package de Node.js

- letters.json : 
Fichier de stockage des messages comprenant le nom de l'expéditeur ainsi que le message encrypté.

- contacts.json :
 Fichier de stockage de tous les contacts, soit le nom et le la clé publique.

- server.js : 
Assure les réponses aux requêtes suivantes :

GET /
Retourne le HTML au navigateur.

GET /getLetters
Requête envoyée quand l'utilisateur clique sur l'onglet 'Inbox'. Le server renvoie le fichier letters.json

GET /getContacts
Requête envoyée quand l'utilisateur clique sur l'onglet 'Contacts'. Le server renvoie le fichier contacts.json

POST /addLetter
Requête envoyée quand l'utilisateur clique sur le bouton 'Send'. Le server ajoute le message encrypté au fichier letters.json

POST /addContact
Requête envoyée quand l'utilisateur clique sur l'onglet 'Log In'. Le server ajoute le contact au fichier contatcs.json






