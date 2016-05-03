// Portal NS configuration

var host;

if(process.env.APP_NAME){
  host = "https://"+process.env.APP_NAME+".herokuapp.com";
}else{
  host = "https://dev-portal-ns.herokuapp.com";
}

token = process.env.TOKEN || '1B724F94C3EDC1DA6FD7294D1C611';

var config = {
  host: host,
  token: token
};

module.exports = config;
