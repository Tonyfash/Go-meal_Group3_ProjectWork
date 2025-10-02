
const Product = require("../model/product");
const Kitchen = require("../model/kitchen");
const Category = require("../model/category");

exports.seedProducts = async (req, res) => {
  try {
    // Delete all existing products
    await Product.deleteMany();

    // Define products by kitchen and category name
    const kitchenProducts = {
      "Heritage Kitchen": {
        "Classic & Comfort Breakfasts": [
          { productName: "Custard and Akara", price: 1500 },
          { productName: "Yam and Egg", price: 2500 },
          { productName: "Coffee and Pancakes", price: 1500 },
          { productName: "Pap and Akara", price: 1500 },
          { productName: "Bread, Egg and Tea", price: 2500 },
          { productName: "Pancakes and Smoothie", price: 2000 },
          { productName: "Oat and Akara", price: 1500 },
          { productName: "Waffle and Coffee", price: 2000 },
        ],
        "Quick Grab-and-Go": [
          { productName: "Sausage Roll", price: 1500 },
          { productName: "Sandwich", price: 2000 },
          { productName: "Beef Pie", price: 3000 },
          { productName: "Mini Muffins", price: 2500 },
          { productName: "Hot Dog Sausage", price: 1500 },
          { productName: "Egg Sandwich", price: 1700 },
          { productName: "Large Muffins", price: 1000 },
          { productName: "Meat Pie", price: 1500 },
        ],
        "Beverage Add-Ons": [
          { productName: "Bottle Water", price: 500 },
          { productName: "Hot Coffee", price: 1000 },
          { productName: "Soft Drink", price: 500 },
          { productName: "Milkshake", price: 1000 },
        ],
      },

      "Renee’s Kitchen": {
        "Classic Continental Breakfasts": [
          { productName: "Pancakes with Egg", price: 4500 },
          { productName: "Croissant Jam", price: 2500 },
          { productName: "Cheese Bread Omelette", price: 1500 },
          { productName: "Spinach Omelette", price: 3000 },
          { productName: "Waffles & Berries", price: 2500 },
          { productName: "Akara and Oats", price: 1500 },
          { productName: "Pancake Rolls", price: 3500 },
          { productName: "Waffles and Coffee", price: 3000 },
        ],
        "Healthy Picks": [
          { productName: "Scrambled Bowl", price: 2500 },
          { productName: "Boiled Plaintain & Fish", price: 3500 },
          { productName: "Pap and Moi-moi", price: 4500 },
          { productName: "Porridge Yam", price: 2500 },
          { productName: "Yam & Egg", price: 3500 },
          { productName: "Plaintain Pepper Soup", price: 2500 },
          { productName: "Vegetable Salad", price: 2500 },
          { productName: "Egg with Avocado", price: 2500 },
        ],
        "Beverages Add-Ons": [
          { productName: "Bottle Water", price: 500 },
          { productName: "Hot Coffee", price: 1000 },
          { productName: "Soft Drink", price: 500 },
          { productName: "Milkshake", price: 1000 },
        ],
      },

      "Mama Kitchen": {
        "Classic & Comfort Breakfasts": [
          { productName: "Custard and Akara", price: 1500 },
          { productName: "Yam and Egg", price: 2500 },
          { productName: "Shakshuka", price: 1500 },
          { productName: "Fruit Salad", price: 1500 },
          { productName: "Avocado Toast", price: 2500 },
          { productName: "Noodles and Egg", price: 1500 },
          { productName: "Donuts and Coffee", price: 3500 },
        ],
        "Quick Grab-and-Go": [
          { productName: "Dark Chocolate", price: 3500 },
          { productName: "Rice Balls", price: 3500 },
          { productName: "Energy Balls", price: 3500 },
          { productName: "Roasted Potatoes", price: 3500 },
          { productName: "Lettuce Roll", price: 2500 },
          { productName: "Butter Pie", price: 2000 },
          { productName: "Queen Cake", price: 2500 },
          { productName: "Hamburger", price: 3500 },
        ],
        "Beverage Add-Ons": [
          { productName: "Yogurt Parfait", price: 3000 },
          { productName: "Milkshake", price: 2000 },
          { productName: "Bottle Water", price: 500 },
          { productName: "Soft Drink", price: 500 },
        ],
      },

      "Kayliz's Kitchen": {
        "Classic Conitinental Breakfasts": [
          { productName: "Rice Balls", price: 4500 },
          { productName: "Croissant Jam", price: 2500 },
          { productName: "Cheese Bread Omelette", price: 1500 },
          { productName: "Spinach Omelette", price: 3000 },
          { productName: "Waffles & Berries", price: 2500 },
          { productName: "Akara and Oats", price: 1500 },
          { productName: "Pancake Rolls", price: 3500 },
          { productName: "Waffles and Coffee", price: 3000 },
        ],
        "Halthy Picks": [
          { productName: "Scrambled Bowl", price: 2500 },
          { productName: "Boiled Plaintain & Fish", price: 3500 },
          { productName: "Pap and Moi-moi", price: 4500 },
          { productName: "Porridge Yam", price: 2500 },
          { productName: "Plaintain Pepper Soup", price: 2500 },
          { productName: "Vegetable Salad", price: 2500 },
          { productName: "Egg with Avocado", price: 2500 },
        ],
        "Beverage Add-Ons": [
          { productName: "Bottle Water", price: 500 },
          { productName: "Hot Coffee", price: 1000 },
          { productName: "Soft Drink", price: 500 },
          { productName: "Milkshake", price: 1000 },
        ],
      },
    };

    let createdProducts = [];

    for (const kitchenName in kitchenProducts) {
      const kitchen = await Kitchen.findOne({ kitchenName });
      if (!kitchen) continue;

      const categories = await Category.find({ kitchen: kitchen._id });

      for (const categoryName in kitchenProducts[kitchenName]) {
        const category = categories.find(c => c.name === categoryName);
        if (!category) continue;

        const productsData = kitchenProducts[kitchenName][categoryName].map(p => ({
          ...p,
          kitchen: kitchen._id,
          category: category._id,
          productImage: "",
        }));

        const insertedProducts = await Product.insertMany(productsData);

        category.products.push(...insertedProducts.map(p => p._id));
        await category.save();

        createdProducts.push(...insertedProducts);
      }
    }

    res.status(201).json({
      success: true,
      message: "All products seeded successfully!",
      total: createdProducts.length,
      data: createdProducts,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};







exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("kitchen", "kitchenName")
      .populate("category", "categoryName");

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};




exports.getProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id)
      .populate("kitchen", "kitchenName")
      .populate("category", "categoryName");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};  




// Get all products under a specific category
exports.getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const category = await Category.findById(categoryId)
      .populate({
        path: "products",
        populate: [
          { path: "kitchen", select: "kitchenName" },
          { path: "category", select: "name" }
        ]
      });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      category: category.name,
      count: category.products.length,
      data: category.products,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};
