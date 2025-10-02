const Kitchen = require("../model/kitchen");

exports.seedKitchen = async (req, res) => {
  try {
    await Kitchen.deleteMany();

    const kitchens = await Kitchen.create([
      {
        kitchenName: "Heritage Kitchen",
        kitchenLogo: "https://res.cloudinary.com/dmqhseusw/image/upload/v1759321124/Heritage-menu6-724x1024_zygcmw.webp",
        description:
          "Heritage Kitchen is a culinary collection devoted to bringing timeless Nigerian breakfast classics to the modern table. Founded by a family of passionate cooks, the kitchen blends age-old recipes with fresh, locally sourced ingredients to create meals that feel like home, yet fit the pace of today's busy lifestyle.",
      },
      {
        kitchenName: "Renee’s Kitchen",
        kitchenLogo: "https://res.cloudinary.com/dmqhseusw/image/upload/v1759324024/reneeskitchen-window-mockup_yaqkzs.jpg",
        description:
          "Renee’s Kitchen is a bright, contemporary breakfast brand that specializes in quick, wholesome meals designed for people on the go. Founded by Chef Renee Okoro, the kitchen started as a small home project and has grown into a trusted name for innovative morning dishes",
      },
      {
        kitchenName: "Mama Kitchen",
        kitchenLogo: "https://res.cloudinary.com/dmqhseusw/image/upload/v1759324023/imageye___-_imgi_1_chef-mama-kitchen-logo_25327-241_qinutv.jpg",
        description:
          "Mama Kitchen is your go-to destination for hearty, home-style breakfasts inspired by Nigeria’s most loved family recipes. What began as a neighborhood food stand has grown into a trusted breakfast hub for professionals and remote workers alike",
      },
      {
        kitchenName: "Kayliz's Kitchen",
        kitchenLogo: "https://res.cloudinary.com/dmqhseusw/image/upload/v1759323998/IMG_0424_bbn40x.webp",
        description:
          "Kayliz’s Kitchen is a vibrant Go-Meal partner specializing in fresh, health-forward breakfasts that don’t compromise on taste. Founded by wellness enthusiast Kayla Izu, the kitchen started with a mission to give busy professionals and remote workers cleaner, smarter morning meals",
      },
    ]);

    res.status(201).json({
      success: true,
      message: "Kitchens seeded successfully!",
      data: kitchens,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

exports.getKitchen = async (req, res) => {
  try {
    const { id } = req.params;

    const kitchen = await Kitchen.findById(id);

    if (!kitchen) {
      return res.status(404).json({
        success: false,
        message: "Kitchen not found",
      });
    }

    res.status(200).json({
      success: true,
      data: kitchen,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getAllKitchens = async (req, res) => {
  try {
    const kitchens = await Kitchen.find();
    res.status(200).json({
      success: true,
      count: kitchens.length,
      data: kitchens,
      message: "Kitchens retrieved successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
