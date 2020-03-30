require("dotenv").config();
// set runtime environment as'development' or 'production'
const env = process.env.NODE_ENV; 

// OpenID provider url, clientID and Secret
const accountURL = process.env.account_url;
const clientId = process.env.client_id;
const clientSecret = process.env.client_secret;

// Message queue host, username and password
const mqHost = process.env.MQ_HOST;
const mqUser = process.env.MQ_USER;
const mqPass = process.env.MQ_PASS;

// Email username and password
const userMail = process.env.userMail;
const passMail = process.env.passMail;
const hostMail = process.env.hostMail;
const portMail = process.env.portMail;

// Prisma host
const prismaHost = process.env.PRISMA_HOST;

const development = {
 app: {
   port: 4000,
   multicore: false,
   tracing: true
 },
 prisma: {
     host: prismaHost,
     debug: true
 },
 rabbitMQ:{
   host:mqHost,
   user: mqUser,
   password: mqPass
 },
 openId:{
   url:accountURL,
   id:clientId,
   secret:clientSecret
 },
 email:{
   email:userMail,
   password:passMail,
   host:hostMail,
   port:portMail
 }
};

const production = {
 app: {
   port: 4000,
   multicore: true,
   tracing: false
 },
 prisma: {
     host: prismaHost,
     debug: false
 },
rabbitMQ:{
  host: mqHost,
  user: mqUser,
  password: mqPass
},
openId:{
  url:accountURL,
  id:clientId,
  secret:clientSecret
},
email:{
  email:userMail,
  password:passMail,
  host:hostMail,
  port:portMail
}
};

const config = {
 development,
 production
};

module.exports = config[env];
