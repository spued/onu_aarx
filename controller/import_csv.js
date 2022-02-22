//const mongo_client = require('mongodb').MongoClient
//const manage = require("../model/main.js")
const db = require('../config/db')
const csv = require('csv-parser')
const fs = require("fs");
const { nanoid } = require('nanoid')

const import_csv = {
  load_csv: (req,res) => {
    try {
      console.log('Load file from = ' + req.connection.remoteAddress);
      console.log(req.file);
      var results = [];
      const uuid = nanoid();
      let index = req.file.filename.lastIndexOf('.');
      var file_ext = (index < 0) ? '' : req.file.filename.substr(index+1);
      console.log('Get upload file ext = ' + file_ext);
      if(file_ext != 'csv') {
        throw new Error('Not CSV file.');
      } else {
	fs.createReadStream(req.file.path)
  	.pipe(csv())
  	.on('data', (data) => results.push(data))
  	.on('end', () => {

                let sql = `INSERT INTO import_data ( uuid ,Location_Path, NE_Name , NE_IP, NE_Type, Rack, Shelf, Slot, Port,
                        ONU_ID, Name, ONU_Configured_Type, Vendor_Name , ONU_Ranging , Service_Type, Administrative_Status,Operational_Status,
                        Authentication_Mode, Authentication_Value,  MAC_SN , Installation_Date, Received_Optical_Power, 
                        Transmitted_Optical_Power, Temperature, Voltage, Bias_Current, OLT_Received_Optical_Power ) 
                        VALUES ( ? , ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )`;
    		console.log('Got results row = ' + results.length);
		results.forEach((ele, ind) => {
                  let _value = Object.values(ele);
                  _value.unshift(uuid);
                  // patch some data to remove dash -
                  _value[1] = _value[1].replace(/-/g, '_');
                  _value[2] = _value[2].replace(/-/g, '_');
                  _value[3] = _value[3].replace(/-/g, '_');
                  //console.log(_value);
                  db.query(sql, _value , (error, res, fields)=>{
                    if(error) {
                      throw new Error('DB Insert failed:');
                    }
                  })
                })

                sql = "INSERT INTO aarx_master (uuid,filename,qty,original_filename) VALUES ( '" 
                                         + uuid 
                                         + "', '" + req.file.filename
                                         + "', '" + results.length 
                                         + "', '" + req.file.originalname 
                                         + "')" ;
                console.log(sql);
                db.query(sql);
                res.render('show_upload', { upfile: req.file, qty : results.length });
  	});
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
