module.exports = (shoppingcart,knex,jwt)=>{


////  genrate cart id with customer_id


    shoppingcart.post('/add',(req,res)=>{
        var cookie1 = req.headers.cookie.split(' ')
        var cookie2 = cookie1[cookie1.length-1].slice(0,-10)
        jwt.verify(cookie2,'sanjay',(err,stock)=>{
            knex
            .select('item_id','image','shopping_cart.product_id','product.product_id','price','name','added_on','attributes','quantity','cart_id')
            .from('shopping_cart')
            .join('product', function(){
                this.on('shopping_cart.product_id', 'product.product_id')
            })
            .where({'cart_id':stock.customer_id,
            'shopping_cart.product_id':req.body.product_id,
             'attributes':req.body.attributes})
            .then((data)=>{
            
                if (data.length>0){
                    let free = data[0].quantity+1
                
                    knex('shopping_cart')
                    .update({'quantity': free})
                    .where('product_id', data[0].product_id)
                    .then(()=>{
                        knex('shopping_cart')
                        .select('item_id','image','shopping_cart.product_id','product.product_id','price','name','added_on','attributes','quantity','cart_id')
                        .where('shopping_cart.cart_id', data[0].cart_id)
                        .join('product', function(){
                            this.on('shopping_cart.product_id', 'product.product_id')
                        })
                        .then(data => {


                            let arry2 = data.map(x=>{
                                x.subtotal = x.price*x.quantity
                                knex('shopping_cart')
                                .update({'subtotal':x.subtotal})
                                return x
                            })
                            console.log('fulldata',arry2);
                            
                            
                    
                            

                        })  
                        .catch(err => console.log(err));
                        res.send('update')
                        
                    })
                    .catch(err => console.log(err));
                }else{
                    knex('shopping_cart')
                    .insert({
                        'cart_id':stock.customer_id,
                        'product_id':req.body.product_id,
                        "attributes":req.body.attributes,
                        "quantity": 1,
                        "added_on":new Date()
                }).then(()=>{
                    
                    knex
                    .select('item_id','image','shopping_cart.product_id','product.product_id','price','name','added_on','attributes','quantity','cart_id')
                    .from('shopping_cart')
                    .join('product','shopping_cart.product_id','=','product.product_id')
                    .where('shopping_cart.cart_id',stock.customer_id)
                    .then((data)=>{

                        let arry = data.map(x=>{
                            x.subtotal = x.price*x.quantity
                            knex('shopping_cart')
                            .update({'subtotal':x.subtotal})
                            return x
  
                        })
                        console.log('data',arry)

                        res.send('done')
                         
                    })
                    .catch((err)=>{
                        res.send(err)
                    })
                })
                .catch((err)=>{
                    res.send(err)
                })            
                }   
            })
        })
    })



    shoppingcart.get('/:cart_id',(req,res)=>{
        knex
        .select('item_id','image','shopping_cart.product_id','product.product_id','price','name','attributes','quantity')
        .from('shopping_cart')
        .join('product', function(){
            this.on('shopping_cart.product_id', 'product.product_id')
        })
        .where('shopping_cart.cart_id',req.params.cart_id)
        .then((data1)=>{
            let array = data1.map(x=>{
                x.subtotal = x.price*x.quantity
                return x
            })
            console.log(array);
            res.send(array)
            
            
        })
        .catch((err)=>{
            console.log(err);
            res.send(err)
            
        })

    })
///////////////// quantity update by item_id/////////////////////////////


    shoppingcart.put('/update/:item_id',(req,res)=>{
       knex.update({
        "quantity":req.body.quantity

       }).table('shopping_cart').where('item_id',req.params.item_id)

       .then(()=>{
           console.log('updated_ quantity');
           res.send("update")
           
       })
       .catch((err)=>{
           console.log(err);
           res.send(err)
           
       })




    })

    shoppingcart.delete('/empty/:cart_id',(req,res)=>{
        knex('shopping_cart')
        .where("cart_id",req.params.cart_id)
        .del()
        .then(()=>{
            console.log('empty');
            res.send('empty')
            
        })
        .catch((err)=>{
            console.log(err);
            res.send(err)
            
        })
    })


    shoppingcart.get('/totalAmount/:cart_id',(req,res)=>{
        knex('shopping_cart')
        .select('cart_id','item_id','image','shopping_cart.product_id','product.product_id','price','name','attributes','quantity')
        .join('product', function(){
            this.on('shopping_cart.product_id', 'product.product_id')
        })
        .where("cart_id",req.params.cart_id)
        .then((data)=>{
            let arry = data.map(x=>{
                x.totalAmount = x.price*x.quantity
                return x
            })
            console.log(arry);
            res.send(arry)
            
            
            
        })
        .catch((err)=>{
            console.log(err);
            res.send(err)
            
        })
    })

    shoppingcart.get('/saveForLater/:item_id',(req,res)=>{
       
          knex
          .select('*')
          .from('shopping_cart')
          .where('item_id',req.params.item_id)
          .then((data1)=>{
              console.log(data1);
              
            knex('saveForLater').insert(data1[0])
            .then(()=>{
                console.log('data insert..');
                res.send('data insert')
                knex('shopping_cart')
                .select('*')
                .where('item_id', req.params.item_id)
                .del()
                .then(()=>{
                    console.log("insert");
                    res.send('insert..')

                    
                })
                .catch(()=>{
                    console.log('delete');
                    
                })

                
            })
            .catch((err)=>{
                console.log(err);
                res.send(err)
                
            })


          })
    })

    shoppingcart.get('/moveToCart/:item_id',(req,res)=>{
        knex
        .select('*')
        .from('saveForLater')
        .where('item_id',req.params.item_id)
        .then((data2)=>{
            
            knex('shopping_cart').insert(data2[0])
            .then(()=>{
                console.log('insert');
                knex
                .select('*')
                .from('saveForLater')
                .where('item_id',req.params.item_id)
                .del()
                .then(()=>{
                    res.send('data insert')
                    
                })
                .catch(()=>{
                    console.log('delete');
                    res.send('deleted')
                    
                })
                
            })
            .catch(()=>{
                console.log('duplicate entry');
                res.send('duplicate entry')
                
            })


        })

    })
    shoppingcart.get('/getSaved/:cart_id',(req,res)=>{
        knex
        .select('*')
        .from('saveForLater')
        .where('cart_id',req.params.cart_id)
        .then((data)=>{
            console.log(data);
            res.send(data)
            
        })
        .catch((err)=>{ 
            console.log(err);
            send(err)
            
        })
    })

    shoppingcart.delete('/removeProduct/:item_id',(req,res)=>{
        knex('saveForLater')
        .select('*')
        .where("item_id",req.params.item_id)
        .then((data)=>{
            if (data.length>0){
                knex('saveForLater')
                .where("item_id",req.params.item_id)
                .del()
                .then(()=>{
                    console.log("removeProduct");
                    res.send("remove_Product")
                    
                })
                .catch(()=>{
                    console.log("item_id don't match");
                    res.send("item_id don't match")
                    
                })

            }else{
                res.send('data not exist..')
            }

        })
      
    })






    

}



