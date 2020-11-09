function ConvertHandler() {

  const arr = ['gal', 'l', 'lbs', 'kg', 'mi', 'km']
  
  this.getNum = function (input) {
    var result = input.toLowerCase().match(/[a-z]+|[^a-z]+/gi);
    if (result.length > 2) { return 'invalid' }
    if (result.length == 1 && !arr.includes(result[0])) {return 'bad'}
    if ((arr.includes(result[0])) && result.length == 1) {
      return 1
    } else if (parseFloat(result[0]) == NaN) {
      return 'invalid'
    } else {
      return eval(result[0])
    }
  };

  this.getUnit = function (input) {
    var result = input.toLowerCase().match(/[a-z]+|[^a-z]+/gi);
    if (result.length > 2) { return 'invalid' }
    if (result.length == 2) {
      if (arr.includes(result[1])) {
        return result[1];
      }
    }
    if (result.length == 1) {
      if (arr.includes(result[0])) {
        return result[0];
      }
    }
    return 'invalid'
  };

  this.getReturnUnit = function (initUnit) {
    if (initUnit === 'gal') {
      return 'l'
    } else if (initUnit === 'lbs') {
      return 'kg'
    } else if (initUnit === 'mi') {
      return 'km'
    } else if (initUnit === 'l') {
      return 'gal'
    } else if (initUnit === 'kg') {
      return 'lbs'
    } else if (initUnit === 'km') {
      return 'mi'
    } else {
      return 'invalid'
    }
  };

  this.spellOutUnit = function (unit) {
    var result;

    return result;
  };

  function humanize(value) {
    return parseFloat(value.toFixed(5).replace(/\.?0*$/, ''));
  };

  this.convert = function (initNum, initUnit) {
    const galToL = 3.78541;
    const lbsToKg = 0.453592;
    const miToKm = 1.60934;
    if (initUnit === 'gal') {
      return humanize(initNum * galToL);
    } else if (initUnit === 'lbs') {
      return humanize(initNum * lbsToKg);
    } else if (initUnit === 'mi') {
      return humanize(initNum * miToKm);
    } else if (initUnit === 'l') {
      return humanize(initNum / galToL);
    } else if (initUnit === 'kg') {
      return humanize(initNum / lbsToKg);
    } else if (initUnit === 'km') {
      return humanize(initNum / miToKm);
    } else {
      return 'invalid'
    }
  };

  this.getString = function (initNum, initUnit, returnNum, returnUnit) {
    if (initUnit === 'gal') {
      return `${initNum} gallons converts to ${returnNum} liters`;
    } else if (initUnit === 'lbs') {
      return `${initNum} pounds converts to ${returnNum} kilograms`;
    } else if (initUnit === 'mi') {
      return `${initNum} miles converts to ${returnNum} kilometers`;
    } else if (initUnit === 'l') {
      return `${initNum} liters converts to ${returnNum} gallons`;
    } else if (initUnit === 'kg') {
      return `${initNum} kilograms converts to ${returnNum} pounds`;
    } else if (initUnit === 'km') {
      return `${initNum} kilometers converts to ${returnNum} miles`;
    } else {
      return 'invalid'
    }
  };

}

module.exports = ConvertHandler;
