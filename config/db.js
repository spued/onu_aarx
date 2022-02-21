require('dotenv').config();
const mysql = require('mysql')


const db = mysql.createConnection({
    socketPath : process.env.SOCKET_PATH,
    host     : process.env.DB_HOST,
    user     : process.env.DB_USER,
    port     : process.env.DB_PORT,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_DATABASE
  })
db.connect((err) =>{
    if(err){
        console.error('error connecting: ' + err.stack)
        return
    }
    console.log('connected as id ' + db.threadId)
})
// db.end()
module.exports = db
