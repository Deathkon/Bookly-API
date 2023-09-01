const bcrypt = require("bcrypt");
const UsersService = require("../../Service/Users/Users.service.js");

const saltRounds = 12;

module.exports = {
  async createUser(req, res) {
    try {
      const { business_name,
        name,
        email,
        first_name,
        last_name,
        password,
        phone,
        birthday,
        address,
        address2,
        city,
        state,
        country,
        zip,
        bio,
        status,
        vendor_commission_amount,
        vendor_commission_type,
        role_id,
        email_verified_at, } = req.body;

      const existingUser = await UsersService.checkUserByEmail(email);

      if (existingUser) {
        return res.status(400).json({
          success: 0,
          message: "User with the same email already exists",
        });
      }

      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const newUser = await UsersService.create({ business_name,
        name,
        email,
        first_name,
        last_name,
        password: hashedPassword,
        phone,
        birthday,
        address,
        address2,
        city,
        state,
        country,
        zip,
        bio,
        status,
        vendor_commission_amount,
        vendor_commission_type,
        role_id,
        email_verified_at, });

      return res.status(201).json({
        success: 1,
        data: newUser,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: 0,
        message: "Failed to create user",
      });
    }
  },

  async getUsers(req, res) {
    try {
      const users = await UsersService.getUsers();
      return res.json({
        success: 1,
        data: users,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: 0,
        message: "Failed to fetch users",
      });
    }
  },

  async getUserById(req, res) {
    try {
      const id = req.params.id;
      const user = await UsersService.getUserById(id);
      if (!user) {
        return res.status(404).json({
          success: 0,
          message: "User not found",
        });
      }
      return res.json({
        success: 1,
        data: user,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: 0,
        message: "Failed to fetch user",
      });
    }
  },

  async updateUser(req, res) {
    try {
      const { id, data } = req.body;
      const updatedUser = await UsersService.updateUser(id, data);
      if (!updatedUser) {
        return res.status(404).json({
          success: 0,
          message: "User not found",
        });
      }
      return res.json({
        success: 1,
        message: "User updated successfully",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: 0,
        message: "Failed to update user",
      });
    }
  },

  async deleteUser(req, res) {
    try {
      const id = req.params.id;
      const deletedUser = await UsersService.deleteUser(id);
      if (deletedUser.changedRows === 0) {
        return res.status(404).json({
          success: 0,
          message: "User not found",
        });
      }
      return res.json({
        success: 1,
        message: "User deleted successfully",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: 0,
        message: "Failed to delete user",
      });
    }
  },
};
