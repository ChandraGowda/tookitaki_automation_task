var pimPage = require('../pages/pimPage.js');
var loginPage = require('../pages/loginPage.js');
var homePage = require('../pages/homePage.js');
const testData = require('../testData/testdata.json');

describe('Navigate to Admin tab and check General info', function() {
  beforeEach(function() {
    browser.ignoreSynchronization = true;
    browser.waitForAngular();
  });

  
  var PimPage = new pimPage();
  var LoginPage = new loginPage();
  var HomePage = new homePage();
  

  xit('should navigate to Orange HRM page and login', function() {
    LoginPage.get(); 
    LoginPage.login(testData.userName, testData.password);
  });

  it('should navigate to Admin Tab and Add New Employee', function(){
    HomePage.clickPimTab();
    PimPage.addEmployee(testData.firstName, testData.lastName, testData.employeeId);
    
  });

});