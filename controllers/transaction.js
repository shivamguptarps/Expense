const moment = require("moment");
const Transaction = require("../models/transaction");

const getAllTransaction = async(req,res)=>{
    try{

        const {freq,type} = req.body;
        const {selectedDate}=req.body;
        // const trans = await Transaction.find({
        //     userid : req.body.userid,
        //     ...(
        //         freq!=='custom' ? {date :{
        //         $gt : moment().subtract(Number(freq),'d').toDate(),
        //     }} : freq!=='all' ? 
        //     {
        //         date : {
        //             $gte : selectedDate[0],
        //             $lte : selectedDate[1],
        //         },
        //     } :''

            
           
        // )
        // });

        const query = {
            userid: req.body.userid,
            ...(type !=="all" && {type})
        };
        
        if (freq !== 'custom' && freq!='all') {
            query.date = {
                $gt: moment().subtract(Number(freq), 'd').toDate()
            };
        } else if (freq !== 'all') {
            query.date = {
                $gte: selectedDate[0],
                $lte: selectedDate[1]
            };
        } else {
            // Handle the case where freq is 'all'
            // You might want to handle this case differently or leave it empty
            // depending on your requirements.
        }
        
        const trans = await Transaction.find(query);
        
        res.status(200).json(trans);
    }
    catch(err){
        console.log(err);
        res.status(500).json(err);
    }
}

const editTransaction = async(req,res)=>{
    try {
        let txn= await Transaction.findOneAndUpdate({
            _id :req.body.txnId,
        },req.body.payload);
        res.status(200).send("Edit Succeed");
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

const addTransaction = async(req,res)=>{
    try{
        const newTran=new Transaction(req.body);
        await newTran.save();
        res.status(201).send("Transaction succssefully created");
    }
    catch(err){
        console.log(err);
        res.status(500).json(err);
    }
}

const deleteTransaction = async(req,res)=>{
    try {

        await Transaction.findByIdAndDelete(req.body.txnId);
        res.status(200).send("deletion succeed");
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

module.exports={getAllTransaction,addTransaction,editTransaction,deleteTransaction};