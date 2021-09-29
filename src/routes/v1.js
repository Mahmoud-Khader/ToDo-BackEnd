'use strict';


const express = require('express');
const dataModules = require('../models');
const router = express.Router();
const basicAuth = require('../middleware/basic');
const bearerAuth = require('../middleware/bearer');
const permissions = require('../middleware/acl.js');


router.param('model', (req, res, next) => {
    const modelName = req.params.model;
    if (dataModules[modelName]) {
      req.model = dataModules[modelName];
      next();
    } else {
      next('Invalid Model');
    }
  });

//read
  router.get('/:model', bearerAuth, permissions('read'), handleGetAll);
  router.get('/:model/:id', bearerAuth, permissions('read'), handleGetOne);
//create
  router.post('/:model', bearerAuth, permissions('create'), handleCreate);
//update
  router.put('/:model/:id', bearerAuth, permissions('update'), handleUpdate);
  router.patch('/:model/:id', bearerAuth, permissions('update'), handleUpdate);
  //delete 
  router.delete('/:model/:id', bearerAuth, permissions('delete'), handleDelete);
  




async function handleGetAll(req, res) {
    try {
      let allRecords = await req.model.get();
      res.status(200).json(allRecords);
    } catch(err) {
      throw new Error(err.message)
    }
  }

  async function handleGetOne(req, res) {
    try {
      const id = req.params.id;
      let theRecord = await req.model.get(id)
      res.status(200).json(theRecord);
    }catch(err) {
      throw new Error(err.message)
    }
  }
  
  async function handleCreate(req, res) {
    try {
      let obj = req.body;
      console.log('obj in handleCreate', obj);
      let newRecord = await req.model.create(obj);
      res.status(201).json(newRecord);
    } catch(err) {
      throw new Error(err.message)
    }
  }
  
  async function handleUpdate(req, res) {
    try {
      const id = req.params.id;
      const obj = req.body;
      let updatedRecord = await req.model.update(id, obj)
      res.status(200).json(updatedRecord);
    } catch(err) {
      throw new Error(err.message)
    }
  }
  
  async function handleDelete(req, res) {
    try {
      let id = req.params.id;
      let deletedRecord = await req.model.delete(id);
      res.status(200).send('deleted successfully :)' );
    } catch(err) {
      throw new Error(err.message)
    }
  }
  
  
  module.exports = router;