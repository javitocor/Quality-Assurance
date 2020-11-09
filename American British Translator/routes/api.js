'use strict';

const Translator = require('../components/translator.js');

module.exports = function (app) {
  
  const translator = new Translator();

  app.route('/api/translate')
    .post((req, res) => {
      const value = req.body.text;
      const translation = req.body.locale;
      const solution = translator.translate(value, translation);
      res.send(solution);
    });
};
