//const mongo_client = require('mongodb').MongoClient
//const manage = require("../model/main.js")
//const csv = require('csv-parser')
const csv = require('csv')
const fs = require("fs");
const { promisify } = require('util');
const parse = promisify(csv.parse);
const iconv = require('iconv');

const import_csv = {
  load_csv: (req,res) => {
    async function readHeaderData(file, iconv) {
      let buffer = Buffer.alloc(1024);
      const fd = fs.openSync(file)
      fs.readSync(fd, buffer);
      fs.closeSync(fd);
      buffer = await iconv.decode(buffer, "utf-8");
      const options = { to_line: 1, delimiter: ',', columns: false, bom: true, trim: true };
      const rows = await parse(buffer, options);
      // Convert array to object
      return Object.fromEntries(rows);
    }

    async function readFile(file, iconv) {
      const header = await readHeaderData(file, iconv);
      console.log("readFile: File header:", header);
      fs.createReadStream(file)
      .pipe(iconv.decodeStream("utf-8"))
      .pipe(csv.parse({ from_line: 1, columns: true, bom: true, trim: true }, (err, data) => {
        // We now have access to the header data along with the row data in the callback.
        //data.forEach((row, i) => console.log( { line: i, header, row } ))
        }));
    }
    try {
      console.log('Load file from = ' + req.connection.remoteAddress);
      //console.log(req.file);
      let index = req.file.filename.lastIndexOf('.');
      var file_ext = (index < 0) ? '' : req.file.filename.substr(index+1);
      console.log('Get upload file ext = ' + file_ext);
      if(file_ext != 'csv') {
        throw new Error('Not CSV file.');
      } else {
        //var results = [];
        //fs.createReadStream(req.file.path).pipe(csv()).on('data', (data) => results.push(data)).on('end', () => {
        //  console.log(results);
        //});
        readFile(req.file.path, iconv);

        res.render('show_upload', { upfile: req.file })
      }
    } catch(err) {
      console.log(err);
      res.render('error',{ error: err });
    }
  },
  add_csv: (req,res) => {
    res.redirect('/upload');
  },
  get_status:  function(req, res) {
      console.log('Get status from = ' + req.connection.remoteAddress);
  }
}
module.exports = import_csv;
