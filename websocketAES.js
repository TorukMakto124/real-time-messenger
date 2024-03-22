// import socketDB from './websocketDB.js';
// const websocketDB = require('./websocketDB.js');
const CryptoJS = require("crypto-js");
const websocketDB = [];
const ws = require('ws');

const encryptData = (data) => {
    const encryptedData = CryptoJS.AES.encrypt(
        JSON.stringify(data), 'G409dn#l smc?dj*M,d#?mcued nP!'
    ).toString();
    return encryptedData;
}

const decryptData = (data) => {
    const bytes = CryptoJS.AES.decrypt(data, 'G409dn#l smc?dj*M,d#?mcued nP!');
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return decryptedData;
}

// var data = [{id: 1, message: 'привет я Гы'}, {id: 2}]
// // Encrypt
// var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), 'secret key 123').toString();
// // Decrypt
// var bytes  = CryptoJS.AES.decrypt(ciphertext, 'secret key 123');
// var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
// // [{id: 1}, {id: 2}]
// console.log(decryptedData); 

const PORT = 25495

const wss = new ws.Server({
    port: PORT,
}, () => console.log(`Server started on ${PORT}`))

wss.on('connection', function connection(ws) {
    ws.on('message', function (messageIn) {
        const crypt = JSON.parse(messageIn);
        const message = decryptData(crypt);
        // const message = decryptData({messageIn});
        switch (message.event) {
            case '6858':
                // fetchMessages()
                broadcastMessage(message, '6858')
                break;
            case '9428':
                broadcastMessage(message, '9428')
                break;
            case 'check':
                if (message.usr === '6858' | '9428') {
                    const checkData = websocketDB.filter((e) => e.id > message.id)
                    checkData.map((data) => {
                        const crypt = encryptData(data);
                        ws.send(JSON.stringify(crypt));
                    })                    
                }
                break;
            case 'delete':
                if (message.usr === '6858' | '9428') {
                    websocketDB.splice(0);
                }
                break;
        }
    })
})

function broadcastMessage(message, username) {
    const singleMessage = {
        id: Date.now(),
        username: username,
        message: message.message,
    }
    websocketDB.push(singleMessage)
    wss.clients.forEach(client => {
        const crypt = encryptData(singleMessage)
        client.send(JSON.stringify(crypt));
    })
}
