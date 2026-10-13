const userModel = require("../models/userModel");

const getProfile = (req, res) => {
    const userId = req.user.userId;

    userModel.getUserById(userId, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                message: "Failed to retrieve profile"
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json({
            message: "Profile retrieved successfully",
            user: results[0]
        });
    });
};


const updateProfile = (req, res) => {
    const userId = req.user.userId;

    const { name, email } = req.body;

    userModel.updateUser(
        userId,
        name,
        email,
        (err, result) => {

            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: "Failed to update profile"
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "User not found"
                });
            }

            res.json({
                message: "Profile updated successfully"
            });
        }
    );
};


module.exports = {
    getProfile,
    updateProfile
};