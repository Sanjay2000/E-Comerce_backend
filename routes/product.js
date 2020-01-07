module.exports = (product,knex,jwt)=>{
    product.get('/',(req,res)=>{
        knex()
        .select('*')
        .from('product')
        .then((data)=>{
            console.log('data is coming...');
            res.send(data)
            
        })
        .catch((err)=>{
            console.log(err);
            res.send(err)
            
        })
    })

    product.get('/search',(req,res)=>{
        let body = req.query.pro;
        console.log(body);
        
        knex()
        .select('*')
        .from('product')
        .where('name','like','%'+body)
        .then((data)=>{
            console.log("data is coming...");
            res.send(data)
            
        })
        .catch((err)=>{
            console.log(err);
            res.send(err)
            

        })
    })


    product.get('/:product_id',(req,res)=>{
        knex()
        .select("*")
        .from('product')
        .where("product_id",req.params.product_id)
        .then((data)=>{
            console.log("data is coming...");
            res.send(data)
            
        })
        .catch((err)=>{
            console.log(err);
            res.send(err)
            
        })
    })


    product.get('/inCategory/:category_id',(req,res)=>{
        knex()
        .select('product.product_id','name','description','price','discounted_price','thumbnail')
        .from('product')
        .join('product_category','product_category.product_id','=','product.product_id')
        .where('product_category.category_id',req.params.category_id)
        .then((data)=>{
            console.log('data is coming ');
            res.send(data)

        })
        .catch((err)=>{
            console.log(err);
            res.send(err)
            
        })
    })

    product.get('/inDepartment/:department_id',(req,res)=>{
        knex()
        .select('product.product_id','product.name','price','discounted_price','product.description','thumbnail')
        .from('product')
        .join('product_category','product.product_id','=','product_category.product_id')
        .join('category','product_category.category_id','=','category.category_id')
        .where('category.department_id',req.params.department_id)
        .then((data)=>{
            console.log('data is coming');
            res.send(data)
            
        })
        .catch((err)=>{
            console.log(err);
            res.send(err)
            
        })
        

    })

    product.get('/:product_id/details',(req,res)=>{
        knex()
        .select('*')
        .from('product')
        .where('product.product_id',req.params.product_id)
        .then((data)=>{
            console.log("data is coming...");
            res.send(data)

            
        })
        .catch((err)=>{
            console.log((err));
            res.send(err)
            
        })

    })
    product.get('/:product_id/locations',(req,res)=>{
        knex()
        .select('category.category_id',
        'category.name as category_name',
        'department.department_id',
        'department.name as department_name')
        .from('product')
        .join('product_category', 'product.product_id' , '=', 'product_category.product_id')
        .join('category', 'product_category.category_id', '=', 'category.category_id')
        .join('department','category.department_id', '=', 'department.department_id')
        .where('product.product_id',req.params.product_id)
        .then((data)=>{
            console.log("data is coming..");
            res.send(data)

            
        }).catch((err)=>{
            console.log(err);
            res.send(err)
            
        })
    })
    product.post('/:product_id/reviews',(req,res)=>{
        var cookie1 = req.headers.cookie.slice(0,-10)
        var customer = jwt.verify(cookie1,'sanjay')

        knex('review').insert({'customer_id': customer.customer_id,
    'product_id': req.params.product_id,'review': req.body.review,'rating':req.body.rating,'created_on': new Date})
    .then((data)=>{
        res.send('data inserted sucessfully')
    })
    .catch((err)=>{
        res.send(err)
    })
        
        
    })
    product.get('/:product_id/reviews',(req,res)=>{
        knex.select('product.name','review.review','review.rating','review.created_on')
        .from('product')
        .join('review','review.product_id','=','product.product_id')
        .where('product.product_id',req.params.product_id)
        .then((data)=>{
            res.send(data)
        })
        .catch((err)=>{
            res.send(err)
        })


    })




}