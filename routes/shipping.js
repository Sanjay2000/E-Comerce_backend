module.exports = (shipping,knex)=>{

    shipping.get('/regions',(req,res)=>{
        knex('shipping_region')
        .select('*')
        .then((data)=>{
            console.log(data);
            res.send(data)
            
        })
        .catch((err)=>{
            console.log(err);
            res.send(err)
            
        })
    })
    shipping.get('/regions/:shipping_region_id',(req,res)=>{
        knex('shipping_region')
        .select('*')
        .where("shipping_region_id",req.params.shipping_region_id)
        .then((data1)=>{
            console.log(data1);
            res.send(data1)
            
        })
        .catch((err)=>{
            console.log(err);
            res.send(err)
            
        })
    })

}