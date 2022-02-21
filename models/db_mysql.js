const mysql = require('mysql') 
 
const db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'testdb'
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
