const admin = require("firebase-admin");

const serviceAccount = require("./skripsi-6f26d-firebase-adminsdk-v9vov-2478224e31.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://skripsi-6f26d-default-rtdb.asia-southeast1.firebasedatabase.app"
});

const firestore = admin.firestore()

const db = admin.database();

// mudu

const refLampu = db.ref("/Humidity_lampu_isOn");
const refFan = db.ref("/Temperatur_fan_isOn");

const topic = 'myTopic';
const imageFan = 'https://raw.githubusercontent.com/Dicky019/kontroller-server/master/assets/fan.png'
const imageLamp = 'https://raw.githubusercontent.com/Dicky019/kontroller-server/master/assets/lamp.png'

const message = {
    notification: {
        title: 'Info',
        body: '',
        // sound : "default"
    },
    android: {
        priority: "high",
        notification: {
            imageUrl: '',
        }
    },
    topic: topic
};

firestore.collection("mac").onSnapshot(docSnapshot => {
    docSnapshot.docs.forEach((element)=>{
        const isLogin = element.data().isLogin;
        const nama = element.data().nama;
        console.log(isLogin);
        if (isLogin) {
            message.topic = nama
            console.log(nama);
            refLampu.on("value", (snapsot) => {
                const data = snapsot.val();
                if (data) {
                    message.notification.body = "Lampu Anda Menyala"
                    message.android.notification.imageUrl = imageLamp
                    sendMessaging(message);
                }
            })
            refFan.on("value", (snapsot) => {
                const data = snapsot.val();
                if (data) {
                    message.notification.body = "Kipas Anda Menyala"
                    message.android.notification.imageUrl = imageFan
                    sendMessaging(message);
                }
            })
        }
    })
  }, err => {
    console.log(`Encountered error: ${err}`);
  });


function sendMessaging(message) {
    admin.messaging().send(message).then((response) => {
        console.log('Successfully sent message:', response);
    })
        .catch((error) => {
            console.log('Error sending message:', error);
        });
}