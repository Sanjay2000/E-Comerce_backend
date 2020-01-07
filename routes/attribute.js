module.exports = (attribute,knex)=>{
    attribute.get('/',(req,res)=>{
        knex()
        .select('*')
        .from('attribute')
        .then((data)=>{
            console.log('data is coming..');
            res.send(data)
            
        })
        .catch((err)=>{
            console.log(err)
            res.send(err)
        })
    })

    attribute.get('/:attribute_id',(req,res)=>{
        knex()
        .select('*')
        .from('attribute')
        .where("attribute_id",req.params.attribute_id)
        .then((data)=>{
            console.log('data is cpming....');
            res.send(data)
            
        })
        .catch((err)=>{
            console.log(err);
            res.send(err)
            
        })
    })

    attribute.get('/value/:attribute_id',(req,res)=>{
        knex()
        .select('value','attribute_value.attribute_value_id')
        .from('attribute')
        .join('attribute_value','attribute.attribute_id','=',"attribute_value.attribute_id")
        .where("attribute.attribute_id",req.params.attribute_id)
        .then((data)=>{
            console.log("data is coming..")
            res.send(data)

        })
        .catch((err)=>{
            console.log(err);
            res.send(err)
            
        })

        
    })
    attribute.get('/inProduct/:product_id',(req,res)=>{
        knex()
        .select('name as attribute_name','attribute_value.attribute_value_id','value as attribute_value')
        .from('attribute')
        .join('attribute_value','attribute.attribute_id','=','attribute_value.attribute_id')
        .join('product_attribute','attribute_value.attribute_value_id','=','product_attribute.attribute_value_id')
        .where('product_attribute.product_id',req.params.product_id)
        .then((data)=>{
            console.log("data is coming...");
            res.send(data)

            
        })
        .catch((err)=>{
            console.log(err);
            res.send(err)
            
        })
    })
}