const http = require('http');
const express = require('express');
const app = express();
var bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
app.use("/static", express.static("static"));
const port = 3000;
const host = 'localhost';
app.set('views', './views');
app.set('view engine', 'pug');
var up = bodyParser.urlencoded({ extended: false })  
const session = require('express-session');
const crypto = require('crypto');
const mysql = require('mysql');
const {v4: uuid4} = require('uuid');
const { toNamespacedPath } = require('path');
const { futimesSync } = require('fs');

const generateRandomString = (length) => {
  return crypto.randomBytes(length).toString('hex');
};
const secretKey = generateRandomString(32); 

app.use(bodyParser.json());

app.use(session({
    secret: secretKey,
    resave: false,
    saveUninitialized: true,
}));

const tcon = mysql.createConnection({
    host: 'localhost',
    user:'root',
    password:'minakshi@123',
    database:'taskmgmt',
    port:3306
})
const users = [
    { id: 1, username: 'user1', password: '123456', position: 'Admin' },
    { id: 2, username: 'user2', password: '123456', position: 'User' },
    { id: 3, username: 'user3', password: '123456', position: 'User' },
    { id: 4, username: 'user4', password: '123456', position: 'User'}
  ];

app.get("/1/login", (req, res) => {
    res.render("login.pug");
})
app.post("/1/login",up,(req,res) => {
    if(req.body.action==='loginbutton'){
        const user = users.find((u) => u.username === req.body.username && u.password === req.body.password);
       
        if (!user) {
            return res.send('Authentication failed please try again.');
        }else{
            req.session.userId = user.id;
            req.session.username = user.username;
            req.session.position = user.position;
            res.send("login")
        }
    }
})
app.get("/1/mainmenu",(req,res)=>{
    if(req.session.userId){
        username = req.session.username
        res.render("mainmenu.pug",{username:req.session.username,userId:req.session.userId,position:req.session.position});
    }
})
app.post("/1/mainmenu",up,(req,res)=>{
    if(req.body.action==='retriveadmin'){
        let arr=[];
        for (let i = 0; i < users.length; i++) {
            if (users[i].position === 'Admin') {
                var username = users[i].username
                var id = users[i].id
                arr.push('{"username":"' + username + '","id":"' + id + '"}');
            }
        }
        res.send(arr)
    }
    else if(req.body.action==='retriveuser'){
        let arr=[];
        for (let i = 0; i < users.length; i++) {
            if (users[i].position === 'User') {
                var username = users[i].username
                var id = users[i].id
                arr.push('{"username":"' + username + '","id":"' + id + '"}');
            }
        }
        res.send(arr)
    }
    else if(req.body.action==='sendtask'){
        let fromid=req.body.fromid;
        let touserid=req.body.touserid;
        let subjectid=req.body.subjectid;
        let description=req.body.description;
        let dateid=req.body.dateid;
        let duedateid=req.body.duedateid;
        let statusid=req.body.statusid;
        let priorityid=req.body.priorityid;
        let taskid=uuid4();
        let sql = "insert into task(fromname,toname,subject,description,startdate,duedate,status,priority,taskid) values('"+fromid+"','"+touserid+"','"+subjectid+"','"+description+"','"+dateid+"','"+duedateid+"','"+statusid+"','"+priorityid+"','"+taskid+"')";
        tcon.query(sql,function(err,result){
            if(err) console.log(err)
            else if(result.affectedRows>0){
                res.send("Information Save Successfully...")
            }else{
                res.send("Something Went Wrong Please Try Again...")
            }
        })
    }
    else if(req.body.action==='showtaskdata'){
        let fromdate=req.body.sdate+" 00:00:00";
        let todate=req.body.edate+" 23:59:59";
        if(req.session.position=='User'){
            var sql="select * from task where startdate between '"+fromdate+"' and '"+todate+"' and toname='"+req.session.username+"'";
        }else{
            var sql="select * from task where startdate between '"+fromdate+"' and '"+todate+"'"; 
        }
            tcon.query(sql,function(err,result){
            if(err) console.log(err)
            else if(result.length>0){
                sr1 = []
                if(req.session.position === 'User'){
                    out = "<table id='report'><tr><th>From</th><th>To</th><th>Subject</th><th>Description</th><th>Start Date</th><th>Due Date</th><th>Status</th><th>Priority</th><th>Update</th></tr>"
                }else{
                    out = "<table id='report'><tr><th>From</th><th>To</th><th>Subject</th><th>Description</th><th>Start Date</th><th>Due Date</th><th>Status</th><th>Priority</th><th>Update</th><th>Delete</th></tr>"
                }
                for (i = 0; i < result.length; i++) {
                
                    var from = result[i].fromname;
                    if(from=='' || from=='null' || from=='undefined' || from==null || from==undefined){
                        from='';
                    }
                    var to = result[i].toname;
                    if(to=='' || to=='null' || to=='undefined' || to==null || to==undefined){
                        to='';
                    }
                    var subject = result[i].subject;
                    if(subject=='' || subject=='null' || subject=='undefined' || subject==null || subject==undefined){
                        subject='';
                    }
                    var description = result[i].description;
                    if(description=='' || description=='null' || description=='undefined' || description==null || description==undefined){
                        description='';
                    }
                    var startdate=new Date(result[i].startdate);
                    startdate=startdate.getDate() + '-' + ('0' + (startdate.getMonth() + 1)).slice(-2) + '-' + ('0' + startdate.getFullYear()).slice(-2) + ' ' + ('0' + startdate.getHours()).slice(-2)+ ':' + ('0' + startdate.getMinutes()).slice(-2)+ ':' + ('0' + startdate.getSeconds()).slice(-2);
                    if(startdate === "NaN-aN-aN aN:aN:aN" || startdate === null || startdate === 'undefined') {
                        startdate = ""
                    }
                    var duedate=new Date(result[i].duedate);
                    duedate=duedate.getDate() + '-' + ('0' + (duedate.getMonth() + 1)).slice(-2) + '-' + ('0' + duedate.getFullYear()).slice(-2) + ' ' + ('0' + duedate.getHours()).slice(-2)+ ':' + ('0' + duedate.getMinutes()).slice(-2)+ ':' + ('0' + duedate.getSeconds()).slice(-2);
                    if(duedate === "NaN-aN-aN aN:aN:aN" || duedate === null || duedate === 'undefined') {
                        duedate = ""
                    }
                    var status = result[i].status;
                    if(status=='' || status=='null' || status=='undefined' || status==null || status==undefined){
                        status='';
                    }
                    var priority = result[i].priority;
                    if(priority=='' || priority=='null' || priority=='undefined' || priority==null || priority==undefined){
                        priority='';
                    }
                    if(req.session.position === 'User'){
                        out = out + "<tr><td>"+from+"</td><td>"+to+"</td><td>"+subject+"</td><td>"+description+"</td><td>"+startdate+"</td><td>"+duedate+"</td><td>"+status+"</td><td>"+priority+"</td><td><button onclick=openeditdigbox('"+result[i].taskid+"')>Update</button></td></tr>"
                    }else{
                        out = out + "<tr><td>"+from+"</td><td>"+to+"</td><td>"+subject+"</td><td>"+description+"</td><td>"+startdate+"</td><td>"+duedate+"</td><td>"+status+"</td><td>"+priority+"</td><td><button onclick=openeditdigbox('"+result[i].taskid+"')>Update</button></td><td><button onclick=deletetaskbtn('"+result[i].taskid+"')>Delete</button></td></tr>"
                    }
                }
                    out = out + "</table>"
                    res.send(out);
                
            }else{
                res.send("No Data")
            }
        })
    }
    else if(req.body.action==='edittaskdetails'){
        let fromid=req.body.fromid;
        let touserid=req.body.touserid;
        let subjectid=req.body.subjectid;
        let description=req.body.description;
        let dateid=req.body.dateid;
        let duedateid=req.body.duedateid;
        let statusid=req.body.statusid;
        let priorityid=req.body.priorityid;
        let sql = "update task set fromname='"+fromid+"',toname='"+touserid+"',subject='"+subjectid+"',description='"+description+"',startdate='"+dateid+"',duedate='"+duedateid+"',status='"+statusid+"',priority='"+priorityid+"' where taskid='"+req.body.taskid+"'";
        tcon.query(sql,function(err,result){
            if(err) console.log(err)
            else if(result.affectedRows>0){
                res.send("Information Updated Successfully...")
            }else{
                res.send("Something Went Wrong Please Try Again...")
            }
        })
    }
    else if(req.body.action==='deletetaskbtn'){
        let taskid = req.body.taskid;
        let sql="delete from task where taskid='"+taskid+"'";
        tcon.query(sql,function(err,result){
            if(err) console.log(err)
            else if(result.affectedRows>0){
                res.send("Task Deleted Successfully...")
            }else{
                res.send("Something Went Wrong Please Try Again...")
            }
        })
    }
    else{
        res.send("error")
    }
})
app.listen(port, ()=>{
    console.log('Server started at  port ${port}')
})