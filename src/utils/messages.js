const generateMessage = (message, username = "admin") => {
  return {
    message,
    createdAt: new Date().getTime(),
    username,
  };
};

const generateLocationMessage = (url, username) => {
  return {
    url,
    createdAt: new Date().getTime(),
    username,
  };
};

module.exports = {
  generateMessage,
  generateLocationMessage,
};
