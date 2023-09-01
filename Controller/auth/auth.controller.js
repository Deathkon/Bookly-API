const db = require("../../config/server");
const bcrypt = require("bcrypt");
const createError = require("http-errors");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const speakeasy = require("speakeasy");
const crypto = require("crypto");

// Create a transporter using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: "mail.bookly.africa",
  port: 465,
  secure: true,
  auth: {
    user: "noreply@bookly.africa",
    pass: "9o@&favthI~B",
  },
});
//test transport connection configuration
transporter.verify(function (error, success) {
    if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take our messages");
  }
}
);
// Registration Section+
exports.register = async function (req, res) {
  const { first_name, last_name, phone, email, password } = req.body;
  let conn;
  try {
    conn = await db.getConnection();
    if (!conn) {
      return res.status(500).json({
        success: 0,
        message: 'Database connection error',
      });
    }
    await conn.beginTransaction();
    const [rows] = await conn.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length > 0) {
      await conn.rollback();
      return res.status(400).json({
        success: 0,
        message: 'Email already exists',
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      first_name,
      last_name,
      phone,
      email,
      password: hashedPassword,
      created_at: new Date(),
    };
    const result = await conn.query('INSERT INTO users SET ?', user);
    const userId = result.insertId;
    const token = jwt.sign({ id: userId }, 'secret', { expiresIn: '1h' });
    await conn.commit();
    return res.status(200).json({
      success: 1,
      message: 'User registered successfully',
      token,
    });
  } catch (error) {
    if (conn) {
      await conn.rollback();
      conn.release();
    }
    console.log(error);
    return res.status(500).json({
      success: 0,
      message: 'Database connection error',
    });
  } finally {
    if (conn) {
      conn.release();
    }
  }
};
exports.verify = async function (req, res) {
  const { email, otp } = req.body;
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const [rows] = await conn.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      await conn.rollback();
      return res.status(400).json({
        success: 0,
        message: 'User not found',
      });
    }
    const user_id = rows[0].id;
    const [otpRows] = await conn.query('SELECT * FROM users WHERE user_id = ? AND otp = ?', [user_id, otp]);
    if (otpRows.length === 0) {
      await conn.rollback();
      return res.status(400).json({
        success: 0,
        message: 'Invalid OTP',
      });
    }
    await conn.query('DELETE FROM users WHERE user_id = ? AND otp = ?', [user_id, otp]);
    await conn.commit();
    return res.status(200).json({
      success: 1,
      message: 'OTP verified successfully',
    });
  } catch (error) {
    await conn.rollback();
    console.log(error);
    return res.status(500).json({
      success: 0,
      message: 'Database connection error',
    });
  } finally {
    conn.release();
  }
};
exports.login = async function (req, res) {
  const { email, password } = req.body;
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const [rows] = await conn.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      await conn.rollback();
      return res.status(400).json({
        success: 0,
        message: 'Invalid email or password',
      });
    }
    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      await conn.rollback();
      return res.status(400).json({
        success: 0,
        message: 'Invalid email or password',
      });
    }
    const token = jwt.sign({ id: user.id }, 'secret', { expiresIn: '1h' });
    await conn.query('UPDATE users SET remember_token = ?, last_login_at = NOW() WHERE id = ?', [token, user.id]);
    await conn.commit();
    return res.status(200).json({
      success: 1,
      message: 'Logged in successfully',
      token,
    });
  } catch (error) {
    await conn.rollback();
    console.log(error);
    return res.status(500).json({
      success: 0,
      message: 'Database connection error',
    });
  } finally {
    conn.release();
  }
};
exports.forgotPassword = async function (req, res) {
  const { email } = req.body;
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const [rows] = await conn.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      await conn.rollback();
      return res.status(400).json({
        success: 0,

        message: 'User not found',
      });
    }
    const user = rows[0];
    const otp = speakeasy.totp({
      secret: user.password,
      encoding: 'base32',
    });
    await conn.query('UPDATE users SET otp = ? WHERE id = ?', [otp, user.id]);
    await conn.commit();
    const mailOptions = {
      from: transporter.options.auth.user,
      to: email,
      subject: 'Forgot Password',
      text: `Your OTP is ${otp}`,
    };
    await transporter.sendMail(mailOptions);
    return res.status(200).json({
      success: 1,
      message: 'OTP sent successfully',
    });
  } catch (error) {
    await conn.rollback();
    console.log(error);
    return res.status(500).json({
      success: 0,
      message: 'Database connection error',
    });
  } finally {
    conn.release();
  }
};

exports.protectedRoute = async function (req, res) {
  const token = req.headers.authorization.split(' ')[1];
  try {
    const decoded = jwt.verify(token, "PROCESS.env.JWT_SECRET");
    const userId = decoded.id;
    // Do something with the user ID
    return res.status(200).json({
      success: 1,
      message: 'Protected route accessed successfully',
    });
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      success: 0,
      message: 'Unauthorized',
    });
  }
};
