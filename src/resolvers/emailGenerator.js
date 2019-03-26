const nodemailer = require("nodemailer");
var config = require("../config");

module.exports = {
  async sendEmail (user) {

    //catch if no email configuration has been entered
    if(!config.email.host || !config.email.port || !config.email.email || !config.email.password){
      var errorStatus = {
        status: true,
        msg: "No email configuration"
      };
      return errorStatus;
    }

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
        var errorStatus = {
          status: false
        };
        return errorStatus;
    }).catch(function(err){
        // eslint-disable-next-line no-console
        console.log("[Email Generator Error] - "+ err);
        var errorStatus = {
          status: true,
          msg: err
        };
        return errorStatus;
    });
  }
};
