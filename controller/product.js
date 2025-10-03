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

          {
            productName: "Noodles and Egg",
            productImage: "https://res.cloudinary.com/ddyfrlx7e/image/upload/v1759479586/257ff58d4ab805309f9af4aa4c0fcc33_ip2svy.jpg",
            price: 2500
          },

          {
            productName: "Oat and Akara",
            productImage: "https://res.cloudinary.com/dwzomhflw/image/upload/v1759353553/Frame_106_2_xbf7bg.png",
            price: 1500,
          },

          {
            productName: "Waffle and Coffee",
            productImage: "https://res.cloudinary.com/ddmh8i1m1/image/upload/v1759482705/Untitled_ghhnee.png",
            price: 3000
          },
        ],
        "Quick Grab-and-Go": [
          {
            productName: "Sausage Roll",
            productImage: "https://res.cloudinary.com/ddyfrlx7e/image/upload/v1759480402/imgi_1_a486aadf4d3967e74365102076b1a068_xd0lzb.jpg",
            price: 1500
          },

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

          {
            productName: "Mini Muffins",
            productImage: "https://res.cloudinary.com/ddyfrlx7e/image/upload/v1759480402/imgi_1_356e9414d0459c7efa35bbb3852ca496_k8bydt.jpg",
            price: 2500
          },

          {
            productName: "Hot Dog Sausage",
            productImage: "https://res.cloudinary.com/ddyfrlx7e/image/upload/v1759480402/imgi_1_866f3427188d615475db23047d681ed3_blke84.jpg",
            price: 1500
          },

          {
            productName: "Egg Sandwich",
            productImage: "https://res.cloudinary.com/ddyfrlx7e/image/upload/v1759480415/imgi_1_cf612c3580c4e70218219550cb9d4d58_smdaqb.jpg",
            price: 1700
          },
          
          {
            productName: "Large Muffins",
            productImage: "https://res.cloudinary.com/ddyfrlx7e/image/upload/v1759480414/imgi_1_ed8bcfa71dbe486a2e17956118f14e55_pg8ydt.jpg",
            price: 1000
          },

          {
            productName: "Meat Pie",
            productImage: "https://res.cloudinary.com/ddyfrlx7e/image/upload/v1759480404/imgi_1_8669b4d3a218dd01a01c353d6c5339c4_zno0fe.jpg",
            price: 1500
          },

        ],
        "Beverage Add-Ons": [
          {
            productName: "Bottle Water",
            productImage: "https://res.cloudinary.com/ddyfrlx7e/image/upload/v1759480354/371eab41695bb26cd4836c9bede0f382_lyjaik.jpg",
            price: 500
          },
          
          {
            productName: "Hot Coffee",
            productImage: "https://res.cloudinary.com/ddyfrlx7e/image/upload/v1759480403/imgi_1_b2dca1369c1fd023dff978fa1488e25c_dquy77.jpg",
            price: 1000
          },

          {
            productName: "Soft Drink",
            productImage: "https://res.cloudinary.com/ddmh8i1m1/image/upload/v1759481959/Untitled_artblv.png",
            price: 500
          },
          
          {
            productName: "Milkshake",
            productImage: "https://res.cloudinary.com/ddyfrlx7e/image/upload/v1759479611/c736d315e51ff0d33058e90bcde329b4_e2e8lc.jpg",
            price: 1000
          },
        ],
      },

      "Renee’s Kitchen": {
        "Classic Continental Breakfasts": [
          {
            productName: "Pancakes with Egg",
            productImage: "https://res.cloudinary.com/ddyfrlx7e/image/upload/v1759479586/5984649553a31dcf921c89f5304c86f3_rilitr.jpg",
            price: 4500
          },

          {
            productName: "Croissant Jam",
            productImage: "https://res.cloudinary.com/ddyfrlx7e/image/upload/v1759480355/518efb542dc1e893333d131d0efcba71_kgqemt.jpg",
            price: 2500
          },

          {
            productName: "Cheese Bread Omelette",
            productImage: "https://res.cloudinary.com/ddyfrlx7e/image/upload/v1759479611/d3f53161668afaef54af63e053be6b69_rbmsfr.jpg",
            price: 1500
          },

          {
            productName: "Spinach Omelette",
            productImage: "https://res.cloudinary.com/ddyfrlx7e/image/upload/v1759480346/98e8a5d3ac4dfe65448b135e470bebe2_hxpgnk.jpg",
            price: 3000
          },

          {
            productName: "Waffles & Berries",
            productImage: "https://res.cloudinary.com/ddyfrlx7e/image/upload/v1759479562/90a311ff6673b7b1e50dae7eb1b5b391_boabjv.jpg",
            price: 2500
          },

          {
            productName: "Akara and Oats",
            productImage: "https://res.cloudinary.com/ddmh8i1m1/image/upload/v1759482807/Untitled_zcta4r.png",
            price: 1500
          },
          
          {
            productName: "Pancake Rolls",
            productImage: "https://res.cloudinary.com/ddyfrlx7e/image/upload/v1759480390/e3d917cbf4ee0350c0e9a20f3d89296a_bxxznn.jpg",
            price: 3500
          },

          {
            productName: "Waffles and Coffee",
            productImage: "https://res.cloudinary.com/ddmh8i1m1/image/upload/v1759482705/Untitled_ghhnee.png",
            price: 3000
          },
        ],

        "Healthy Picks": [
          {
            productName: "Scrambled Bowl",
            productImage: "https://res.cloudinary.com/ddyfrlx7e/image/upload/v1759480306/3d652507bc3b3a35907bfff003aead79_sa9gri.jpg",
            price: 2500
          },

          {
            productName: "Boiled Plaintain & Fish",
            productImage: "https://res.cloudinary.com/ddyfrlx7e/image/upload/v1759480361/47770acf35b8fa70088c8859fd36b37c_jlvsaa.jpg",
            price: 3500
          },

          {
            productName: "Pap and Moi-moi",
            productImage: "https://res.cloudinary.com/ddyfrlx7e/image/upload/v1759479611/c58b773d92f4ad2e680e526b39e0925d_c9rkly.jpg",
            price: 4500
          },

          {
            productName: "Porridge Yam",
            productImage: "https://res.cloudinary.com/ddyfrlx7e/image/upload/v1759479634/d3742a8604644dff2263c90afb775c5e_k5dqn8.jpg",
            price: 2500
          },

          {
            productName: "Yam & Egg",
            productImage: "https://res.cloudinary.com/ddyfrlx7e/image/upload/v1759480356/960f3477fb95917c4b34d395afeeb824_ptd7rx.jpg",
            price: 3500
          },

          {
            productName: "Plaintain Pepper Soup",
            productImage: "https://res.cloudinary.com/ddyfrlx7e/image/upload/v1759480305/7bce05956da5483ddf098e09db1df986_jzg0au.jpg",
            price: 2500
          },

          {
            productName: "Vegetable Salad",
            productImage: "https://res.cloudinary.com/ddyfrlx7e/image/upload/v1759480304/2e9727ee207738ec723a556b0ef324ae_sia9yu.jpg",
            price: 2500
          },

          {
            productName: "Egg with Avocado",
            productImage: "https://res.cloudinary.com/ddyfrlx7e/image/upload/v1759479636/e8b77458fc0ad29d389ea17b6318b610_ofhu91.jpg",
            price: 2500
          },
        ],

        "Beverages Add-Ons": [
          {
            productName: "Bottle Water",
            productImage: "https://res.cloudinary.com/ddyfrlx7e/image/upload/v1759479585/371eab41695bb26cd4836c9bede0f382_yd0c8j.jpg",
            price: 500
          },

          {
            productName: "Hot Coffee",
            productImage: "https://res.cloudinary.com/ddyfrlx7e/image/upload/v1759480403/imgi_1_b2dca1369c1fd023dff978fa1488e25c_dquy77.jpg",
            price: 1000
          },
          
          {
            productName: "Soft Drink",
            productImage: "https://res.cloudinary.com/ddmh8i1m1/image/upload/v1759481959/Untitled_artblv.png",
            price: 500
          },

          {
            productName: "Milkshake",
            productImage: "https://res.cloudinary.com/ddyfrlx7e/image/upload/v1759480378/c736d315e51ff0d33058e90bcde329b4_vldwmi.jpg",
            price: 1000
          },
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

          {
            productName: "Butter Pie",
            productImage: "https://res.cloudinary.com/ddyfrlx7e/image/upload/v1759407114/bpie_hixjls.jpg", 
            price: 2000
          },

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

          {
            productName: "Milkshake",
            productImage: "https://res.cloudinary.com/ddyfrlx7e/image/upload/v1759480378/c736d315e51ff0d33058e90bcde329b4_vldwmi.jpg",
            price: 2000
          },

          {
            productName: "Bottle Water",
            productImage: "https://res.cloudinary.com/ddyfrlx7e/image/upload/v1759480354/371eab41695bb26cd4836c9bede0f382_lyjaik.jpg",
            price: 500
          },

          {
            productName: "Soft Drink",
            productImage: "https://res.cloudinary.com/ddmh8i1m1/image/upload/v1759481959/Untitled_artblv.png",
            price: 500
          },
        ],
      },

      "Kayliz's Kitchen": {
        "Classic Conitinental Breakfasts": [
          {
            productName: "Rice Balls",
            productImage: "https://res.cloudinary.com/ddyfrlx7e/image/upload/v1759403668/rice_ball_afjy0k.jpg",
            price: 4500
          },

          {
            productName: "Croissant Jam",
            productImage: "https://res.cloudinary.com/ddyfrlx7e/image/upload/v1759479585/518efb542dc1e893333d131d0efcba71_lzpi1a.jpg",
            price: 2500
          },

          {
            productName: "Cheese Bread Omelette",
            productImage: "https://res.cloudinary.com/ddyfrlx7e/image/upload/v1759479611/d3f53161668afaef54af63e053be6b69_rbmsfr.jpg",
            price: 1500
          },

          { productName: "Spinach Omelette",
            productImage: "https://res.cloudinary.com/ddyfrlx7e/image/upload/v1759479584/98e8a5d3ac4dfe65448b135e470bebe2_jn0nsp.jpg",
            price: 3000
          },

          {
            productName: "Waffles & Berries",
            productImage: "https://res.cloudinary.com/ddyfrlx7e/image/upload/v1759479562/90a311ff6673b7b1e50dae7eb1b5b391_1_tpf1mv.jpg",
            price: 2500
          },
          
          {
            productName: "Akara and Oats",
            productImage: "https://res.cloudinary.com/ddmh8i1m1/image/upload/v1759482807/Untitled_zcta4r.png",
            price: 1500
          },

          {
            productName: "Pancake Rolls",
            productImage: "https://res.cloudinary.com/ddmh8i1m1/image/upload/v1759482807/Untitled_zcta4r.png",
            price: 3500
          },
          
          {
            productName: "Waffles and Coffee",
            productImage: "https://res.cloudinary.com/ddmh8i1m1/image/upload/v1759482705/Untitled_ghhnee.png",
            price: 3000
          },
        ],
        "Halthy Picks": [
          {
            productName: "Scrambled Bowl",
            productImage: "https://res.cloudinary.com/ddyfrlx7e/image/upload/v1759479561/3d652507bc3b3a35907bfff003aead79_qpuh19.jpg",
            price: 2500
          },

          {
          productName: "Boiled Plaintain & Fish",
          productImage: "https://res.cloudinary.com/ddyfrlx7e/image/upload/v1759480361/47770acf35b8fa70088c8859fd36b37c_jlvsaa.jpg",
          price: 3500
        },

          {
            productName: "Pap and Moi-moi",
            productImage: "https://res.cloudinary.com/ddyfrlx7e/image/upload/v1759479611/c58b773d92f4ad2e680e526b39e0925d_c9rkly.jpg",
            price: 4500
          },

          {
            productName: "Porridge Yam",
            productImage: "https://res.cloudinary.com/ddyfrlx7e/image/upload/v1759479611/d3742a8604644dff2263c90afb775c5e_1_tjiizw.jpg",
            price: 2500
          },

          {
            productName: "Plaintain Pepper Soup",
            productImage: "https://res.cloudinary.com/ddyfrlx7e/image/upload/v1759479560/7bce05956da5483ddf098e09db1df986_ih7sip.jpg",
            price: 2500
          },

          {
            productName: "Vegetable Salad",
            productImage: "https://res.cloudinary.com/ddyfrlx7e/image/upload/v1759479561/2e9727ee207738ec723a556b0ef324ae_clrvds.jpg",
            price: 2500
          },

          {
            productName: "Egg with Avocado",
            productImage: "https://res.cloudinary.com/ddyfrlx7e/image/upload/v1759479636/e8b77458fc0ad29d389ea17b6318b610_ofhu91.jpg",
            price: 2500
          },
        ],

        "Beverage Add-Ons": [
          {
          productName: "Bottle Water",
          productImage: "https://res.cloudinary.com/ddyfrlx7e/image/upload/v1759479585/371eab41695bb26cd4836c9bede0f382_yd0c8j.jpg",
          price: 500
        },

          {
            productName: "Hot Coffee",
            productImage: "https://res.cloudinary.com/ddyfrlx7e/image/upload/v1759480403/imgi_1_b2dca1369c1fd023dff978fa1488e25c_dquy77.jpg",
            price: 1000
          },

          {
            productName: "Soft Drink",
            productImage: "https://res.cloudinary.com/ddmh8i1m1/image/upload/v1759481959/Untitled_artblv.png",
            price: 500
          },

          {
            productName: "Milkshake",
            productImage: "https://res.cloudinary.com/ddyfrlx7e/image/upload/v1759480378/c736d315e51ff0d33058e90bcde329b4_vldwmi.jpg",
            price: 1000
          },
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
          category: category._id
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
