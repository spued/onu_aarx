const db = require('../config/db');
const moment = require('moment');

const data_collector = {
    update_prefix_master : () => {
        console.log('Controller: Update prefix master');
        // Read all active master
        
        let sql = 'SELECT * FROM aarx_master WHERE status = 1 ORDER BY created_at DESC';
        db.query(sql,(error, res) => {
            if(error) return 1;
            // console.log(res);
            var master_id_list = [];
            for(element of res) {
               //console.log('id = ' + element.id + ' qty = ' + element.qty);
               master_id_list.push(element.id);
            };
            //console.log(master_id_list);
            sql = 'DELETE from prefix_master';
            db.query(sql, (err,__res) => {
                sql = 'SELECT substr(NE_Name, 1,3) AS prefix, COUNT(*) AS prefix_count FROM aarx_status WHERE master_id IN (' + master_id_list + ') GROUP BY substr(NE_Name, 1,3)';
                //console.log(sql);
                db.query(sql,(error, _res) => {
                    if(error) return 1;
                    for(element of _res) { 
                        //console.log(element.prefix + ' = ' + element.prefix_count);
                        sql = "INSERT INTO prefix_master (prefix_name, counter) VALUE ('" + element.prefix + "','" + element.prefix_count + "')";
                        //console.log(sql);
                        db.query(sql, (err,__res) => {
                        });
                    }
                    return 0;
                })
            })
        })
    },
    update_prefix_history_data : () => {
        console.log('Controller: Update prefix history data');
        var sql = "SELECT * FROM prefix_master WHERE status = 0 LIMIT 10";
        db.query(sql, (err, res) => {
            if(err) return 1;
            for(ele of res) {
                sql = "SELECT * FROM import_data WHERE NE_NAME like '" + ele.prefix_name + "%'";
                db.query(sql, (err, _res) => {
                    if(err) return 1;

                    //console.log(_res.length);
                    /* for(item of _res) {
                        const [ n,r,sh,sl,p ] = item.NRSSP.split('-');
                        //console.log(nrssp);
                        sql = "SELECT * FROM import_data WHERE" +
                        " NE_Name = '" + n + "'" +
                        " AND Rack = " + r +
                        " AND Shelf = " + sh +
                        " AND Slot = " + sl +
                        " AND Port = " + p;
                        //console.log(sql);
                        db.query(sql, (err, __res) => {
                            console.log(__res);
                        })
                    } */
                })
            }
        })
    }
}

module.exports = data_collector;