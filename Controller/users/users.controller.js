const { create, getUsers, getUserById, updateUser, deleteUser } = require("../../Service/Users/Users.service.js")
const { genSaltSync, hashSync } = require("bcrypt");

module.exports = {
    createUser: (req, res) => {
        const body = req.body;
        const salt = genSaltSync(10);
        body.password = hashSync(body.password, salt);
        create(body, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    success: 0,
                    message: "Database connection error"
                });
            }
            return res.status(200).json({
                success: 1,
                data: results
            });

        });
    },
    getUsers: (req, res) => {
        getUsers((err, results) => {
            if (err) {
                console.log(err);
                return;
            }
            return res.json({
                success: 1,
                data: results
            });
        });
    },
    getUserById: (req, res) => {
        const id = req.params.id;
        getUserById(id, (err, results) => {
            if (err) {
                console.log(err);
                return;
            }
            if (!results) {
                return res.json({
                    success: 0,
                    message: "Record not found"
                });
            }
            return res.json({
                success: 1,
                data: results
            });
        });
    },
    updateUser: (req, res) => {
        const { id, ...body } = req.body;
        const salt = genSaltSync(10);
        body.password = hashSync(body.password, salt);
        updateUser({ id, ...body }, (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    success: 0,
                    message: "Failed to update user",
                });
            }
            return res.json({
                success: 1,
                message: "User updated successfully",
            });
        });
    },

    deleteUser: (req, res) => {
        const { id } = req.body;
        deleteUser(id, (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    success: 0,
                    message: "Failed to delete user",
                });
            }
            if (!results.affectedRows) {
                return res.status(404).json({
                    success: 0,
                    message: "User not found",
                });
            }
            return res.json({
                success: 1,
                message: "User deleted successfully",
            });
        });
    },

};
