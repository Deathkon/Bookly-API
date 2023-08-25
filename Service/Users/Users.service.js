const pool = require("../../config/server");
const bcrypt = require('bcrypt');
const winston = require('winston');

module.exports = {
    create: (data, callBack) => {
        // Hash the password before storing
        bcrypt.hash(data.password, 10, (hashErr, hash) => {
            if (hashErr) {
                return callBack(hashErr);
            }

            const query = `
                INSERT INTO users(
                    name, first_name, last_name, business_name, email, email_verified_at, password,
                    two_factor_secret, two_factor_recovery_codes, address, address2, phone,
                    birthday, city, state, country, zip_code, last_login_at, avatar_id, bio,
                    status, create_user, update_user, vendor_commission_amount, vendor_commission_type,
                    need_update_pw, role_id, deleted_at, remember_token, created_at, updated_at,
                    payment_gateway, total_guests, locale, user_name, verify_submit_status, is_verified,
                    active_status, dark_mode, messenger_color, stripe_customer_id, total_before_fees
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            const values = [
                data.name, data.first_name, data.last_name, data.business_name, data.email,
                data.email_verified_at, hash, data.two_factor_secret, data.two_factor_recovery_codes,
                data.address, data.address2, data.phone, data.birthday, data.city, data.state,
                data.country, data.zip_code, data.last_login_at, data.avatar_id, data.bio,
                data.status, data.create_user, data.update_user, data.vendor_commission_amount,
                data.vendor_commission_type, data.need_update_pw, data.role_id, data.deleted_at,
                data.remember_token, data.created_at, data.updated_at, data.payment_gateway,
                data.total_guests, data.locale, data.user_name, data.verify_submit_status,
                data.is_verified, data.active_status, data.dark_mode, data.messenger_color,
                data.stripe_customer_id, data.total_before_fees
            ];

            pool.query(query, values, (error, results, fields) => {
                if (error) {
                    winston.error('Error creating user:', error);
                    return callBack(error);
                }
                return callBack(null, results);
            });
        });
    },
    getUsers: callBack => {
        pool.query(
            `SELECT * FROM users`,
            [],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    getUserById: (id, callBack) => {
        pool.query(
            `SELECT * FROM users WHERE id = ?`,
            [id],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results[0]);
            }
        );
    }

};
