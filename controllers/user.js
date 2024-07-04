const User = require("../models/user");
const bcrypt = require("bcryptjs");


const loginController = async (req,res)=>{
    try{
        const {email,password} = req.body;
        const user = await User.findOne({email});

        if(!user){
            return res.status(400).json('Not Registered yet');
        }
        const passCompare= await bcrypt.compare(password,user.password);
        if(!passCompare){
            return res.status(400).json('Please try to login with correct credentials');
        }


        res.status(200).json(user);
    }
    catch(err){
        res.status(400).json({
            success:false,
            err,
        })
    }
};


const registerController = async (req,res)=>{
    console.log(req.body);
    try{
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ error: "Sorry a user with this email already exists" })
        }
        const salt=await bcrypt.genSalt(10);
        if(req.body.password==="" || req.body.name==="" || req.body.email==="") {
            return res.status(400).json({ error: "Field can not be empty" })
        }
        const secPass= await bcrypt.hash(req.body.password,salt);
        const newUser = new User({name : req.body.name,email:req.body.email,password:secPass});
        // console.log(newUser);
        await newUser.save();
        
        res.status(201).json({
            success:true,
            newUser,
        })
    }
    catch(error){
        res.status(400).json({
            success: false,
            error,
        })
    }
};

module.exports = {loginController,registerController}