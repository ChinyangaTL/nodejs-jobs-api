const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../errors');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
const registerOld = async (req, res) => {
  // const { name, email, password } = req.body;
  // if (!name || !email || !password) {
  //   throw new BadRequestError('Please provide name, email and password');
  // } // will still work because of mongoose validators
  // moved to User Schema to make this cleaner
  // const { name, email, password } = req.body;
  // const salt = await bcrypt.genSalt(10);
  // const hashedPassword = await bcrypt.hash(password, salt);
  // const tempUser = { name, email, password: hashedPassword };
  // const user = await User.create({ ...tempUser });
  // res.status(StatusCodes.CREATED).json({ user });
};

const register = async (req, res) => {
  const user = await User.create({ ...req.body });
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError('Please provide email and password');
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError('Invalid credentials');
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Invalid credentials');
  }

  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};

const users = async (req, res) => {
  const users = await User.find({});
  res.status(200).json({ users });
};

module.exports = { register, login, users };
