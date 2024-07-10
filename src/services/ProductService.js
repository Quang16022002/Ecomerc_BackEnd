const Product = require("../models/ProductModel");
const createProduct = async (newProduct) => {
  try {
    const { name, images, type, price, totalQuantity, rating, description, original_price, variants } = newProduct;

    // Check if product with the same name already exists
    const checkProduct = await Product.findOne({ name });
    if (checkProduct) {
      return {
        status: "ERR",
        message: "The name of product already exists",
      };
    }

    // Calculate total countInStock from variants
    const totalCountInStock = variants.reduce((total, variant) => total + variant.countInStock, 0);

    const createdProduct = await Product.create({
      name,
      images,
      type,
      price,
      totalQuantity: totalCountInStock,
      rating,
      description,
      original_price,
      variants,
    });

    if (!createdProduct) {
      return {
        status: "ERR",
        message: "Failed to create product",
      };
    }

    // Update images field in the main product with variant images
    const variantImages = variants.map(variant => variant.image).filter(image => image);
    createdProduct.images.push(...variantImages); // Assuming images is an array in ProductModel

    // Save the updated product with variant images added to images field
    await createdProduct.save();

    const productList = await Product.find();
    productList.unshift(createdProduct);

    return {
      status: "OK",
      message: "SUCCESS",
      data: productList,
    };
  } catch (error) {
    throw error;
  }
};

const updateProduct = async (id, data) => {
  try {
    const { variants } = data;

    // Calculate total countInStock from variants
    const totalCountInStock = variants.reduce((total, variant) => total + variant.countInStock, 0);

    const updatedProduct = await Product.findByIdAndUpdate(id, { ...data, countInStock: totalCountInStock }, {
      new: true,
    });

    if (!updatedProduct) {
      return {
        status: "ERR",
        message: "Failed to update product",
      };
    }

    // Update images field in the main product with variant images
    const variantImages = variants.map(variant => variant.image).filter(image => image);
    updatedProduct.images = variantImages; // Assuming images is an array in ProductModel

    // Save the updated product with variant images added to images field
    await updatedProduct.save();

    return {
      status: "OK",
      message: "SUCCESS",
      data: updatedProduct,
    };
  } catch (error) {
    throw error;
  }
};

const deleteProduct = async (id) => {
  try {
    const checkProduct = await Product.findById(id);
    if (!checkProduct) {
      return {
        status: "ERR",
        message: "Product not found",
      };
    }

    await Product.findByIdAndDelete(id);

    return {
      status: "OK",
      message: "Product deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error; // Propagate the error to the caller
  }
};

const getAllProduct = async (limit, page, sort, filter) => {
  try {
    const query = {};
    if (filter) {
      const [label, value] = filter;
      query[label] = { $regex: value, $options: "i" };
    }

    let productsQuery = Product.find(query).limit(limit).skip(limit * page);

    if (sort) {
      const [sortOrder, sortBy] = sort;
      const sortOptions = {};
      sortOptions[sortBy] = sortOrder;
      productsQuery = productsQuery.sort(sortOptions);
    } else {
      productsQuery = productsQuery.sort({ createdAt: -1 });
    }

    const [allProduct, totalProduct] = await Promise.all([
      productsQuery,
      Product.countDocuments(query),
    ]);

    return {
      status: "OK",
      message: "List of products",
      data: allProduct,
      total: totalProduct,
      pageCurrent: Number(page + 1),
      totalPage: Math.ceil(totalProduct / limit),
    };
  } catch (error) {
    console.error("Error fetching all products:", error);
    throw error; // Propagate the error to the caller
  }
};

const getDetailsProduct = async (id) => {
  try {
    const product = await Product.findById(id);
    if (!product) {
      return {
        status: "ERR",
        message: "Product not found",
      };
    }

    return {
      status: "OK",
      message: "Product details found",
      data: product,
    };
  } catch (error) {
    console.error("Error fetching product details:", error);
    throw error; // Propagate the error to the caller
  }
};

const getAllType = async () => {
  try {
    const allTypes = await Product.distinct("type");

    return {
      status: "OK",
      message: "List of product types",
      data: allTypes,
    };
  } catch (error) {
    console.error("Error fetching all product types:", error);
    throw error; // Propagate the error to the caller
  }
};

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProduct,
  getDetailsProduct,
  getAllType,
};
