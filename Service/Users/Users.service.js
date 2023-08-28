const pool = require("../../config/server");
const bcrypt = require('bcrypt');
const winston = require('winston');

module.exports = {
    create: (data, callBack) => {
        bcrypt.hash(data.password, 10, (hashErr, hash) => {
            if (hashErr) {
                return callBack(hashErr);
            }

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
                hash,
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

            pool.query(query, values, (error, results, fields) => {
                if (error) {
                    winston.error("Error creating user:", error);
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
    },
    updateUser: (data, callBack) => {
        pool.getConnection((err, conn) => {
          if (err) {
            return callBack(err);
          }

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

          conn.query(query, values, (error, results, fields) => {
            conn.release();
            if (error) {
              return callBack(error);
            }
            return callBack(null, results);
          });
        });
      },
    deleteUser: (data, callBack) => {
        pool.query(
            `DELETE FROM users WHERE id = ?`,
            [data.id],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    }
};
