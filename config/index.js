// Portal NS configuration

var host;

if(process.env.NODE_ENV == "production"){

  host = "https://"+process.env.APP_NAME+".herokuapp.com";
  token = process.env.TOKEN;

}else{

  host = "http://localhost:5000";
  token = '1B724F94C3EDC1DA6FD7294D1C611';

}

var config = {
  host: host,
  token: token
};

module.exports = config;
