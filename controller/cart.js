const Cart = require("../model/cart");
const Product = require("../model/product");
const { promoHelpers } = require("./promo");

const buildBreakdown = (items, extractor) => {
  const groupedData = {};

  items.forEach((item) => {
    const groupName = extractor(item);

    if (!groupName) {
      return;
    }

    groupedData[groupName] = (groupedData[groupName] || 0) + item.quantity;
  });

  return Object.entries(groupedData)
    .map(([name, quantity]) => ({ name, quantity }))
    .sort((firstEntry, secondEntry) => secondEntry.quantity - firstEntry.quantity);
};

exports.addToCart = async (req, res) => {
  try {
    const userId = req.user;
    const { productId, quantity } = req.body;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({
        user: userId,
        items: [],
        appliedPromo: { code: null, discount: 0, totalAfterDiscount: 0 },
      });
    }
    const itemIndex = cart.items.findIndex((item) => item.product.equals(productId));
    const qty = quantity && quantity > 0 ? quantity : 1;
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += qty;
    } else {
      cart.items.push({ product: productId, quantity: qty });
    }

    cart.appliedPromo = { code: null, discount: 0, totalAfterDiscount: 0 };

    await cart.save();
    res.status(200).json({
      message: "Item added to cart",
      data: cart,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error: " + error.message,
    });
  }
};

exports.getCart = async (req, res) => {
  try {
    const userId = req.user;

    const cart = await Cart.findOne({ user: userId }).populate({
      path: "items.product",
      populate: [
        { path: "kitchen", select: "kitchenName" },
        { path: "category", select: "name" },
      ],
    });

    if (!cart || cart.items.length === 0) {
      return res.status(200).json({
        message: "Cart is empty",
        data: {
          items: [],
          total: 0,
          discountedTotal: 0,
          appliedPromo: null,
          summary: {
            uniqueItems: 0,
            totalQuantity: 0,
          averageItemPrice: 0,
          estimatedRewardPoints: 0,
        },
          insights: {
            kitchens: [],
            categories: [],
            suggestedAddOns: [],
          },
        },
      });
    }
    let cartTotal = 0;
    let totalQuantity = 0;

    cart.items.forEach((item) => {
      if (item.product && item.product.price) {
        cartTotal += item.product.price * item.quantity;
        totalQuantity += item.quantity;
      }
    });

    const kitchenBreakdown = buildBreakdown(cart.items, (item) => item.product?.kitchen?.kitchenName);
    const categoryBreakdown = buildBreakdown(cart.items, (item) => item.product?.category?.name);
    const dominantKitchenName = kitchenBreakdown[0]?.name || null;
    const dominantCategoryName = categoryBreakdown[0]?.name || null;
    const cartProductIds = cart.items.map((item) => item.product?._id).filter(Boolean);

    const suggestionQuery = {
      _id: { $nin: cartProductIds },
    };

    if (dominantKitchenName) {
      const dominantKitchen = cart.items.find((item) => item.product?.kitchen?.kitchenName === dominantKitchenName)?.product?.kitchen?._id;
      if (dominantKitchen) {
        suggestionQuery.kitchen = dominantKitchen;
      }
    }

    if (dominantCategoryName) {
      const dominantCategory = cart.items.find((item) => item.product?.category?.name === dominantCategoryName)?.product?.category?._id;
      if (dominantCategory) {
        suggestionQuery.category = dominantCategory;
      }
    }

    let suggestedAddOns = await Product.find(suggestionQuery)
      .populate("kitchen", "kitchenName")
      .populate("category", "name")
      .sort({ price: 1, createdAt: -1 })
      .limit(3);

    if (!suggestedAddOns.length && suggestionQuery.kitchen) {
      suggestedAddOns = await Product.find({
        _id: { $nin: cartProductIds },
        kitchen: suggestionQuery.kitchen,
      })
        .populate("kitchen", "kitchenName")
        .populate("category", "name")
        .sort({ price: 1, createdAt: -1 })
        .limit(3);
    }

    if (!suggestedAddOns.length) {
      suggestedAddOns = await Product.find({ _id: { $nin: cartProductIds } })
        .populate("kitchen", "kitchenName")
        .populate("category", "name")
        .sort({ price: 1, createdAt: -1 })
        .limit(3);
    }

    res.status(200).json({
      message: "Cart retrieved successfully",
      data: {
        items: cart.items,
        total: Number(cartTotal.toFixed(2)),
        discountedTotal: Number((cart.appliedPromo?.totalAfterDiscount || cartTotal).toFixed(2)),
        appliedPromo: cart.appliedPromo?.code ? cart.appliedPromo : null,
        summary: {
          uniqueItems: cart.items.length,
          totalQuantity,
          averageItemPrice: Number((cartTotal / totalQuantity).toFixed(2)),
          estimatedRewardPoints: promoHelpers.getRewardPoints(cartTotal),
        },
        insights: {
          kitchens: kitchenBreakdown,
          categories: categoryBreakdown,
          suggestedAddOns,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.updateCart = async (req, res) => {
  try {
    const userId = req.user;
    const { productId, quantity } = req.body;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    const itemIndex = cart.items.findIndex((item) => item.product.equals(productId));

    if (itemIndex === -1) {
      return res.status(404).json({
        message: "Item not found in cart",
      });
    }

    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    cart.appliedPromo = { code: null, discount: 0, totalAfterDiscount: 0 };

    await cart.save();
    res.status(200).json({
      message: "Cart updated successfully",
      data: cart,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const userId = req.user;

    const cart = await Cart.findOneAndUpdate(
      { user: userId },
      { $set: { items: [], appliedPromo: { code: null, discount: 0, totalAfterDiscount: 0 } } },
      { new: true }
    );

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    res.status(200).json({
      message: "Cart cleared successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
