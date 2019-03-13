const nodemailer = require("nodemailer");
var config = require("../config");

module.exports = {
  async sendEmail (user) {
    
    var mailer = nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      auth: {
        user: config.email.email,
        pass: config.email.password
      }
    });

    var mailOptions = {
      to: user.email.to,
      from: user.email.from,
      subject: user.email.subject,
      html: user.email.body
    };

    return await mailer.sendMail(mailOptions).then(function(){
        return false;  
    }).catch(function(err){
        console.error("[Email Generator Error] - "+ err);
        return true;
    });
  }
};
