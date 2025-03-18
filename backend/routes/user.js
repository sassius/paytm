const express = require("express");
const {User} = require("../db")
const zod = require("zod");
const jwt = require("jsonwebtoken");;
const {authMiddleware} = require("../middlewares/middleware")
const router = express.Router();

const signupSchema = zod.object({
    userName : zod.string().email(),
    password : zod.string(),
    firstName : zod.string(),
    lastName : zod.string()
})
const signinSchema = zod.object({
    userName : zod.string().email(),
    password : zod.string()
})
const updatebody = zod.object({
  password: zod.string().optional(),
  firstName: zod.string().optional(),
  lastName: zod.string().optional(),
});
router.post("/signup",async (req,res)=>{
    const body = req.body;
    const {success} = signupSchema.safeParse(body);

    if (!success){
        return res.status(411).json({
          message: "Email already taken / Incorrect inputs",
        });
    }

    const existingUser = await User.findOne({
        userName:body.userName,
    })
    if (existingUser){
        return res.status(400).json({
          message: "Email already taken / Incorrect inputs",
        });
    }

    const user = await User.create({
        userName : body.userName,
        password : body.password,
        firstName : body.firstName,
        lastName : body.lastName
    })
    const userid= user._id;
    const token = jwt.sign({userid},process.env.JWT_SECRET)
    res.status(200).json({
      message: "User created successfully",
      token : token
    });
})

router.post("/signin",async (req,res)=>{
    const body = req.body;
    const {success} = signinSchema.safeParse(body);
    if (!success){
        return res.status(411).json({
          message: "Error while logging in",
        });
    }
    const user = await User.findOne({
        userName:body.userName,
        password:body.password
    })
    if (user){
        const token = jwt.sign({
            userid : user._id
        },process.env.JWT_SECRET)
        return res.status(200).json({
            token:token
        })
    }
    res.status(411).json({
       message: "Error while logging in",
    });
})

router.put("/",authMiddleware,async(req,res)=>{
    const {success} = updatebody.safeParse(req.body)
    if(!success){
        res.status(411).json({
          message: "Error while updating information",
        });
    }

    await User.updateOne({
        _id:req.userid
    },req.updatebody)

    res.status(200).json({
      message: "Updated successfully",
    });
})  

router.get("/bulk",async (req,res)=>{
    const filter = req.query.filter||"";

    const users = await User.find({
        $or:[{
            firstName:{
                "$regex":filter
            },
            lastName:{
                "$regex" : filter
            }
        }]
    })

    res.json({
      user: users.map((user) => ({
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        _id: user._id,
      })),
    });

})
module.exports = {
    router
}