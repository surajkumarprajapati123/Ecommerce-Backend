const nodemailer = require('nodemailer')

const sendEmail = async(options)=>
{
     const transporter = nodemailer.createTransport({
        service:process.env.SMPT_SERVICE,
        host: process.env.SMPT_HOST,
         port: process.env.MAIL_PORT,
        auth:{
            user: process.env.SMPT_MAIL,
            pass:process.env.SMPT_PASSWORD
        }
     })

     const mailoption = {
        from: process.env.SMPT_MAIL,
        to:options.email,
        subject:options.subject,
        text:options.message
     }
    await  transporter.sendMail(mailoption)
}

module.exports = sendEmail