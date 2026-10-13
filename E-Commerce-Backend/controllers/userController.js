const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        userModel.createUser(
            name,
            email,
            hashedPassword,
            (err, result) => {
                if (err) {
                    console.log(err);

                    return res.status(500).json({
                        message: "Failed to create user"
                    });
                }

                res.status(201).json({
                    message: "User created successfully",
                    userId: result.insertId
                });
            }
        );

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Password hashing failed"
        });
    }
};


const loginUser = async (req, res) => {
    const { email, password } = req.body;

    userModel.findUserByEmail(
        email,
        async (err, results) => {

            if (err) {
                console.log(err);

                return res.status(500).json({
                    message: "Database error"
                });
            }

            if (results.length === 0) {
                return res.status(404).json({
                    message: "User not found"
                });
            }

            const user = results[0];

            try {
                const passwordMatch = await bcrypt.compare(
                    password,
                    user.password
                );

                if (!passwordMatch) {
                    return res.status(401).json({
                        message: "Invalid password"
                    });
                }

                const token = jwt.sign(
                    {
                        userId: user.id,
                        email: user.email
                    },
                    process.env.JWT_SECRET,
                    {
                        expiresIn: "1h"
                    }
                );

                res.json({
                    message: "Login successful",
                    token: token,
                    name: user.name
                });

            } catch (error) {
                console.log(error);

                return res.status(500).json({
                    message: "Password comparison failed"
                });
            }
        }
    );
};


module.exports = {
    createUser,
    loginUser
};