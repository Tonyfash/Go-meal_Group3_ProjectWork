const categoryModel = require('../model/category');
const Kitchen = require('../model/kitchen');

exports.seedCategories = async (req, res) => {
  try {
    await categoryModel.deleteMany();

    const kitchenCategories = {
      "Heritage Kitchen": ["Classic & Comfort Breakfasts", "Quick Grab-and-Go", "Beverage Add-Ons"],
      "Renee’s Kitchen": ["Classic Continental Breakfasts", "Healthy Picks", "Beverages Add-Ons"],
      "Mama Kitchen": ["Classic & Comfort Breakfasts", "Quick Grap-and-Go", "Beverage Add-Ons"],
      "Kayliz's Kitchen": ["Classic Conitinental Breakfasts", "Halthy Picks", "Beverage Add-Ons"]
    };

    let created = [];

    for (const kitchenName in kitchenCategories) {
      const kitchen = await Kitchen.findOne({ kitchenName });
      if (!kitchen) continue;

      const categoriesData = kitchenCategories[kitchenName].map(cat => ({
        name: cat,
        kitchen: kitchen._id
      }));

      const categories = await categoryModel.insertMany(categoriesData);

      kitchen.categories = categories.map(c => c._id);
      await kitchen.save();

      created.push(...categories);
    }

    res.status(201).json({
      success: true,
      message: "Categories seeded successfully for all kitchens!",
      data: created
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};



exports.getCategoriesByKitchen = async (req, res) => {
  try {
    const { kitchenId } = req.params;

    const categories = await categoryModel.find({ kitchen: kitchenId });

    if (!categories.length) {
      return res.status(404).json({
        success: false,
        message: "No categories found for this kitchen"
      });
    }

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};



exports.getCategoriesById = async (req, res) => { 
  try {
    const { id } = req.params;

    const categories = await categoryModel.findById(id)

    if (!categories) {
      return res.status(404).json({
        success: false,
        message: "No categories found"
      });
    }

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories 
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};
