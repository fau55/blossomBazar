import { User } from "../models/user.js";

const getAllUsers = async (req, res) => {
    User.find()
        .then((users) => {
            res.status(200).json({
                message: "All users fetched successfully",
                allUser: users,
            });
        })
        .catch((err) => {
            res.status(500).json({
                message: "Error fetching users",
                error: err,
            });
        });
};

const registerAsSeller = async (req, res) => {
    const userToAdd = new User({
        ...req.body,
        role: "Seller",
    });

    userToAdd
        .save()
        .then((user) => {
            res.status(200).json({
                message: "User added as seller successfully",
                user,
            });
        })
        .catch((err) => {
            res.status(400).json({
                error: err,
            });
        });
};

const registerAsBuyer = async (req, res) => {
    const userToAdd = new User({
        ...req.body,
        role: "Seller",
    });

    userToAdd
        .save()
        .then((user) => {
            res.status(200).json({
                message: "User added as seller successfully",
                user,
            });
        })
        .catch((err) => {
            res.status(400).json({
                error: err,
            });
        });
};

const login = async (req, res) => {
    User.findOne({ email: req.body.email })
        .then((user) => {
            if (user) {
                if (user.password === req.body.password) {
                    res.status(200).json({
                        message: "Login successful",
                        userExist: true,
                        correctPassword: true,
                        userRole: user.role,
                        user_id: user._id,
                        user_name: `${user.firstName} ${user.lastName}`,
                    });
                } else {
                    res.status(200).json({
                        message: "Wrong password",
                        userExist: true,
                        correctPassword: false,
                    });
                }
            } else {
                res.status(200).json({
                    message: "User does not exist",
                    userExist: false,
                    correctPassword: false,
                });
            }
        })
        .catch((err) => {
            res.status(500).json({
                error: err,
            });
        });
};
const getuserById = async (req, res) => {
    User.findById(req.params.id)
        .then((user) => {
            if (user) {
                res.status(200).json({
                    message: "User fetched by ID successfully",
                    user,
                });
            } else {
                res.status(404).json({
                    message: "User not found",
                });
            }
        })
        .catch((err) => {
            res.status(500).json({
                error: err,
            });
        });
};

const uploadUserProfile = async (req, res) => {
    User.findById(req.params.id)
        .then((user) => {
            if (user) {
                user.profilePhoto = req.body.profilePhoto;
                return user.save();
            } else {
                res.status(404).json({
                    message: "User not found",
                });
            }
        })
        .then((user) => {
            res.status(200).json({
                message: "Successfully added profile pic",
                user,
            });
        })
        .catch((err) => {
            res.status(500).json({
                error: err,
            });
        });
};

const editUser = async (req, res) => {
    User.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then((user) => {
            if (user) {
                res.status(200).json({
                    message: "User info edited successfully",
                    userInfo: user,
                });
            } else {
                res.status(404).json({
                    message: "User not found",
                });
            }
        })
        .catch((err) => {
            res.status(500).json({
                error: err,
            });
        });
};

const getUserProfile = async (req, res) => {
    User.findById(req.params.id)
        .then((user) => {
            if (user) {
                res.status(200).json({
                    message: "Fetched profile pic successfully",
                    profilePic: user.profilePhoto,
                });
            } else {
                res.status(404).json({
                    message: "User not found",
                });
            }
        })
        .catch((err) => {
            res.status(500).json({
                error: err,
            });
        });
};

const delteUserById = async (req, res) => {
    User.findByIdAndDelete(req.params.id)
        .then((user) => {
            if (user) {
                res.status(200).json({
                    message: "User deleted successfully",
                });
            } else {
                res.status(404).json({
                    message: "User not found",
                });
            }
        })
        .catch((err) => {
            res.status(500).json({
                error: err,
            });
        });
};

export { getAllUsers, registerAsBuyer, registerAsSeller, login, getuserById, uploadUserProfile, editUser, getUserProfile, delteUserById }