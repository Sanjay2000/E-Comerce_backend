module.exports = (department,knex)=>{
    department.get('/' , (req,res)=>{
        knex
        .select('*')
        .from('department')
        .then((data)=>{
            console.log("data is coming....")
            res.send(data)
            
        })

        .catch((err)=>{
            console.log(err)
            res.send(err)
        })
    })



    department.get('/:id',(req,res)=>{
        knex
        .select('*')
        .from('department')
        .where('department_id',req.params.id)
        .then((data)=>{
            console.log('data is coming');
            res.send(data)
            
        })
        .catch((err)=>{
            console.log(err);
            res.send(err)
            
        })
    })
}
