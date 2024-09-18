import User from "../model/User.js";
import bcrypt from "bcrypt"; // To hash the password
import jwt from "jsonwebtoken"; // To generate JWT tokens
import cloudinary from "../cloudinary.js";

// Register API For User
export const register = async (req, res) => {
  const { email, name, address, password, image } = req.body;

  try {
    const existUser = await User.findOne({ email });

    if (existUser) {
      return res.status(400).json({ msg: "User already registered" });
    }

    // Uploading image to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(image, {
      upload_preset: "eeeghag0",
      public_id: `${email}_avatar`,
      allowed_formats: ["png", "jpg", "jpeg", "svg"],
    });

    // Check for upload result
    if (!uploadResult || !uploadResult.secure_url) {
      return res.status(500).json({ msg: "Image upload failed" });
    }

    // Fetch optimized URL (if needed)
    const optimizeUrl = cloudinary.url(uploadResult.public_id, {
      fetch_format: "auto",
      quality: "auto",
    });

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new User({
      email,
      name,
      address,
      password: hashedPassword, // Store the hashed password
      image: optimizeUrl, // Store the optimized URL or use uploadResult.secure_url
    });

    await newUser.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      process.env.JWT_SECRET // Use your secret key for signing the token
    );

    // Send response with token and user data
    res.status(200).json({
      msg: "User registered successfully",
      token, // JWT token
      user: newUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Login API For User
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });

    // Check if the user exists
    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    // Compare the entered password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    // If the passwords do not match, return an error
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Generate a JWT token if the credentials are correct
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET // Use your JWT secret key
    );

    // Return a success response with the token
    return res.status(200).json({ msg: "Login successful", token, user });
  } catch (error) {
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Update API For User
export const update = async (req, res) => {
  try {
    const id = req.body._id; // User ID from the body
    const { email, name, address, image } = req.body;

    // Find the user by ID
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Update user fields
    if (email) user.email = email;
    if (name) user.name = name;
    if (address) user.address = address;

    // Handle image upload if an image is provided
    if (image) {
      // Upload image to Cloudinary
      const uploadResult = await cloudinary.uploader.upload(image, {
        upload_preset: "eeeghag0",
        public_id: `${email}_avatar`,
        overwrite:true,
        allowed_formats: ["png", "jpg", "jpeg", "svg"],
      });

      // Check if the upload was successful and set the secure_url to user.image
      if (!uploadResult || !uploadResult.secure_url) {
        return res.status(500).json({ msg: "Image upload failed" });
      }

      user.image = uploadResult.secure_url; // Save the secure_url directly
    }

    await user.save();

    // Return success response with updated user data
    return res.status(200).json({ msg: "User updated successfully", user });
  } catch (error) {
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// GetUserDate API For User

export const getUser = async (req, res) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({ email });
    if (user) {
      res.status(200).json({ user });
    } else {
      res.status(500).json({ msg: "user Not found" });
    }
  } catch (error) {
    res.status(500).json({ msg: "Internal Server Error" });
  }
};
