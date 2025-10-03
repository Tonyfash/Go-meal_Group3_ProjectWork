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
          {
            productName: "Custard and Akara",
            productImage: "https://res.cloudinary.com/dwzomhflw/image/upload/v1759353568/Frame_106_xivi1e.jpg",
            price: 1500,
          },

          {
            productName: "Yam and Egg",
            productImage: "https://res.cloudinary.com/dwzomhflw/image/upload/v1759353548/Frame_106_2_uozoww.jpg",
            price: 2500,
          },

          {
            productName: "Coffee and Pancakes",
            productImage: "https://res.cloudinary.com/dwzomhflw/image/upload/v1759353570/Frame_106_1_gxt85j.jpg",
            price: 1500,
          },

          {
            productName: "Pap and Akara",
            productImage: "https://res.cloudinary.com/dwzomhflw/image/upload/v1759353556/Frame_106_3_tphg64.jpg",
            price: 1500,
          },

          {
            productName: "Bread, Egg and Tea",
            productImage: "https://res.cloudinary.com/dwzomhflw/image/upload/v1759353552/Frame_106_kalu7e.png",
            price: 2500,
          },

          { productName: "Pancakes and Smoothie", productImage: "", price: 2000 },

          {
            productName: "Oat and Akara",
            productImage: "https://res.cloudinary.com/dwzomhflw/image/upload/v1759353553/Frame_106_2_xbf7bg.png",
            price: 1500,
          },

          { productName: "Waffle and Coffee", productImage: "", price: 2000 },
        ],
        "Quick Grab-and-Go": [
          { productName: "Sausage Roll", productImage: "", price: 1500 },

          {
            productName: "Sandwich",
            productImage: "https://res.cloudinary.com/dwzomhflw/image/upload/v1759353579/Frame_106_4_mbwiq5.jpg",
            price: 2000,
          },

          {
            productName: "Beef Pie",
            productImage: "https://res.cloudinary.com/dwzomhflw/image/upload/v1759353513/Frame_106_5_w9zk2p.jpg",
            price: 3000,
          },

          { productName: "Mini Muffins", productImage: "", price: 2500 },
          { productName: "Hot Dog Sausage", productImage: "", price: 1500 },
          { productName: "Egg Sandwich", productImage: "", price: 1700 },
          { productName: "Large Muffins", productImage: "", price: 1000 },
          { productName: "Meat Pie", productImage: "", price: 1500 },
        ],
        "Beverage Add-Ons": [
          { productName: "Bottle Water", productImage: "", price: 500 },
          { productName: "Hot Coffee", productImage: "", price: 1000 },
          { productName: "Soft Drink", productImage: "", price: 500 },
          { productName: "Milkshake", productImage: "", price: 1000 },
        ],
      },

      "Renee’s Kitchen": {
        "Classic Continental Breakfasts": [
          { productName: "Pancakes with Egg", productImage: "", price: 4500 },
          { productName: "Croissant Jam", productImage: "", price: 2500 },
          { productName: "Cheese Bread Omelette", productImage: "", price: 1500 },
          { productName: "Spinach Omelette", productImage: "", price: 3000 },
          { productName: "Waffles & Berries", productImage: "", price: 2500 },
          { productName: "Akara and Oats", productImage: "", price: 1500 },
          { productName: "Pancake Rolls", productImage: "", price: 3500 },
          { productName: "Waffles and Coffee", productImage: "", price: 3000 },
        ],
        "Healthy Picks": [
          { productName: "Scrambled Bowl", productImage: "", price: 2500 },
          { productName: "Boiled Plaintain & Fish", productImage: "", price: 3500 },
          { productName: "Pap and Moi-moi", productImage: "", price: 4500 },
          { productName: "Porridge Yam", productImage: "", price: 2500 },
          { productName: "Yam & Egg", productImage: "", price: 3500 },
          { productName: "Plaintain Pepper Soup", productImage: "", price: 2500 },
          { productName: "Vegetable Salad", productImage: "", price: 2500 },
          { productName: "Egg with Avocado", productImage: "", price: 2500 },
        ],
        "Beverages Add-Ons": [
          { productName: "Bottle Water", productImage: "", price: 500 },
          { productName: "Hot Coffee", productImage: "", price: 1000 },
          { productName: "Soft Drink", productImage: "", price: 500 },
          { productName: "Milkshake", productImage: "", price: 1000 },
        ],
      },

      "Mama Kitchen": {
        "Classic & Comfort Breakfasts": [
          {
            productName: "Custard and Akara",
            productImage: "https://res.cloudinary.com/dwzomhflw/image/upload/v1759353568/Frame_106_xivi1e.jpg",
            price: 1500,
          },

          {
            productName: "Yam and Egg",
            productImage: "https://res.cloudinary.com/dwzomhflw/image/upload/v1759353548/Frame_106_2_uozoww.jpg",
            price: 2500,
          },

          {
            productName: "Shakshuka",
            productImage: "https://res.cloudinary.com/ddyfrlx7e/image/upload/v1759403647/shakshuka_g3okub.jpg",
            price: 1500,
          },

          { productName: "Fruit Salad", productImage: "https://res.cloudinary.com/ddyfrlx7e/image/upload/v1759403642/salad_q1jzh7.jpg", price: 1500 },

          {
            productName: "Avocado Toast",
            productImage: "https://res.cloudinary.com/ddyfrlx7e/image/upload/v1759403655/avocado_toast_ayqxse.jpg",
            price: 2500,
          },

          {
            productName: "Noodles and Egg",
            productImage: "https://res.cloudinary.com/ddyfrlx7e/image/upload/v1759406418/noodles_ip8tm6.jpg",
            price: 1500,
          },

          {
            productName: "Donuts and Coffee",
            productImage: "https://res.cloudinary.com/ddyfrlx7e/image/upload/v1759406732/donut_and_coffee_a0gevl.jpg",
            price: 3500,
          },
        ],

        "Quick Grab-and-Go": [
          {
            productName: "Dark Chocolate",
            productImage: "https://res.cloudinary.com/ddyfrlx7e/image/upload/v1759403621/dark_chocolate_pqgbd2.jpg",
            price: 3500,
          },

          {
            productName: "Rice Balls",
            productImage: "https://res.cloudinary.com/ddyfrlx7e/image/upload/v1759403668/rice_ball_afjy0k.jpg",
            price: 3500,
          },

          {
            productName: "Energy Balls",
            productImage: "https://res.cloudinary.com/ddyfrlx7e/image/upload/v1759406247/energy_ball_vce1xq.jpg",
            price: 3500,
          },

          {
            productName: "Roasted Potatoes",
            productImage: "https://res.cloudinary.com/ddyfrlx7e/image/upload/v1759403617/roasted_potatoes_jk6ecd.jpg",
            price: 3500,
          },

          {
            productName: "Lettuce Roll",
            productImage: "https://res.cloudinary.com/ddyfrlx7e/image/upload/v1759403632/lettuce_roll_tpk7rs.jpg",
            price: 2500,
          },

          { productName: "Butter Pie", productImage: "https://res.cloudinary.com/ddyfrlx7e/image/upload/v1759407114/bpie_hixjls.jpg", 
            price: 2000 },

          {
            productName: "Queen Cake",
            productImage: "https://res.cloudinary.com/ddyfrlx7e/image/upload/v1759403604/queen_cake_chnjvi.jpg",
            price: 2500,
          },

          {
            productName: "Hamburger",
            productImage: "https://res.cloudinary.com/ddyfrlx7e/image/upload/v1759403604/hamburger_qcbx14.jpg",
            price: 3500,
          },
        ],

        "Beverage Add-Ons": [
          {
            productName: "Yogurt Parfait",
            productImage: "https://res.cloudinary.com/ddyfrlx7e/image/upload/v1759403640/yogurt_parfait_bp8gx1.jpg",
            price: 3000,
          },

          { productName: "Milkshake", productImage: "", price: 2000 },
          { productName: "Bottle Water", productImage: "", price: 500 },
          { productName: "Soft Drink", productImage: "", price: 500 },
        ],
      },

      "Kayliz's Kitchen": {
        "Classic Conitinental Breakfasts": [
          { productName: "Rice Balls", productImage: "", price: 4500 },
          { productName: "Croissant Jam", productImage: "", price: 2500 },
          { productName: "Cheese Bread Omelette", productImage: "", price: 1500 },
          { productName: "Spinach Omelette", productImage: "", price: 3000 },
          { productName: "Waffles & Berries", productImage: "", price: 2500 },
          { productName: "Akara and Oats", productImage: "", price: 1500 },
          { productName: "Pancake Rolls", productImage: "", price: 3500 },
          { productName: "Waffles and Coffee", productImage: "", price: 3000 },
        ],
        "Halthy Picks": [
          { productName: "Scrambled Bowl", productImage: "", price: 2500 },
          { productName: "Boiled Plaintain & Fish", productImage: "", price: 3500 },
          { productName: "Pap and Moi-moi", productImage: "", price: 4500 },
          { productName: "Porridge Yam", productImage: "", price: 2500 },
          { productName: "Plaintain Pepper Soup", productImage: "", price: 2500 },
          { productName: "Vegetable Salad", productImage: "", price: 2500 },
          { productName: "Egg with Avocado", productImage: "", price: 2500 },
        ],
        "Beverage Add-Ons": [
          { productName: "Bottle Water", productImage: "", price: 500 },
          { productName: "Hot Coffee", productImage: "", price: 1000 },
          { productName: "Soft Drink", productImage: "", price: 500 },
          { productName: "Milkshake", productImage: "", price: 1000 },
        ],
      },
    };

    let createdProducts = [];

    for (const kitchenName in kitchenProducts) {
      const kitchen = await Kitchen.findOne({ kitchenName });
      if (!kitchen) continue;

      const categories = await Category.find({ kitchen: kitchen._id });

      for (const categoryName in kitchenProducts[kitchenName]) {
        const category = categories.find((c) => c.name === categoryName);
        if (!category) continue;

        const productsData = kitchenProducts[kitchenName][categoryName].map((p) => ({
          ...p,
          kitchen: kitchen._id,
          category: category._id,
          productImage: "",
        }));

        const insertedProducts = await Product.insertMany(productsData);

        category.products.push(...insertedProducts.map((p) => p._id));
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
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("kitchen", "kitchenName").populate("category", "categoryName");

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
      message: "Products retrieved successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id).populate("kitchen", "kitchenName").populate("category", "categoryName");

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
      message: err.message,
    });
  }
};

// Get all products under a specific category
exports.getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const category = await Category.findById(categoryId).populate({
      path: "products",
      populate: [
        { path: "kitchen", select: "kitchenName" },
        { path: "category", select: "name" },
      ],
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
      message: "Products retrieved successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
