const Product = require('../models/product')

const getAllProductsStatic = async (req,res) =>{
    const products = await Product.find({})
    res.status(200).json({products, nbHits: products.length});
}

const getAllProducts = async (req,res) =>{
    const { featured, company, name, sort } = req.query
    const queryObject = {}

    if(featured){
        queryObject.featured = featured === 'true' ? true : false
    }
    if(company){
        queryObject.company = company;
    }
    if(name){
        queryObject.name = {$regex: name, $options: 'i'}
    }
    let sortOptions = {};
    if (sort) {
        const sortList = sort.split(',');
        sortList.forEach(sortField => {
            const order = sortField.startsWith('-') ? -1 : 1;
            const field = sortField.replace('-', '');
            sortOptions[field] = order;
        });
    }
    const products = await Product
    .find(queryObject,{'_id': 0, '__v': 0})
    .sort(sortOptions);
    res.status(200).json({products, nbHits: products.length});
}

module.exports = {
    getAllProducts,
    getAllProductsStatic,
}