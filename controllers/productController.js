const asyncHandler = require("express-async-handler")
const Product = require("../models/productModel")
const { fileSizeFormatter } = require("../utils/fileUpload")
const cloudinary = require("cloudinary").v2

// Create Product
const createProduct = asyncHandler(async (req, res) => {
    const { name, sku, category, quantity, price, description, trending, sale, bestseller, person, specific_category } = req.body

    // Validation
    if (!name || !category || !quantity || !price || !description || !trending || !sale || !bestseller || !person || !specific_category ) {
        res.status(400)
        throw new Error("Please fill in all fileds")
    }

    // Handle Image upload
    let fileData = {}
    if (req.file) {
        // Save image to cloudinary
        let uploadedFile;
        try {
            uploadedFile = await cloudinary.uploader.upload(req.file.path, { folder: "Ndure", resource_type: "image" })
        }
        catch (error) {
            res.status(500)
            throw new Error("Image could not be uploaded")
        }

        fileData = {
            fileName: req.file.originalname,
            filePath: uploadedFile.secure_url,
            fileType: req.file.mimetype,
            fileSize: fileSizeFormatter(req.file.size, 2),
        }
    }

    // Create Product
    const product = await Product.create({
        user: req.user.id,
        name, 
        sku, 
        category, 
        quantity, 
        price, 
        description, 
        trending, 
        sale, 
        bestseller,
        person, 
        specific_category,
        image: fileData,
    })

    res.status(201).json(product)
})

// Get all Products
const getProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({ user: req.user.id }).sort("-createdAt")
    res.status(200).json(products)
})

// Get all Products irrespective of user
const getAllProducts = asyncHandler(async (req, res) => {
    const products = await Product.find().sort("-createdAt")
    res.status(200).json(products)
})


// Get Trending Products irrespective of user
const getAllProductsTrending = asyncHandler(async (req, res) => {
    const products = await (await Product.find({trending:'yes'})).sort("-createdAt")
    res.status(200).json(products)
})

// Get Sale Products irrespective of user
const getAllProductsSale = asyncHandler(async (req, res) => {
    const products = await Product.find({sale: 'yes'}).sort("-createdAt")
    res.status(200).json(products)
})

// Get BestSeller Products irrespective of user
const getAllProductsBestSeller = asyncHandler(async (req, res) => {
    const products = await Product.find({bestseller: 'yes'}).sort("-createdAt")
    res.status(200).json(products)
})

// Get Category Shoes Products irrespective of user
const getAllProductsCategory = asyncHandler(async (req, res) => {
    const products = await Product.find({category: req.params.text}).sort("-createdAt")
    res.status(200).json(products)
})

// Get Product
const getProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)

    // if product does not exist
    if (!product) {
        res.status(404)
        throw new Error("Product not found")
    }

    // Match product to its user
    if (product.user.toString() !== req.user.id) {
        res.status(401)
        throw new Error("User not authorized")
    }
    res.status(200).json(product)
})




// Get Product without user login
const getProductSimply = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)
    console.log(req.params.id)
    // if product does not exist
    if (!product) {
        res.status(404)
        throw new Error("Product not found")
    }
    res.status(200).json(product)
})

// Delete Product
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)
    // if product does not exist
    if (!product) {
        res.status(404)
        throw new Error("Product not found")
    }

    // Match product to its user
    if (product.user.toString() !== req.user.id) {
        res.status(401)
        throw new Error("User not authorized")
    }
    await Product.findByIdAndRemove(req.params.id)
    res.status(200).json({ message: "Product deleted." })
})

// Update Product
const updateProduct = asyncHandler(async (req, res) => {
    const { name, category, quantity, price, description, trending, sale, bestseller, person, specific_category } = req.body

    const { id } = req.params

    const product = await Product.findById(req.params.id)
    // if product does not exist
    if (!product) {
        res.status(404)
        throw new Error("Product not found")
    }

    // Match product to its user
    if (product.user.toString() !== req.user.id) {
        res.status(401)
        throw new Error("User not authorized")
    }

    // Handle Image upload
    let fileData = {}
    if (req.file) {
        // Save image to cloudinary
        let uploadedFile;
        try {
            uploadedFile = await cloudinary.uploader.upload(req.file.path, { folder: "Borjan", resource_type: "image" })
        }
        catch (error) {
            res.status(500)
            throw new Error("Image could not be uploaded")
        }

        fileData = {
            fileName: req.file.originalname,
            filePath: uploadedFile.secure_url,
            fileType: req.file.mimetype,
            fileSize: fileSizeFormatter(req.file.size, 2),
        }
    }

    // Update Product
    const updatedProduct = await Product.findByIdAndUpdate(
        { _id: id },
        {
            name, 
            category, 
            quantity, 
            price, 
            description, 
            trending, 
            sale, 
            bestseller,
            person, 
            specific_category,
            image: Object.keys(fileData).length === 0 ? product?.image : fileData,
        },
        {
            new: true,
            runValidators: true,
        }
    )
    res.status(201).json(updatedProduct)
})

module.exports = {
    createProduct,
    getProducts,
    getAllProducts,
    getProduct,
    deleteProduct,
    updateProduct,
    getProductSimply,

    getAllProductsTrending,
    getAllProductsSale,
    getAllProductsBestSeller,
    getAllProductsCategory,

}