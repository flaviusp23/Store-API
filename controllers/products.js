const Product = require('../models/product')

const getAllProducts = async (req,res) =>{
    const { featured, company, name, sort, fields, minPrice, maxPrice, minRating, maxRating } = req.query;
    //filtering
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
    // Numeric filters
    if (minPrice) {
        queryObject.price = queryObject.price || {};
        queryObject.price.$gte = Number(minPrice);
    }
    if (maxPrice) {
        queryObject.price = queryObject.price || {};
        queryObject.price.$lte = Number(maxPrice);
    }
    if (minRating) {
        queryObject.rating = queryObject.rating || {};
        queryObject.rating.$gte = Number(minRating);
    }
    if (maxRating) {
        queryObject.rating = queryObject.rating || {};
        queryObject.rating.$lte = Number(maxRating);
    }
    //sorting
    let sortOptions = {};
    if (sort) {
        const sortList = sort.split(',');
        sortList.forEach(sortField => {
            const order = sortField.startsWith('-') ? -1 : 1;
            const field = sortField.replace('-', '');
            sortOptions[field] = order;
        });
    }
    //fields
    let projection = {};
    if (fields) {
        const fieldsList = fields.split(',');
        fieldsList.forEach(field => {
            projection[field] = 1;
        });
        projection['_id'] = 0;
    } else {
        projection['_id'] = 0;
        projection['__v'] = 0;
    }
    //pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const products = await Product
    .find(queryObject,projection)
    .sort(sortOptions)
    .limit(limit)
    .skip(skip);
    res.status(200).json({products, nbHits: products.length});
}

module.exports = {
    getAllProducts,
}