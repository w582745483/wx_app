var express = require('express');
var router = express.Router();
const {UserModel}=require('../db/db.models')
router.post('/register',(req,resp)=>{
  const {username,password,email,phone,uuid}=req.body
  console.log(username,password,email,phone,uuid)
  resp.send('register!!')
})


module.exports = router;
