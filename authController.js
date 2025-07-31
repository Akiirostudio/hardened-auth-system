const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const auditLogger = require('../utils/auditLogger');

const users = new Map(); // Replace with DB in real use

exports.register = async (req, res) => {
    const { username, password } = req.body;
    const hashed = await bcrypt.hash(password, 12);
    users.set(username, hashed);
    auditLogger('register', username, req.ip);
    res.status(201).json({ message: 'User registered securely' });
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    const hashed = users.get(username);
    if (!hashed || !(await bcrypt.compare(password, hashed))) {
        auditLogger('login-fail', username, req.ip);
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '15m' });
    auditLogger('login-success', username, req.ip);
    res.json({ token });
};
