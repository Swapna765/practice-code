import User from "../model/userModel.js";

export const create = async (req, res) => {
  try {
    const body = req.body || {};

    const normalizedUser = {
      ...body,
      address: body.address || body.adress,
    };

    delete normalizedUser.adress;

    const newUser = new User(normalizedUser);
    const { email } = newUser;

    const userExist = await User.findOne({ email });

    if (userExist) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    const saveData = await newUser.save();
    // res.status(201).json(saveData);
    res.status(201).json({message: "User created successfully"});
  } catch (error) {
    res.status(500).json({
      errorMessage: error.message,
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const userData = await User.find();

    if (!userData || userData.length === 0) {
      return res.status(404).json({
        message: "User data not found.",
      });
    }

    res.status(200).json(userData);
  } catch (error) {
    res.status(500).json({
      errorMessage: error.message,
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const id = req.params.id;

    const userExist = await User.findById(id);

    if (!userExist) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    res.status(200).json(userExist);
  } catch (error) {
    res.status(500).json({
      errorMessage: error.message,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const id = req.params.id;

    const userExist = await User.findById(id);

    if (!userExist) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({
      errorMessage: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;

    const userExist = await User.findById(id);

    if (!userExist) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    await User.findByIdAndDelete(id);

    res.status(200).json({
      message: "User deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      errorMessage: error.message,
    });
  }
};
