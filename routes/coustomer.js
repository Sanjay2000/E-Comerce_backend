module.exports = (customer,knex,jwt)=>{
    customer.post('/',(req,res)=>{
    
        knex('customer')
        .insert({name:req.body.name,
            email:req.body.email,
            password:req.body.password})
        .then(()=>{
            console.log('data fecthed!..');
                res.send('Registration Done!...')
                
            })
            .catch((err)=>{
                console.log(err);
                res.send(err)
                
        })

    })

        // login end point 

    customer.post('/login',(req,res)=>{
        knex.select('*').from('customer').havingIn('customer.email',req.body.email)
        .then((data)=>{
            if(data.length==0){
                res.send('your email is inviled')
            }else{
                knex.select('customer.password','customer.customer_id','customer.email').from('customer').where('customer.email',req.body.email).havingIn('customer.password',req.body.password)
                .then((data)=>{
                    if(data.length==0){
                        res.send('password wrong')
                    }else{
                        // here data coming in object so we are using this thing
                        data=JSON.stringify(data)
                        data=JSON.parse(data)
                        var change_data=(data[0]['customer_id']);
                        jwt.sign({customer_id:change_data},"sanjay",(err,main)=>{
                            if(!err){
                                res.cookie(main)
                                res.send('login')
                            }else{
                                res.send(err)
                            }
                        })
                        
                    }
                })
            }
        }).catch((err)=>{
            res.send(err)
        })
    })

    customer.put('/update',(req,res)=>{
        // if we went to updata any thig then firstly we will do verifiy cookie and token with help hreader======
        var cookie1 = req.headers.cookie.slice(0,-10)
        jwt.verify(cookie1,'sanjay',(err,data)=>{
            if(!err){
                knex.update({
                    "password":req.body.password,
                    "email":req.body.email,
                    "name":req.body.name,
                    "credit_card":req.body.credit_card,
                    "address_1":req.body.address_1,
                    "address_2":req.body.address_2,
                    "city":req.body.city,
                    "region":req.body.region,
                    "postal_code":req.body.postal_code,
                    "country":req.body.country,
                    "shipping_region_id":req.body.shipping_region_id,
                    "day_phone":req.body.day_phone,
                    "eve_phone":req.body.eve_phone,
                    "mob_phone":req.body.mob_p

                }).table("customer").where('customer_id',data.customer_id)
                .then((data)=>{
                    
                    res.send("update sucessfuly")
                })
                .catch((err)=>{
                    res.send(err)
                })
            }
        })



        
        
    })
    customer.put('/address',(req,res)=>{
        var cookie1 = req.headers.cookie.slice(0,-10)
        
                
        jwt.verify(cookie1,'sanjay',(err,data)=>{
            if (!err){
                knex.update({
                    "address_1":req.body.address_1,
                    "city":req.body.city,
                    "region":req.body.region,
                    "postal_code":req.body.postal_code,
                    "country":req.body.country

                }).table('customer').where('customer_id',data.customer_id)
                .then((data)=>{
                    res.send('sucessfuly updata!!')
                })
                .catch((err)=>{
                    res.send(err)
                })
            }
        })
    })


    customer.put('/creditCard',(req,res)=>{
        var cookie1 = req.headers.cookie.slice(0,-10)

        jwt.verify(cookie1,'sanjay',(err,data)=>{
            if (!err){
                
                knex.update({
                    "credit_card":req.body.credit_card

                }).table('customer').where('customer_id',data.customer_id)
                .then((data)=>{
                    
                    res.send('sucessfuly update!...')
                })
                .catch((err)=>{
                    res.send(err)
                })

            }
        })
    })


}