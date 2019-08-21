//config/database.js
let userDB = 'nht1206';
let passDB = '01653374206a';
const urlConnection = `mongodb://${userDB}:${passDB}@ds127300.mlab.com:27300/blog`; //your url login
module.exports = {
    urlConnection: urlConnection
}