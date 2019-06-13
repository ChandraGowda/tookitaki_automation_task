'use strict';

var Library = function() {
    

    this.selectDropDownByValue = function(optionValue) {
		element(by.cssContainingText('option', optionValue)).click(); //optionValue: dropDownOption
	};
}

module.exports = Library