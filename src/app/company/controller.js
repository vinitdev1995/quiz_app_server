require('dotenv').config();
const CompanyDetails = require("./modal");
const sgMail = require('@sendgrid/mail');

exports.create = async (req, res) =>{
    console.log("req", req.body);
     try {
         const { companyId, companyName } = req.body;
         let result = null;
         const isExists = await CompanyDetails.find({companyId, $or:[{companyName}]});
         if (isExists && isExists.length) {
             result = await CompanyDetails.updateOne({ companyName }, req.body);
         } else {
             result = await CompanyDetails.create(req.body);
         }
         res.status(200).send(result);
     }catch (e) {
         console.log(e);
         res.status(400);
     }
};

exports.getCompanyProfileById = async (req, res) =>{
    try {
        const id = req.params.id;
        const companyRecord = await CompanyDetails.findOne({companyId: id});
        res.status(200).send(companyRecord);
    } catch (e) {
        res.status(400);
    }
};

exports.getCompanyProfileByName = async (req, res) =>{
    try {
        const name = req.params.name;
        const companyRecord = await CompanyDetails.findOne({ companyName: { "$regex": name, "$options": "i" } });
        res.status(200).send(companyRecord || {});
    } catch (e) {
        res.status(400);
    }
};

exports.updateCompanyProfileByName = async (req, res) =>{
    try {
        const name = req.params.name;
        const companyRecord = await CompanyDetails.updateOne({ companyName: name }, req.body);
        res.status(200).send(companyRecord);
    } catch (e) {
        res.status(400);
    }
};

exports.sendMail = async (req, res) =>{
    try{
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        const msg = {
            to: `${req.body.candidateEmail}`,
            from: 'team@knowledgelocker.com',
            subject: `${req.body.messageSubject}`,
            html: `<strong>${req.body.messageBody}</strong>`,
        };
        const mailRes = await sgMail.send(msg);
        res.status(200).send({ message: "successfully send mail", mailRes})
    } catch (e) {
        console.log("error ---->", e);
    }
};