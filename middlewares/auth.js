const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// middleware to check if the user is authenticated to sell/buy
const isAuthenticated = async (req,res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if(!authHeader) {
            return res.status(401).json({err: "authorization header not found"})
        }

        const token = authHeader.split(" ")[1];  // This is the bearer token
        if(!token) {
            return res.status(401).json({err: "token not found"});
        }

        const decoded = jwt.verify(token, "SECRET MESSAGE");

        const user = await User.findOne({where: {id: decoded.user.id}});
        if(!user) {
            return res.status(404).json({err: "user not found"})
        }

        req.user = user.dataValues;
        next()

    } catch (e) {
        return res.status(500).send(e);
    }
}

// middleware to check if the user is a seller
const isSeller = (req,res,next) => {
    if(req.user.isSeller) {
        next();
    } else {
        return res.status(401).json({err: "You are not a seller"})
    }
}

// middleware to check if the user is a buyer
const isBuyer = (req,res,next) => {
    if(!req.user.isSeller) {
        next();
    } else {
        return res.status(401).json({err: "You are not a Buyer"})
    }
}

module.exports = {isAuthenticated, isSeller, isBuyer};