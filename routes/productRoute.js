const express = require("express")
const router = express.Router()
const { protect, isAdmin } = require("../middleWare/authMiddleware")
const { upload } = require("../utils/fileUpload")

const {
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
} = require("../controllers/productController")


router.post("/", protect, isAdmin, upload.single("image"), createProduct);
router.patch("/:id", protect, isAdmin, upload.single("image"), updateProduct);
router.get("/", protect, isAdmin, getProducts);
router.get("/all", getAllProducts);

router.get("/trending", getAllProductsTrending);
router.get("/sale", getAllProductsSale);
router.get("/bestseller", getAllProductsBestSeller);
router.get("/category/:text", getAllProductsCategory);



router.get("/:id", protect, isAdmin, getProduct);
router.get("/simply/:id", getProductSimply);
router.delete("/:id", protect, isAdmin, deleteProduct);



module.exports = router