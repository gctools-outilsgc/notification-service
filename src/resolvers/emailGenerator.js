const nodemailer = require('nodemailer')
var config = require('../config')

module.exports = {
  async sendEmail (user) {
    
    var mailer = nodemailer.createTransport({
      service: config.email.service,
      host: config.email.host,
      auth: {
        user: config.email.email,
        pass: config.email.password
      }
    })

    var mailOptions = {
      to: user.email.to,
      from: user.email.from,
      subject: user.email.subject,
      html: user.email.body
    }

    await  mailer.sendMail(mailOptions).then(function(info){
        result =  true  
    }).catch(function(err){
        console.log('Email not send! Error: '+err);
        result = false
    });
  return result
  }
}
