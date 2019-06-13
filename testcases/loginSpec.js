
var loginPage = require('../pages/loginPage.js');
var homePage = require('../pages/homePage.js');
const testData = require('../testData/testdata.json');

describe('Login with user and Validate Weclome text', function() {
  beforeEach(function() {
    browser.ignoreSynchronization = true;
    browser.waitForAngular();
  });

  var LoginPage = new loginPage();
  var HomePage = new homePage();

  it('should navigate to Orange HRM page', function() {
    LoginPage.get();  
  });

  it('should login using username and password', function(){

    LoginPage.login(testData.userName, testData.password);
    HomePage.validateHomePage();
  });

});