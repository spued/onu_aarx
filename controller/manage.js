//const mongo_client = require('mongodb').MongoClient
//const manage = require("../model/main.js")
const db = require('../config/db')
const moment = require('moment');
const _ = require('lodash');

const manage_data = {
  search:(req,res) => {
     console.log('API: Search Data from IP = ' + req.connection.remoteAddress);
     let keyword = req.body.keyword;
     let api_key = "AFD4543423432B399";
     if(req.body.api_key == api_key) {
       let sql = "SELECT * from import_data WHERE Name LIKE '%" + keyword + "%' LIMIT 1";
       db.query(sql, (error, result, fields) => {
         //console.log(result);
         if(result.length > 0) {
           let NRSSP = result[0].NE_Name + '-' + result[0].Rack + '-' + result[0].Shelf + '-' + result[0].Slot + '-' + result[0].Port;
           console.log("--Got NRSSP = " + NRSSP);
           db.query("SELECT * from aarx_status WHERE NRSSP = '"+NRSSP+"' AND status = 1 LIMIT 1",(err,_result) => {
             if(_result.length > 0) {
               console.log("--Got AARX = " +_result[0].aarx);
               res.json({ message: 'ok', minrx :  _result[0].min_rx , aarx : _result[0].aarx });
             } else {
               res.json({ message: 'ok', minrx :  0 , aarx : 0 });
             }
           })
         } else {
           res.json({ message: 'not found' });
         }
       })
     } else {
       res.json({ message: 'failed' });
     }
  },
  load_data: (req,res) => {
    try {
      console.log('WEB: Load Data from IP = ' + req.connection.remoteAddress);
      var results = [];
      let sql = "SELECT uuid, original_filename, qty ,status , created_at from aarx_master ORDER BY created_at DESC LIMIT 20";
      db.query(sql, [req.params.id], (error, results, fields) =>{
        if (error) throw error;
        // results เป็น array ของข้อมูลผลลัพธ์
        // fields เป็นรายละเอียดของฟิลด์ของตาราง tbl_users ปกติเราจะไม่ได้ใช้ค่านี้เท่าไหร 
        //console.log(results); 
        res.render('manage', { title: 'Manage Data', upload_data: results });
      })
    } catch(err) {
      console.log(err);
      res.render('error',{ error: err });
    }
  },
  process_data: (req,res) => {
    res.redirect('/manage');
  },
  get_status:  function(req, res) {
      console.log('Get status from = ' + req.connection.remoteAddress);
  },
  deactivate: (req,res) => {
    //console.log(req);
    console.log("WEB: GET deactivate request for uuid" + req.body.uuid);
    const uuid = req.body.uuid;
    db.query("SELECT id, status from aarx_master WHERE uuid ='" + uuid + "'", (err, results) => {
        //console.log(results);
        var master_id = results[0].id;
        console.log("Master = " + master_id);
        let sql = "UPDATE aarx_master SET status = 2 WHERE id = " + master_id;
        db.query(sql,(err,res) => {
          let sql = "UPDATE aarx_status SET status = 2 WHERE master_id = " + master_id;
          db.query(sql,(err,res) => {
          });

        });
        res.json({ title: 'Deactivate Data', message: 'ok' });
        return 0;
    });
  },
  reactivate: (req,res) => {
    //console.log(req);
    console.log("WEB: GET reactivate request for uuid" + req.body.uuid);
    const uuid = req.body.uuid;
    db.query("SELECT id, status from aarx_master WHERE uuid ='" + uuid + "'", (err, results) => {
        //console.log(results);
        var master_id = results[0].id;
        console.log("Master = " + master_id);
        let sql = "UPDATE aarx_master SET status = 1 WHERE id = " + master_id;
        db.query(sql,(err,res) => {
          let sql = "UPDATE aarx_status SET status = 1 WHERE master_id = " + master_id;
          db.query(sql,(err,res) => {
          });

        });
        res.json({ title: 'Deactivate Data', message: 'ok' });
        return 0;
    });
  },
  activate: async (req,res) => {
    //console.log(req);
    console.log("WEB: GET activate request for uuid" + req.body.uuid);
    const uuid = req.body.uuid;
    var NRSSP = [];
    var master_id = null;
    await db.query("SELECT id, status from aarx_master WHERE uuid ='" + uuid + "'", (err, results) => { 
        //console.log(results);
        master_id = results[0].id;
        console.log("Master = " + master_id);
        return 0;
    });
    let sql = "SELECT * from import_data WHERE uuid ='" + uuid + "'";
    try {
      console.log('Load Data from IP = ' + req.connection.remoteAddress);
      var results = [];
      db.query(sql, (error, results, fields) =>{
        if (error) throw error;
        console.log("Found records = " + results.length);
        if(results.length) {
          //console.log(results);
          var groupedNE_Name = _.groupBy(results, "NE_Name");
          //var grouped = _.mapValues(_.groupBy( results, "NE_Name")); //, clist => clist.map(results => _.omit(results, 'NE_Name')));
          _.forEach(groupedNE_Name, (value, index) => {
             let NRSSP_sub = [];
             //console.log("NE-" + index);
             //NRSSP_sub.push(index);
             var groupedRack = _.groupBy(value, "Rack");
               _.forEach(groupedRack, (_value, _index) => {
                  //console.log("-Rack-" + _index);
                   //NRSSP_sub.push(_index);
                  var groupedShelf = _.groupBy(_value, "Shelf");
                    _.forEach(groupedShelf, (__value, __index) => {
                      //console.log("--Shelf-" + __index);
                      //NRSSP_sub.push(__index);
                      var groupedSlot = _.groupBy(__value, "Slot");
                        _.forEach(groupedSlot, (___value, ___index) => {
                          //console.log("---Slot-" + ___index);
                           //NRSSP_sub.push(___index);
                          var groupedPort = _.groupBy(___value, "Port");
                            _.forEach(groupedPort, (____value, ____index) => {
                              //console.log("----Port-" + ____index);
                              NRSSP_sub.push(index + '-' + _index + '-' + __index + '-' + ___index + '-' + ____index);
                          });
                      });
                   });
               });
              //console.log(NRSSP_sub);
              NRSSP.push(NRSSP_sub); 
          });
          //console.log(NRSSP);
          var _sql = "";
          var __sql = "INSERT INTO aarx_status (master_id, NRSSP, NE_Name, Rack, Shelf,"
                         +" Slot, Port , max_rx, min_rx, aarx, max_distance, min_distance, avg_distance, cpe_count, status) " +
                         " VALUE (?,?,?,?,?,?,?,?,?,?,?,?,?,?,1)";
          var max_rx, min_rx, aarx, min_distance, max_distance, avg_distance = 0; 
          _.forEach(NRSSP,(val,ind) => {
            //console.log("Index = " + ind)
             _.forEach(val, (_val, _ind) =>  {
               //console.log(_val);
               var v = _val.split('-');
               _sql = "SELECT count(*) as cpe_count, AVG(Received_Optical_Power) as aarx, " +
                                                         "MIN(Received_Optical_Power) as min_rx, " +
                                                         "MAX(Received_Optical_Power) as max_rx, " +
                                                         "AVG(ONU_ranging) as avg_distance, " +
                                                         "MIN(ONU_ranging) as min_distance, " +
                                                         "MAX(ONU_ranging) as max_distance " + 
                                   "FROM import_data WHERE uuid = '"
                                   + uuid + "' AND NE_Name = '"
                                   + v[0] +"'  AND Rack = " 
                                   + v[1] +"  AND Shelf = " 
                                   + v[2] +"  AND Slot = "
                                   + v[3] +"  AND Port = "
                                   + v[4] + " AND NOT OLT_Received_Optical_Power = '--'";
               //console.log(_ind + ' : ' + _sql);
               db.query(_sql, (error, _res, fields) => {
                if(error) throw error;
                let _data = [];
                //console.log("Master = " + master_id);
                /*
                 console.log(_val + " : cpe_count = " + _res[0].cpe_count 
                                  + " : A@RX = " + _res[0].aarx
                                  + " : min. = " + _res[0].min_rx
                                  + " : max. = " + _res[0].max_rx );
               */
               // filter for null value
               max_rx  = _res[0].max_rx ? _res[0].max_rx : 0.00;
               min_rx  = _res[0].min_rx ? _res[0].min_rx : 0.00;
               aarx  = _res[0].aarx ? _res[0].aarx : 0.00;
               max_distance  = _res[0].max_distance ? _res[0].max_distance : 0;
               min_distance  = _res[0].min_distance ? _res[0].min_distance : 0;
               avg_distance  = _res[0].avg_distance ? _res[0].avg_distance : 0;
               if(max_distance == '--') max_distance  =0;
               if(min_distance == '--') min_distance  =0;
               if(avg_distance == '--') avg_distance  =0;

               _data.push(master_id);
               _data.push(_val);
               _data.push(v[0]);
               _data.push(v[1]);
               _data.push(v[2]);
               _data.push(v[3]);
               _data.push(v[4]);
               _data.push(max_rx);
               _data.push(min_rx);
               _data.push(aarx);
               _data.push(max_distance);
               _data.push(min_distance);
               _data.push(avg_distance);
               _data.push(_res[0].cpe_count);

               //console.log(_data);

                 db.query(__sql, _data, (error, __res, fields) => {
                     if(error) throw error;
                     //console.log(__res);
                 })
               });
             }) 
            //console.log("Total port = " + val.length);
          })
          // Begin calculation.
          //console.log("Total NE_Name = " + NRSSP.length);
        } else {
        }
        _sql = "UPDATE aarx_master SET status = 1 WHERE id = " +master_id;
        db.query(_sql,(err,res) => {});
        res.json({ title: 'Activate Data', message: 'ok' });
      })
    } catch(err) {
      console.log(err);
      res.json({ error: err });
    }
  }
}
module.exports = manage_data;