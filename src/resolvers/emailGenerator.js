const nodemailer = require('nodemailer')
var config = require('../config')

module.exports = {
  async sendEmail (user) {
    var mailer = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      auth: {
        user: "stephtesting4104@gmail.com",
        pass: "!Password1"
      }
    })

    var mailOptions = {
      to: user.email.to,
      from: user.email.from,
      subject: user.email.subject,
      html: user.email.body
    }
       // return mailer.sendMail(mailOptions)
       mailer.sendMail(mailOptions, function (err) {
         console.log('err '+err)
        if (err) {
          console.log("err")
          return err
        } else {
          console.log("send")
          return 'Mail sent to: ' + email
        }
    });
  }
}
