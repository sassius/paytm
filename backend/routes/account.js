const express = require("express");
const { Account} = require("../db");
const { authMiddleware } = require("../middlewares/middleware");
const { default: mongoose } = require("mongoose");
const router = express.Router();

router.get("/balance",async(req,res)=>{
    const account = await Account.findOne({
        userid:req.userid,
    })
    res.json({
      balance: account.balance,
    });
})

router.post("/transfer",authMiddleware,async(req,res)=>{
    const session = await mongoose.startSession();
    session.startTransaction();

    const {amount , to } = req.body;
    const account = await Account.findOne({
        userId:req.userid,
    }).session(session);

    if(!account || account.balance<amount){
        await session.abortTransaction();
        return res.status(400).json({
          message: "Insufficient balance",
        });
    }

    const toAccount = await Account.findOne({
        userId : to 
    }).session(session)

    if (!toAccount){
        session.abortTransaction();
        return res.status(400).json({
            message:"Invalid Account"
        })  
    }
    await Account.updateOne({userId:req.userId},{$inc:{balance:-amount}}).session(session);
    await Account.updateOne({userId:to},{$inc:{balance:amount}}).session(session);

    await session.commitTransaction();
    res.json({
        msg:"Transfer Succesful"
    })
})
module.exports ={ 
    router
}