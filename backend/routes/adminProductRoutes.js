const express = require('express');
const router = express.Router();
const auth = require("../middleware/auth");
const Product = require("../models/Product");
const Variant = require('../models/Variant')
const Review = require('../models/Review');
const User = require('../models/User');

router.get('/list', auth, async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json({ products });
    } catch (error) {
        console.error("Error fetching Products : ", error);
        res.status(500).json({ message: "Server error" });
    }


})

router.get('/:id', auth, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate(
            [{
                path: 'variant',
                model: 'Variant'
            },
            {
                path: 'reviews',
                model: 'Review'
            }
            ]
        );
        console.log(product);

        res.status(200).json(product);
    } catch (error) {
        console.error("There is some error", error);
        res.status(401).json({ error: error });
    }

})


router.put("/variants/:Vid", async (req, res) => {
    const { Vid } = req.params;
    const { size, color, cost, imageUrl } = req.body;

    try {
        const updatedVariant = await Variant.findByIdAndUpdate(
            Vid,
            { size, color, cost, imageUrl },
            { new: true } // return updated doc
        );

        if (!updatedVariant) {
            return res.status(404).json({ message: "Variant not found" });
        }

        res.status(200).json({ message: "Variant updated successfully", variant: updatedVariant });
    } catch (error) {
        console.error("Error updating variant:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

router.put("/:id", auth, async (req, res) => {
    const { id } = req.params;
    const { name, color, size, description, cost, imageUrl } = req.body;

    try {
        const updatedProduct = await Product.findByIdAndUpdate(id,
            { name, description, color, size, cost, imageUrl },
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product Not Found" });
        }

        res.status(200).json({ message: "Product update successfully", product: updatedProduct });
    } catch (error) {
        console.log("There some error in updating the product", error);
        res.json({ message: "There is some error in updating the product", error });
    }
})

router.delete("/:proId/variants/:varId", async (req, res) => {
    const { proId, varId } = req.params;

    try {
        const product = await Product.findByIdAndUpdate(
            proId,
            { $pull: { variant: { _id: varId } } },
            { new: true }
        );

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        await Variant.findByIdAndDelete(varId);

        res.status(200).json({ message: "Variant deleted successfully", product });

    } catch (error) {
        console.log("There is some error in deleting", error);
    }
})

router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    await Review.deleteMany({ _id: { $in: product.reviews } });
    await User.updateMany({}, { $pull: { cart: { product : req.params.id } } });
    await Variant.deleteMany({ _id : { $in : product.variant}});
    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Product and related reviews deleted" });
  } catch (error) {
    console.error( error);
    res.status(500).json({ error: error.message });
  }
});


router

module.exports = router;