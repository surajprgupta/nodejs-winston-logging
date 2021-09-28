const logger = require('./logger');

const logRequestMeta = (req, response) => {
  const {url, body = {}, headers = {}, params = {}, query = {}} = req;
  let logObject = {
    url,
    body,
    headers,
    params,
    query,
    response,
  };
  logger.info(logObject);
};

const logResponse = (req, res, next) => {
  let originalSend = res.send;
  let chunks = [];
  res.send = function(chunk) {
    let response, body;
    if (chunk) {
      chunks.push(Buffer.from(JSON.stringify(chunk)));
    }
    try {
      body = Buffer.concat(chunks).toString('utf8');
    } catch (err) {
      logger.error(err);
    }
    try {
      response = JSON.parse(body);
    } catch (err) {
      response = String(body);
    }
    logRequestMeta(req, response);
    originalSend.apply(res, arguments);
  };
  next();
};

module.exports = logResponse;
