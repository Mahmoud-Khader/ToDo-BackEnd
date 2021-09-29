
'use strict';

const base64 = require('base-64');
const {users} = require('../models/index.js')

module.exports = async (req, res, next) => {

  if (!req.headers.authorization) {
    next('Invalid username&password');  
    return _authError(); }

    let basic = req.headers.authorization.split(' ').pop();
    let [user, pass] = base64.decode(basic).split(':');
    console.log('THIS IS BASIC ===================================================', basic, [user, pass]);
    console.log('user', user)

  console.log('my pass', pass)


  try {
    req.user = await users.authenticateBasic(user, pass)
  
    next();
  } catch (e) {
      console.log(e);
    res.status(403).send('Invalid Login');
  }

}