const { append } = require("express/lib/response");
const express= require('express')
const route=express.Router()
 



const Pool = require('pg').Pool;
const { RowDescriptionMessage } = require("pg-protocol/dist/messages");
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'volunteerdb',
    password: 'dioo',
    port:5432,
})
 
route.get('/',(req,res)=>{
     
  res.render('login')
    })

route.post('/login',(req,res)=>{
 
   let username = req.body.username;
    let password = req.body.password;
 
    req.session.error= 'Please check your username and password'
    pool.query('SELECT * FROM tbl_volunteer where username = $1 and password = $2', [username, password], (error, results) => {
            if (error) {


                throw error
            }
            if (results.rowCount !=1){
                
                res.redirect('/?error=100')  
                  
            }
            else
            {
            req.session.username=username;
            res.redirect('index')
            }
    })

})
          
route.post('/index',(req,res)=>{
    pool.query('SELECT * FROM tbl_listing ORDER BY id ASC', (error, results) => {
        if (error) {
            throw error
        }
        req.session.username=username;
        res.render('index', {'listings':results.rows})
    })

})

route.get('/index',(req,res)=>{

    console.log("username  in index -get is ;" + req.session.username)
    
    pool.query('SELECT * FROM tbl_listing ORDER BY id ASC', (error, results) => {
        if (error) {
            throw error
        }
        res.locals.username=  req.session.username;
        res.render('index', {'listings':results.rows})
    })
    //res.render('index');
})

route.get('/createvolunteer',(req,res)=>{
    console.log("username  in create volunteer -get is ;" + req.session.username)
    res.render('createvolunteer');
})


route.post('/createvolunteer',(req,res)=>{
    const {fname, lname, username, password, email, phonenumber}= req.body
    
    pool.query('INSERT INTO tbl_volunteer (fname, lname, username, password, email, phonenumber) VALUES ($1, $2, $3, $4, $5, $6)', [fname, lname, username, password, email, phonenumber], (error, results) => {
    if (error) {
        console.log(error)
        throw error
    }
   // res.status(200).send('User added successfully!')
    req.session.username=username;
    res.redirect('/index')

})
    //res.render('createvolunteer');
})
route.get('/seeker',(req,res)=>{
    console.log(req.session.username)
    console("username  in seeker -get is ;" + req.session.username)
    res.render('seeker');
})

route.post('/seeker',(req,res)=>{
    console.log(req.session.username)
    const {mylocation, description, volunteercount}= req.body
    var user=req.session.username;
    console("username  in seeker -post is ;" + req.session.username)
    pool.query('INSERT INTO tbl_listing(location, description, volunteercount, username) VALUES ($1, $2, $3, $4)', [mylocation, description, volunteercount,user], (error, results) => {
    if (error) {
        console.log(error)
        throw error
    }

    res.redirect('index');
})
})




route.get('/listings',(req,res)=>{
    console.log("username  in listing -get is ;" + req.session.username)
    res.render('listings');
})



route.get('/delete/:id',(req,res)=>{
    console.log("username  in delete id -get is ;" + req.session.username)
      id=parseInt(req.params.id);
    console.log(id)
    pool.query('DELETE FROM tbl_listing where id = $1', [id], (error, results) => {
        if (error) {
            console.log(error)
            throw error
        }
    
    res.redirect('../index');
})


})


route.get('/edit/:id',(req,res)=>{
    console.log("username  in edit listing -get is ;" + req.session.username)
      id=parseInt(req.params.id);
  
    pool.query('select * FROM tbl_listing where id = $1', [id], (error, results) => {
        if (error) {
            console.log(error)
            throw error
        }
    console.log(results.rows)
 

    res.render('editlisting', {'listing':results.rows});
})


})


route.post('/updaterecord',(req,res)=>{
    console.log("username  in update record -post is ;" + req.session.username)
    //  id=parseInt(req.params.id);
    const {id, mylocation, description, volunteercount}= req.body

    pool.query('update tbl_listing set location = $2 , description=$3, volunteercount=$4 where id = $1', [id, mylocation, description, volunteercount], (error, results) => {
        if (error) {
            console.log(error)
            throw error
        }
    console.log("user modified with id :"+id)
 

     
    res.redirect('/index')
})


})
module.exports= route