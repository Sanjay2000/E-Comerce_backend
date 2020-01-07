module.exports = (categories,knex)=>{
    categories.get('/',(req,res)=>{
        knex()
        .select('*')
        .from('category')
        .then((data)=>{
            console.log("data is coming")
            res.send(data)
        })
        .catch((err)=>{
            console.log(err);
            res.send(err)
            
        })

    })

    categories.get('/:id',(req,res)=>{
        knex()
        .select('*')
        .from('category')
        .where('category_id',req.params.id)
        .then((data)=>{
            console.log("data is coming");
            res.send(data)
            
        })
        .catch((err)=>{
            console.log(err);
            res.send(err)
            
        })
    })


    categories.get('/inproduct/:product_id',(req,res)=>{
        knex()
        .select("category.category_id","name","department_id")
        .from('category')
        .join('product_category','category.category_id','=','product_category.category_id')
        .where('product_category.product_id',req.params.product_id)
        .then((data)=>{
            console.log("data is coming");
            res.send(data)

            
        })
        .catch((err)=>{
            console.log(err);
            res.send(err)
            
        })
    })
    categories.get('/inDepartment/:department_id',(req,res)=>{
        knex()
        .select('*')
        .from('category')
        .join('department','category.department_id','=', 'department.department_id')
        .where('category.department_id',req.params.department_id)
        .then((data)=>{
            console.log('data is coming!');
            res.send(data)
            
        })
        .catch((err)=>{
            console.log(err);
            res.send(err)
            
        })
    })
}