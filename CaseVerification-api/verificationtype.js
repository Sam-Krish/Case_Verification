const mysql = require('mysql');
const express = require('express');
var app = express();
var bodyParser = require('body-parser')
const cors = require('cors');

var corsOptions = {
    origin: true,
    optionsSuccessStatus: 200 // For legacy browser support
}


app.use(function (req, res, next) {
    
    bodyParser.json({ type: 'application/*+json' });
    bodyParser.text({ type: 'text/html' });
    bodyParser.raw({ type: 'application/vnd.custom-type' });

    (cors(corsOptions));

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

module.exports = app;


var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password : '12345',
    database : 'caseverificationdb',
    multiplestatements : true
});

mysqlConnection.connect((err)=> {
    if(!err)
    console.log('Db is Sucess');
    else
    console.log('db is failed \n Error :' + JSON.stringify(err, undefined, 2));
});

app.listen(4600,()=>console.log('Express server is running  at port 4600'));

app.get('/', function (req, res) {

    
    res.send('hello world')
})


app.get('/verificationtype',(req,res)=>{
    mysqlConnection.query('SELECT * FROM verificationtype',(err, rows, fields)=>{
        if(!err)
        res.send(rows);
        else
        console.log(err);
    })
});


//post

var jsonParser = bodyParser.json()

app.post('/verificationtype',jsonParser, (req,res)=>{
    let emp = req.body;
    var sql = `INSERT INTO caseverificationdb.verificationtype (ID,Name)
    VALUES
    (
        ?,?
    )`;
    console.log("insert log" +req.body);
    //added result 
    mysqlConnection.query(sql, [emp.ID,emp.Name], (err,result)=>{
        
        if(!err)
        {
            console.log("inserted ... " + result.insertId);
            res.json(result);
        }
        else
        {
            console.log(err);
            res.json(err);

        }
    });
});

//delete

app.delete('/verificationtype/:id',(req,res)=>{
    mysqlConnection.query('DELETE FROM documents WHERE ID = ?',[req.params.id],(err, rows, fields)=>{
        
        if(!err){
            console.log('hello world');
            res.send(JSON.stringify({ msg: 'Deleted.....' }));
         }
        else 
            {
        console.log(err);
            }
    })
});


//Update postjobs id 
app.put('/verificationtype',jsonParser,(req,res)=> {
    let emp = req.body;
    var sql = 'UPDATE caseverificationdb.verificationtype SET Name=?  WHERE ID = ?';
    mysqlConnection.query(sql, [emp.Name,emp.ID],(err, result)=>{
        if(!err)
            res.json(result);
        else
        console.log(err);
    });
});

