const { customAlphabet } = require("nanoid");
const Cart = require("../model/cart");
const Promo = require("../model/promo");
const User = require("../model/user");

const createCode = customAlphabet("ABCDEFGHJKLMNPQRSTUVWXYZ23456789", 8);

const calculateCartSubtotal = (cart) => {
  return (cart?.items || []).reduce((total, item) => {
    const price = item.product?.price || 0;
    return total + price * item.quantity;
  }, 0);
};

const getRewardPoints = (amount) => Math.max(1, Math.floor(amount / 500));

const getLoyaltyTier = (points) => {
  if (points >= 500) {
    return { current: "Gold", nextTier: null, pointsToNextTier: 0 };
  }

  if (points >= 200) {
    return { current: "Silver", nextTier: "Gold", pointsToNextTier: 500 - points };
  }

  return { current: "Bronze", nextTier: "Silver", pointsToNextTier: 200 - points };
};

const calculatePromoDiscount = (promo, subtotal) => {
  let discount = 0;

  if (promo.discountType === "percentage") {
    discount = subtotal * (promo.discountValue / 100);
  } else {
    discount = promo.discountValue;
  }

  if (promo.maxDiscount !== null && promo.maxDiscount !== undefined) {
    discount = Math.min(discount, promo.maxDiscount);
  }

  return Math.min(discount, subtotal);
};

const validatePromo = (promo, subtotal) => {
  if (!promo) {
    return "Promo code not found";
  }

  if (!promo.isActive) {
    return "Promo code is inactive";
  }

  if (promo.expiresAt < new Date()) {
    return "Promo code has expired";
  }

  if (promo.usageLimit !== null && promo.usageCount >= promo.usageLimit) {
    return "Promo code usage limit reached";
  }

  if (subtotal < promo.minOrderAmount) {
    return `Minimum order amount for this promo is ${promo.minOrderAmount}`;
  }

  return null;
};

exports.seedPromos = async (req, res) => {
  try {
    const promoSeeds = [
      {
        code: "WELCOME10",
        title: "Welcome Discount",
        description: "10% off for first-time style promotions",
        discountType: "percentage",
        discountValue: 10,
        minOrderAmount: 3000,
        maxDiscount: 1500,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      },
      {
        code: "BREAKFAST500",
        title: "Breakfast Saver",
        description: "Flat NGN 500 off qualifying breakfast orders",
        discountType: "flat",
        discountValue: 500,
        minOrderAmount: 2500,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
      },
      {
        code: "FREEDRINK",
        title: "Add-On Booster",
        description: "8% off with a cap for snack and drink combos",
        discountType: "percentage",
        discountValue: 8,
        minOrderAmount: 2000,
        maxDiscount: 1000,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 21),
      },
    ];

    const seededPromos = [];

    for (const promoSeed of promoSeeds) {
      const promo = await Promo.findOneAndUpdate(
        { code: promoSeed.code },
        promoSeed,
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );

      seededPromos.push(promo);
    }

    res.status(201).json({
      success: true,
      count: seededPromos.length,
      data: seededPromos,
      message: "Promo codes seeded successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.createPromo = async (req, res) => {
  try {
    const {
      title,
      description,
      discountType,
      discountValue,
      minOrderAmount,
      maxDiscount,
      expiresAt,
      usageLimit,
    } = req.body;

    if (!title || !discountType || !discountValue || !expiresAt) {
      return res.status(400).json({
        success: false,
        message: "title, discountType, discountValue, and expiresAt are required",
      });
    }

    const promo = await Promo.create({
      code: createCode(),
      title,
      description,
      discountType,
      discountValue,
      minOrderAmount,
      maxDiscount,
      expiresAt,
      usageLimit,
    });

    res.status(201).json({
      success: true,
      data: promo,
      message: "Promo code created successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getActivePromos = async (req, res) => {
  try {
    const promos = await Promo.find({
      isActive: true,
      expiresAt: { $gt: new Date() },
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: promos.length,
      data: promos,
      message: "Active promos retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.applyPromoToCart = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Promo code is required",
      });
    }

    const cart = await Cart.findOne({ user: req.user }).populate("items.product");

    if (!cart || !cart.items.length) {
      return res.status(400).json({
        success: false,
        message: "Your cart is empty",
      });
    }

    const promo = await Promo.findOne({ code: code.toUpperCase().trim() });
    const subtotal = calculateCartSubtotal(cart);
    const validationError = validatePromo(promo, subtotal);

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const discount = calculatePromoDiscount(promo, subtotal);
    const totalAfterDiscount = subtotal - discount;
    const earnedPoints = getRewardPoints(totalAfterDiscount);

    cart.appliedPromo = {
      code: promo.code,
      discount: Number(discount.toFixed(2)),
      totalAfterDiscount: Number(totalAfterDiscount.toFixed(2)),
    };
    await cart.save();

    res.status(200).json({
      success: true,
      data: {
        promo: {
          code: promo.code,
          title: promo.title,
          discountType: promo.discountType,
          discountValue: promo.discountValue,
        },
        subtotal,
        discount: Number(discount.toFixed(2)),
        totalAfterDiscount: Number(totalAfterDiscount.toFixed(2)),
        earnedPoints,
        cartPromoSaved: true,
      },
      message: "Promo applied successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getLoyaltySummary = async (req, res) => {
  try {
    const user = await User.findById(req.user);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const tier = getLoyaltyTier(user.loyaltyPoints || 0);

    res.status(200).json({
      success: true,
      data: {
        loyaltyPoints: user.loyaltyPoints || 0,
        lifetimeSavings: Number((user.lifetimeSavings || 0).toFixed(2)),
        tier: tier.current,
        nextTier: tier.nextTier,
        pointsToNextTier: tier.pointsToNextTier,
      },
      message: "Loyalty summary retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.promoHelpers = {
  getRewardPoints,
  getLoyaltyTier,
};
