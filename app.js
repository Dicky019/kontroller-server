const admin = require("firebase-admin");

const serviceAccount = require("./skripsi-6f26d-firebase-adminsdk-v9vov-2478224e31.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://skripsi-6f26d-default-rtdb.asia-southeast1.firebasedatabase.app"
});

const db = admin.database();

const refLampu = db.ref("/Humidity_lampu_isOn");
const refFan = db.ref("/Temperatur_fan_isOn");

const topic = 'myTopic';

const message = {
    notification: {
        title: 'Info',
        body: '',
        // sound : "default"
    },
    data: {
        color: '#6563a4',
    },
    android: {
        priority:"high",
        notification: {
            imageUrl: "https://assets1.lottiefiles.com/packages/lf20_UdIDHC.json"      }
    },
    topic: topic
};

refLampu.on("value", (snapsot) => {
    const data = snapsot.val();
    if (data) {
        message.notification.body = "Lampu Anda Menyala"
        sendMessaging(message);
    }
})
refFan.on("value", (snapsot) => {
    const data = snapsot.val();
    if (data) {
        message.notification.body = "Kipas Anda Menyala"
        sendMessaging(message);
    }
})


function sendMessaging(message) {
    admin.messaging().send(message).then((response) => {
        console.log('Successfully sent message:', response);
    })
        .catch((error) => {
            console.log('Error sending message:', error);
        });
}

// The topic name can be optionally prefixed with "/topics/".
