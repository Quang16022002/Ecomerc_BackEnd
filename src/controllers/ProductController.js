const ProductService = require("../services/ProductService");

const createProduct = async (req, res) => {
  try {
    const { name, images, type, price, rating, description, original_price, variants } = req.body;

    if (!name  || !type || !price || !rating || !original_price || !variants) {
      return res.status(400).json({
        status: "ERR",
        message: "All input fields are required",
      });
    }

    // Calculate total countInStock from variants
    const totalQuantity = variants.reduce((total, variant) => total + variant.countInStock, 0);

    const productData = {
      name,
      images,
      type,
      price,
      rating,
      description,
      original_price,
      totalQuantity,
      variants,
    };

    const response = await ProductService.createProduct(productData);
    return res.status(201).json(response);
  } catch (e) {
    console.error("Error creating product:", e);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const data = req.body;

    if (!productId) {
      return res.status(400).json({
        status: 'ERR',
        message: 'The productId is required'
      });
    }

    const response = await ProductService.updateProduct(productId, data);
    return res.status(200).json(response);
  } catch (e) {
    console.error("Error updating product:", e);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    if (!productId) {
      return res.status(400).json({
        status: "ERR",
        message: "The productId is required",
      });
    }

    const response = await ProductService.deleteProduct(productId);
    return res.status(200).json(response);
  } catch (e) {
    console.error("Error deleting product:", e);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getAllProduct = async (req, res) => {
  try {
    const { limit, page, sort, filter } = req.query;
    const response = await ProductService.getAllProduct(Number(limit), Number(page) || 0, sort, filter);
    return res.status(200).json(response);
  } catch (e) {
    console.error("Error fetching all products:", e);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getDetailsProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    if (!productId) {
      return res.status(400).json({
        status: 'ERR',
        message: 'The productId is required'
      });
    }
    const response = await ProductService.getDetailsProduct(productId);
    return res.status(200).json(response);
  } catch (e) {
    console.error("Error fetching product details:", e);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getAllType = async (req, res) => {
  try {
    const response = await ProductService.getAllType();
    return res.status(200).json(response);
  } catch (e) {
    console.error("Error fetching all product types:", e);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProduct,
  getDetailsProduct,
  getAllType
};
