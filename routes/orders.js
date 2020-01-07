module.exports = (order,knex,jwt)=>{
    order.post('/',(req,res)=>{
        var cook = req.headers.cookie.split(' ')
        var cookie2 = cook[cook.length-1].slice(0,-10)
        jwt.verify(cookie2,'sanjay',(err,stock)=>{
            knex
            .select('price','quantity')
            .from('shopping_cart')
            .join('product', function(){
                this.on('shopping_cart.product_id', 'product.product_id')
            })
            .then((data)=>{
                
                knex
                .select('shipping_cost')
                .from('shipping')
                .where("shipping.shipping_id",req.body.shipping_id)
                .then((data1)=>{
                    knex('tax')
                    .select('tax_percentage ')
                    .where('tax_id',req.body.tax_id)
                    .then((data2)=>{

                    let arry = data.map(x=>{
                        x.total = x.price*x.quantity
                        return x
                    })
                    var total = (arry[0].total+data1[0].shipping_cost);
                    var subtotal = (total*data2[0].tax_percentage/100);
                    var totalamount = total+subtotal
                    // console.log({"totalamonunt":totalamount});
                    console.log(totalamount)
                    knex('orders')
                    .insert({
                        "total_amount":totalamount,
                        "created_on":new Date(),
                        "shipped_on":new Date(),
                        "comments":req.bodycomments,
                        "customer_id":stock.customer_id,
                        "auth_code":req.body.auth_code,
                        "reference":req.body.reference,
                        "shipping_id ":req.body.shipping_id,
                        "tax_id":req.body.tax_id
                    }).then(()=>{console.log("inserted successful")})
                    .catch((err)=>{console.log(err)})
                    
                    })

                        
                        // knex('orders')
                        // .insert({
                        //     // "totalamount":totalamount,
                        //     "created_on":new Date(),
                        //     " shipped_on ":new Date(),
                        //     "comments":req,body,comments,
                        //     "customer_id":stock.customer_id,
                        //     "auth_code":req.body.auth_code,
                        //     "reference":req.body.reference,
                        //     "shipping_id ":req.body.shipping_id,
                        //     "tax_id":req.body.tax_id


                        // })
                        // .then((data4)=>{
                        //     console.log(data4);
                        //     res.send(data4)
                            
                        // })



                    
                })

                
            })
            
        })
        
    })

}