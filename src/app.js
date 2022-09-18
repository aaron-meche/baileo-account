// FIREBASE DATA

import { 
    initializeApp 
} from "firebase/app";

import { 
    getAnalytics 
} from "firebase/analytics";

import { 
    getDatabase, ref, set, onValue, get
} from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyA4fSZkRgf1WdPT8IAZSDXqg9SlJ7v5E7U",
    authDomain: "baileo-us.firebaseapp.com",
    databaseURL: "https://baileo-us-default-rtdb.firebaseio.com",
    projectId: "baileo-us",
    storageBucket: "baileo-us.appspot.com",
    messagingSenderId: "338186023824",
    appId: "1:338186023824:web:6f2fb96c7a67ff0762b915",
    measurementId: "G-Y60XJC7GR8"
};

// Firebase Constants
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase();

// Configure Project
const projectTitle = 'auth';
const projectRef = 'services/' + projectTitle + '/';

// Empty Database Variables
var db;
var pdb;

// ---

function writeData(path, value) {
    set(ref(database, path), value);
}

function writeProjData(path, value) {
    set(ref(database, projectRef + path), value);
}

function openPage(page) {
    sessionStorage['activePage'] = page;
    window.location.reload();
}

onValue(ref(database), (snapshot) => {
    // Baileo Database
    db = snapshot.val();

    // Project Database
    pdb = snapshot.val()['services'][projectTitle];

    if (sessionStorage['activePage'] == 'home') {
        let userKey = pdb['user-keys'][localStorage['uk']];
        if (userKey) {
            console.log(pdb['users'][userKey]['keys']['auth-key']);
            if (pdb['users'][userKey]['keys']['auth-key'] == localStorage['ak']) {
                alert('Yes');
            } else {
                openPage('login');
            }
        } else {
            openPage('login');
        }
    } else {
        let credform = dom('credentials');
        credform.addEventListener('submit', function(event) {
            event.preventDefault();
            let type = dom('credentials').getAttribute('type');
        
            let username = domval('userCreds');
            let password = domval('passCreds');
            if (type == 'login') {
        
        
                if (pdb['users'][username]) {
        
                    if (password == pdb['users'][username]['password']) {
                        localStorage['ak'] = pdb['users'][username]['keys']['auth-key'];
                        localStorage['uk'] = pdb['users'][username]['keys']['user-key'];
                        alert('Logged In');
                    } else {
                        alert('Invalid credentials or account does not exits.');
                    }
        
                } else {
                    alert('Invalid credentials or account does not exits.');
                }
        
        
            } else if (type == 'signup') {
                let password_confirm = domval('passcCreds');
        
        
                // If Username Exists, stop
                if (pdb['users'][username]) {
                    alert('Invalid Username');
                } else {
                    // If passwords don't match, stop
                    if (password == password_confirm) {
                        // If password is shorter than 6 characters, stop
                        if (password.length >= 6) {
                            if (username.length >= 6) {
                                let secretKey = generateKey(100);
                                let userKey = generateKey(100);
                                let authKey = generateKey(100);
                                writeProjData('users/' + username + '/password', password);
                                writeProjData('users/' + username + '/keys/secret-key', secretKey);
                                writeProjData('users/' + username + '/keys/user-key', userKey);
                                writeProjData('users/' + username + '/keys/auth-key', authKey);
                                localStorage['ak'] = authKey;
                                localStorage['uk'] = userKey;
                                writeProjData('user-keys/' + userKey, username);
                                alert('Account created');
                            } else {
                                alert('Username must be at least 6 characters long')
                            }
                        } else {
                            alert('Password must be at least 6 characters long');
                        }
                    } else {
                        alert('Passwords do not match');
                    }
                }
        
        
            }
        })
    }
}, {
    onlyOnce: true
});

function dom(id) {
    return document.getElementById(id);
}

function domval(id) {
    return document.getElementById(id).value;
}

function generateKey(amount) {
    let library = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z',0,1,2,3,4,5,6,7,8,9];
    // let ranNum = Math.floor(Math.random() * library.length);
    var generatedKey = '';
    for (let i = 0; i < amount; i++) {
        generatedKey = generatedKey + library[Math.floor(Math.random() * library.length)];
    }
    return generatedKey;
}