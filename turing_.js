const express = require("express");
const mysql  = require("mysql");
const body = require("body-parser");
const dotenv=require('dotenv').config()
const app = express();
app.use(body.json())
const port = 3000
const jwt = require('jsonwebtoken');


var knex = require('knex')({
	client: 'mysql',
	connection: {
	  host : process.env.DB_HOST,
	  user : process.env.DB_USER,
	  password : process.env.DB_PASSWORD,
	  database : process.env.DB_DATABASE
	}
  });


knex.schema.createTable('saveForLater', function (table) {
    table.integer('item_id');
    table.string("cart_id");
    table.integer('product_id');
    table.string('attributes');
    table.integer('quantity');
  })
  .then(()=>{
      console.log('create_table');
      res.send('create_table')
      
  })
  .catch(()=>{
      console.log("table already exists...");
      
  })



app.use('/department', department = express.Router())
require('./department')(department,knex)

app.use('/categories',categories = express.Router())
require('./categories')(categories,knex)

app.use('/attributes', attribute = express.Router())
require('./attribute')(attribute,knex)

app.use('/products', product = express.Router())
require('./product')(product,knex,jwt)

app.use('/coustomers', customer = express.Router())
require('./coustomer')(customer,knex,jwt)

app.use('/orders',order = express.Router())
require('./orders')(order,knex,jwt)

app.use('/shoppingcart',shoppingcart = express.Router())
require('./shoppingcart')(shoppingcart,knex,jwt)

app.use('/shipping',shipping = express.Router())
require('./shipping')(shipping,knex)


app.listen(port,()=>{
    console.log(`your port is working ${port}`)
})
