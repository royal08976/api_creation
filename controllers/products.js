const Product=require("../models/product")

const getAllProducts=async(req,res)=>{

    const {company,name,sort,select}=req.query
    const queryObject={}


    if(company){
        queryObject.company=company
    }

    if(name){
        queryObject.name=name
    }

    let apiData=Product.find(queryObject)
    if(sort){
        let sortFix=sort.replace(","," ")
        apiData=apiData.sort(sortFix)
    }

    //select
    if(select){
        let sortFix=select.split(",").join(" ")
        apiData=apiData.select(sortFix)
    }

    let page=Number(req.query.page) || 1
    let limit=Number(req.query.limit)||3
    let skip=(page-1)*limit
    apiData=apiData.skip(skip).limit(limit)

    const Products=await apiData
    res.status(200).json({Products, nbHits:Products.length})
}

const getAllProductsTesting=async(req,res)=>{
    const Products=await Product.find(req.query).select("name")
    res.status(200).json({Products})
}

module.exports={getAllProducts,getAllProductsTesting
    
}   