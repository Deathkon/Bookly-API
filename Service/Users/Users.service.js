const pool = require("../../config/server");
const bcrypt = require('bcrypt');
const winston = require('winston');

const SALT_ROUNDS = 12; // Stronger salt for bcrypt

const hashPassword = async (password) => {
    try {
        const hash = await bcrypt.hash(password, SALT_ROUNDS);
        return hash;
    } catch (error) {
        throw error;
    }
};

const checkUserByEmail = async (email) => {
    try {
        const [results] = await pool.query(`SELECT * FROM users WHERE email = ?`, [email]);
        return results[0]; // Return the user object if user with the email exists
    } catch (error) {
        throw error;
    }
};

module.exports = {
    create: async (data) => {
        try {
            const userExists = await checkUserByEmail(data.email);
            if (userExists) {
                return "User with this email already exists";
            }

            const hashedPassword = await hashPassword(data.password);

            const query = `
                INSERT INTO users(
                    business_name, name, email, first_name, last_name, password, phone, birthday,
                    address, address2, city, state, country, zip_code, bio, status, vendor_commission_amount,
                    vendor_commission_type, role_id, email_verified_at
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            const values = [
                data.business_name,
                data.name,
                data.email,
                data.first_name,
                data.last_name,
                hashedPassword,
                data.phone,
                data.birthday,
                data.address,
                data.address2,
                data.city,
                data.state,
                data.country,
                data.zip,
                data.bio,
                data.status,
                data.vendor_commission_amount,
                data.vendor_commission_type,
                data.role_id,
                data.email_verified_at,
            ];

            const [results] = await pool.query(query, values);
            return results;
        } catch (error) {
            winston.error("Error creating user:", error);
            throw error;
        }
    },

    getUsers: async () => {
        try {
            const [results] = await pool.query(`SELECT * FROM users`);
            return results;
        } catch (error) {
            throw error;
        }
    },

    getUserById: async (id) => {
        try {
            const [results] = await pool.query(`SELECT * FROM users WHERE id = ?`, [id]);
            return results[0];
        } catch (error) {
            throw error;
        }
    },

    updateUser: async (data) => {
        try {
            const query = `
                UPDATE users
                SET business_name = ?, name = ?, email = ?, first_name = ?, last_name = ?, phone = ?, birthday = ?,
                    address = ?, address2 = ?, city = ?, state = ?, country = ?, zip_code = ?, bio = ?, status = ?,
                    vendor_commission_amount = ?, vendor_commission_type = ?, role_id = ?, email_verified_at = ?
                WHERE id = ?
            `;

            const values = [
                data.business_name,
                data.name,
                data.email,
                data.first_name,
                data.last_name,
                data.phone,
                data.birthday,
                data.address,
                data.address2,
                data.city,
                data.state,
                data.country,
                data.zip,
                data.bio,
                data.status,
                data.vendor_commission_amount,
                data.vendor_commission_type,
                data.role_id,
                data.email_verified_at,
                data.id
            ];

            const [results] = await pool.query(query, values);
            return results;
        } catch (error) {
            throw error;
        }
    },

    deleteUser: async (id) => {
        try {
            const [results] = await pool.query(`DELETE FROM users WHERE id = ?`, [id]);
            return results;
        } catch (error) {
            throw error;
        }
    },
    checkUserByEmail,
};
