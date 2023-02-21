require('dotenv').config();
const mysql = require('mysql')


const db = mysql.createPool({
    //socketPath : process.env.SOCKET_PATH,
    host     : process.env.DB_HOST,
    user     : process.env.DB_USER,
    port     : process.env.DB_PORT,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_DATABASE,
    connectionLimit : 32
})
  
if(process.env.NODE_ENV == 'development') {
 delete db.socketPath;
}
db.getConnection(function(err, connection) {
  if (err) throw err; // not connected!

  // Use the connection
  /* connection.query('SELECT * FROM tbl_users', function (error, results, fields) {
    // When done with the connection, release it.
    //console.log('-- DB: pool connected');
    connection.release();

    // Handle error after the release.
    if (error) throw error;

    // Don't use the connection here, it has been returned to the pool.
  }); */
});
db.on('acquire', function (connection) {
  //console.log('-- DB: Connection %d acquired', connection.threadId);
});
db.on('connection', function (connection) {
  console.log('-- DB: get connection');
});
db.on('enqueue', function () {
  //console.log('-- DB: Waiting for available connection slot');
});
db.on('release', function (connection) {
  //console.log('-- DB: Connection %d released', connection.threadId);
});
// db.end()
module.exports = db
