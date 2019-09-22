const deparaObjetos = (arg, model) => {
    for (let key in arg) {
      if (arg.hasOwnProperty(key)) {
        if (arg[key] != undefined && arg[key] != null) model[key] = arg[key];
      }
    }
    return model;
  };
  
  function parseJwt(token) {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const buff = new Buffer(base64, "base64");
    const payloadinit = buff.toString("ascii");
    const payload = JSON.parse(payloadinit);
    return payload;
  }
  
  module.exports = { deparaObjetos, parseJwt };
  