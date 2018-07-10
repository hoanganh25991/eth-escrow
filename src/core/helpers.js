const log = (...args) => {
  if(process.env.NODE_ENV === 'dev'){
    console.log(...args);
  }
};

module.exports = {
  log
};