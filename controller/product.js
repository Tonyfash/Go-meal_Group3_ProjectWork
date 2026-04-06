const Product = require("../model/product");
const Kitchen = require("../model/kitchen");
const Category = require("../model/category");
const Cart = require("../model/cart");

const PRODUCT_POPULATION = [
  { path: "kitchen", select: "kitchenName" },
  { path: "category", select: "name" },
];

const parseNumberQuery = (value) => {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : null;
};

const buildProductFilters = (query) => {
  const filters = {};
  const minPrice = parseNumberQuery(query.minPrice);
  const explicitMaxPrice = parseNumberQuery(query.maxPrice);
  const budget = parseNumberQuery(query.budget);
  const maxPrice = explicitMaxPrice ?? budget;

  if (query.search) {
    filters.productName = { $regex: query.search.trim(), $options: "i" };
  }

  if (query.kitchenId) {
    filters.kitchen = query.kitchenId;
  }

  if (query.categoryId) {
    filters.category = query.categoryId;
  }

  if (minPrice !== null || maxPrice !== null) {
    filters.price = {};

    if (minPrice !== null) {
      filters.price.$gte = minPrice;
    }

    if (maxPrice !== null) {
      filters.price.$lte = maxPrice;
    }
  }

  return { filters, minPrice, maxPrice, budget };
};

const buildSortOption = (sortBy) => {
  switch (sortBy) {
    case "price_asc":
      return { price: 1, productName: 1 };
    case "price_desc":
      return { price: -1, productName: 1 };
    case "name":
      return { productName: 1 };
    case "oldest":
      return { createdAt: 1 };
    case "latest":
    default:
      return { createdAt: -1 };
  }
};

const summarizeProducts = (products) => {
  if (!products.length) {
    return {
      price: { lowest: 0, highest: 0, average: 0 },
      kitchens: [],
      categories: [],
      highlights: [],
    };
  }

  const prices = products.map((product) => product.price);
  const averagePrice = prices.reduce((total, price) => total + price, 0) / prices.length;
  const sortedByPrice = [...products].sort((firstProduct, secondProduct) => firstProduct.price - secondProduct.price);

  return {
    price: {
      lowest: Math.min(...prices),
      highest: Math.max(...prices),
      average: Number(averagePrice.toFixed(2)),
    },
    kitchens: [...new Set(products.map((product) => product.kitchen?.kitchenName).filter(Boolean))],
    categories: [...new Set(products.map((product) => product.category?.name).filter(Boolean))],
    highlights: [
      {
        label: "budget_pick",
        product: sortedByPrice[0]?.productName || null,
      },
      {
        label: "premium_pick",
        product: sortedByPrice[sortedByPrice.length - 1]?.productName || null,
      },
    ],
  };
};

const buildRecommendationContext = (cart) => {
  const items = cart?.items || [];
  const kitchenPreferences = {};
  const categoryPreferences = {};
  const cartProductIds = [];
  const prices = [];

  items.forEach((item) => {
    const product = item.product;

    if (!product?._id) {
      return;
    }

    const quantity = item.quantity || 1;
    const productId = product._id.toString();
    const kitchenId = product.kitchen?._id?.toString();
    const categoryId = product.category?._id?.toString();

    cartProductIds.push(productId);
    prices.push(product.price);

    if (kitchenId) {
      kitchenPreferences[kitchenId] = (kitchenPreferences[kitchenId] || 0) + quantity;
    }

    if (categoryId) {
      categoryPreferences[categoryId] = (categoryPreferences[categoryId] || 0) + quantity;
    }
  });

  const averagePrice = prices.length
    ? prices.reduce((total, price) => total + price, 0) / prices.length
    : 0;

  return {
    cartProductIds,
    kitchenPreferences,
    categoryPreferences,
    averagePrice,
  };
};

const buildPreferenceSummary = (preferences, entries, labelField) => {
  const topEntry = entries
    .filter((entry) => entry?.[labelField]?._id)
    .sort((firstEntry, secondEntry) => {
      const secondScore = preferences[secondEntry[labelField]._id.toString()] || 0;
      const firstScore = preferences[firstEntry[labelField]._id.toString()] || 0;
      return secondScore - firstScore;
    })[0];

  if (!topEntry?.[labelField]) {
    return null;
  }

  return {
    id: topEntry[labelField]._id,
    name: topEntry[labelField].kitchenName || topEntry[labelField].name,
  };
};

const scoreRecommendation = (product, context, budget) => {
  const reasons = [];
  let score = 0;
  const kitchenId = product.kitchen?._id?.toString();
  const categoryId = product.category?._id?.toString();

  if (kitchenId && context.kitchenPreferences[kitchenId]) {
    score += context.kitchenPreferences[kitchenId] * 4;
    reasons.push(`Matches your ${product.kitchen.kitchenName} preference`);
  }

  if (categoryId && context.categoryPreferences[categoryId]) {
    score += context.categoryPreferences[categoryId] * 3;
    reasons.push(`Fits your taste for ${product.category.name}`);
  }

  if (context.averagePrice) {
    const priceDistance = Math.abs(product.price - context.averagePrice);
    const priceScore = Math.max(0, 8 - priceDistance / 500);
    score += priceScore;

    if (priceDistance <= 1000) {
      reasons.push("Sits close to your usual spend");
    }
  }

  if (budget !== null) {
    if (product.price <= budget) {
      score += 6;
      reasons.push("Fits your budget");
    } else {
      score -= 20;
    }
  }

  if (product.price <= 2500) {
    score += 1;
  }

  return {
    ...product.toObject(),
    recommendationScore: Number(score.toFixed(2)),
    recommendationReasons: reasons.slice(0, 3),
  };
};

const buildMealPlanReasoning = (combo, budget, distinctKitchenCount, distinctCategoryCount) => {
  const reasons = [];
  const totalPrice = combo.reduce((total, product) => total + product.price, 0);
  const budgetGap = budget - totalPrice;

  if (budgetGap >= 0 && budgetGap <= 1000) {
    reasons.push("Uses your budget efficiently");
  }

  if (distinctCategoryCount > 1) {
    reasons.push("Gives you a more varied meal mix");
  }

  if (distinctKitchenCount > 1) {
    reasons.push("Combines standout items across kitchens");
  }

  if (combo.length >= 3) {
    reasons.push("Builds a fuller order instead of a single-item pick");
  }

  return reasons.slice(0, 3);
};

const scoreMealPlan = (combo, budget, options) => {
  const totalPrice = combo.reduce((total, product) => total + product.price, 0);
  const distinctKitchens = new Set(combo.map((product) => product.kitchen?._id?.toString()).filter(Boolean));
  const distinctCategories = new Set(combo.map((product) => product.category?._id?.toString()).filter(Boolean));
  const budgetUsageScore = Math.max(0, 30 - Math.abs(budget - totalPrice) / 100);
  const varietyScore = distinctCategories.size * 6 + distinctKitchens.size * 4;
  const sizeScore = combo.length * 3;
  let preferenceScore = 0;

  combo.forEach((product) => {
    if (options.kitchenId && product.kitchen?._id?.toString() === options.kitchenId) {
      preferenceScore += 6;
    }

    if (options.categoryId && product.category?._id?.toString() === options.categoryId) {
      preferenceScore += 5;
    }

    if (options.search && product.productName.toLowerCase().includes(options.search.toLowerCase())) {
      preferenceScore += 4;
    }
  });

  const score = budgetUsageScore + varietyScore + sizeScore + preferenceScore;

  return {
    totalPrice,
    score: Number(score.toFixed(2)),
    reasons: buildMealPlanReasoning(combo, budget, distinctKitchens.size, distinctCategories.size),
  };
};

const buildMealPlans = (products, budget, maxItems, options) => {
  const mealPlans = [];
  const candidateProducts = [...products]
    .sort((firstProduct, secondProduct) => firstProduct.price - secondProduct.price)
    .slice(0, 18);

  const exploreCombinations = (startIndex, currentCombo, currentTotal) => {
    if (currentCombo.length > 0) {
      const scoring = scoreMealPlan(currentCombo, budget, options);

      mealPlans.push({
        items: currentCombo.map((product) => product.toObject()),
        totalPrice: scoring.totalPrice,
        remainingBudget: Number((budget - scoring.totalPrice).toFixed(2)),
        mealPlanScore: scoring.score,
        reasons: scoring.reasons,
      });
    }

    if (currentCombo.length === maxItems) {
      return;
    }

    for (let index = startIndex; index < candidateProducts.length; index += 1) {
      const product = candidateProducts[index];
      const nextTotal = currentTotal + product.price;

      if (nextTotal > budget) {
        continue;
      }

      exploreCombinations(index + 1, [...currentCombo, product], nextTotal);
    }
  };

  exploreCombinations(0, [], 0);

  return mealPlans
    .sort((firstPlan, secondPlan) => {
      if (secondPlan.mealPlanScore !== firstPlan.mealPlanScore) {
        return secondPlan.mealPlanScore - firstPlan.mealPlanScore;
      }

      return firstPlan.remainingBudget - secondPlan.remainingBudget;
    })
    .slice(0, 3);
};


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
    const { filters, minPrice, maxPrice, budget } = buildProductFilters(req.query);
    const sortBy = req.query.sortBy || "latest";
    const page = Math.max(parseNumberQuery(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseNumberQuery(req.query.limit) || 12, 1), 50);
    const skip = (page - 1) * limit;

    const totalProducts = await Product.countDocuments(filters);
    const products = await Product.find(filters)
      .populate(PRODUCT_POPULATION)
      .sort(buildSortOption(sortBy))
      .skip(skip)
      .limit(limit);

    const insights = summarizeProducts(products);

    res.status(200).json({
      success: true,
      count: products.length,
      totalMatchedProducts: totalProducts,
      data: products,
      filters: {
        search: req.query.search || null,
        kitchenId: req.query.kitchenId || null,
        categoryId: req.query.categoryId || null,
        minPrice,
        maxPrice,
        budget,
        sortBy,
      },
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(totalProducts / limit),
      },
      insights,
      message: "Products retrieved successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getSmartMealPlan = async (req, res) => {
  try {
    const budget = parseNumberQuery(req.query.budget);
    const maxItems = Math.min(Math.max(parseNumberQuery(req.query.maxItems) || 3, 1), 4);

    if (budget === null || budget <= 0) {
      return res.status(400).json({
        success: false,
        message: "A valid budget query is required for meal planning",
      });
    }

    const { filters } = buildProductFilters({
      search: req.query.search,
      kitchenId: req.query.kitchenId,
      categoryId: req.query.categoryId,
      maxPrice: budget,
    });

    const products = await Product.find(filters)
      .populate(PRODUCT_POPULATION)
      .sort({ price: 1, createdAt: -1 });

    if (!products.length) {
      return res.status(404).json({
        success: false,
        message: "No products match this budget or preference combination",
      });
    }

    const mealPlans = buildMealPlans(products, budget, maxItems, {
      kitchenId: req.query.kitchenId || null,
      categoryId: req.query.categoryId || null,
      search: req.query.search || null,
    });

    if (!mealPlans.length) {
      return res.status(404).json({
        success: false,
        message: "Unable to build a meal plan with the current budget",
      });
    }

    res.status(200).json({
      success: true,
      budget,
      count: mealPlans.length,
      preferences: {
        kitchenId: req.query.kitchenId || null,
        categoryId: req.query.categoryId || null,
        search: req.query.search || null,
        maxItems,
      },
      data: mealPlans,
      message: "Smart meal plans generated successfully",
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

    const product = await Product.findById(id).populate(PRODUCT_POPULATION);

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

exports.getRecommendedProducts = async (req, res) => {
  try {
    const budget = parseNumberQuery(req.query.budget);
    const limit = Math.min(Math.max(parseNumberQuery(req.query.limit) || 6, 1), 20);

    const cart = await Cart.findOne({ user: req.user }).populate({
      path: "items.product",
      populate: PRODUCT_POPULATION,
    });

    const context = buildRecommendationContext(cart);
    const recommendationFilters = {};

    if (context.cartProductIds.length) {
      recommendationFilters._id = { $nin: context.cartProductIds };
    }

    if (budget !== null) {
      recommendationFilters.price = { $lte: budget };
    }

    const recommendationPool = await Product.find(recommendationFilters)
      .populate(PRODUCT_POPULATION)
      .sort({ createdAt: -1 })
      .limit(40);

    if (!recommendationPool.length) {
      return res.status(404).json({
        success: false,
        message: "No recommendations available for the selected budget",
      });
    }

    const personalizedProducts = recommendationPool
      .map((product) => scoreRecommendation(product, context, budget))
      .sort((firstProduct, secondProduct) => secondProduct.recommendationScore - firstProduct.recommendationScore)
      .slice(0, limit);

    const favoriteKitchen = buildPreferenceSummary(context.kitchenPreferences, personalizedProducts, "kitchen");
    const favoriteCategory = buildPreferenceSummary(context.categoryPreferences, personalizedProducts, "category");

    res.status(200).json({
      success: true,
      count: personalizedProducts.length,
      data: personalizedProducts,
      personalization: {
        budget,
        averageCartPrice: Number(context.averagePrice.toFixed(2)),
        favoriteKitchen,
        favoriteCategory,
        basedOnCartItems: context.cartProductIds.length,
      },
      message: context.cartProductIds.length
        ? "Personalized recommendations generated successfully"
        : "Starter recommendations generated successfully",
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
