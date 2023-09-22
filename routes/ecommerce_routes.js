const express = require('express')
const router = express.Router()
const authenticateToken = require('../middleware/auth/jwt')
const authenticateSeller = require('../middleware/auth/sellerauth')
const ProductModel = require('../model/ecommerce')
module.exports = router

// read

router.get('/', authenticateToken, async (req, res) => {

    try {

        const productID = req.body.productID
        const productIDCheck = await ProductModel.findOne({productID:productID})

        if (productIDCheck) {
            res.status(200).json(productIDCheck)
        } else {
            res.status(404).json({error:"the product with given product ID could not be found", requestedProduct: req.body})
        }

    } catch (e) {
        res.status(500).json({error:e.message})
    }

})

// create

router.post('/', [authenticateToken, authenticateSeller], async (req, res) => {
    try {

        const productID = req.body.productID
        const productIDCheck = await ProductModel.findOne({productID:productID})

        if (productIDCheck) {
            res.status(400).json({error:"this product already exists", product:productIDCheck})
        } else {
            const product = req.body
            await ProductModel.create(product)
                .then((product) => {
                    res.status(201).json({message:"product successfully saved", product:product})
                }).catch ((e) => {
                    res.status(500).json({error:e.message})
                })
        }

    } catch (e) {
        res.status(500).json({error:e.message})
    }
})

// update

router.patch('/', [authenticateToken, authenticateSeller], async (req, res) => {
    try {

        const { productID, ...update } = req.body
        const query = { productID:productID }
        const options = { new:true }

        await ProductModel.findOneAndUpdate(query, update, options)
            .then((updatedProduct) => {
                if (!updatedProduct) {
                    return res.status(404).json({error:"product does not exist in database yet"})
                } else {
                    return res.status(200).json({message:"product updated successfully", product:updatedProduct})
                }
            }).catch((e) => {
                if (e.name === 'MongoError' && e.code === 66) {
                    return res.status(400).json({ error: 'cannot update immutable field i.e. productID or createdAt' })
                } else {
                    return res.status(500).json({error:error.message})
                }
            })


        

    } catch (e) {
        res.status(500).json({error:e.message})
    }
})


// delete

router.delete('/', [authenticateToken, authenticateSeller], async (req, res) => {

    try {

        const productID = req.body.productID
        const query = { productID:productID }

        await ProductModel.findOneAndDelete(query)
            .then((deletedProduct) => {
                if (!deletedProduct) {
                    return res.status(404).json({error:"product not found", productID:productID})
                } else {
                    return res.status(200).json({message:"product deleted", product:deletedProduct})
                }
            })

    } catch (e) {
        res.status(500).json({error:e.message})
    }

})

// read ALL

router.get('/all', authenticateToken, async (req, res) => {

    try {

        const products = await ProductModel.find()
        return res.status(200).json(products)

    } catch (e) {
        res.status(500).json({error:e.message})
    }

})