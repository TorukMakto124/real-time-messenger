const websocketDB = [];
const ws = require('ws');

const PORT = 25495

const wss = new ws.Server({
    port: PORT,
}, () => console.log(`Server started on ${PORT}`))

wss.on('connection', function connection(ws) {
    ws.on('message', function (messageIn) {
        const message = JSON.parse(messageIn)
        // console.log(JSON.parse(messageIn));
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
                    checkData.map((data) => ws.send(JSON.stringify(data)))                    
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
        client.send(JSON.stringify(singleMessage));
    })
}
