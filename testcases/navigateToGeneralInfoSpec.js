var adminPage = require('../pages/adminPage.js');
var organizationPage = require('../pages/organizationPage.js');
var loginPage = require('../pages/loginPage.js');
var homePage = require('../pages/homePage.js');
const testData = require('../testData/testdata.json');

describe('Navigate to Admin tab and check General info', function() {
  beforeEach(function() {
    browser.ignoreSynchronization = true;
    browser.waitForAngular();
  });

  var OrganizationPage = new organizationPage();
  var AdminPage = new adminPage();
  var LoginPage = new loginPage();
  var HomePage = new homePage();
  

  xit('should navigate to Orange HRM page and login', function() {
    LoginPage.get(); 
    LoginPage.login(testData.userName, testData.password);
  });

  it('should navigate to General Information page under Admin tab', function(){
    HomePage.clickAdminTab();
    AdminPage.clickGeneralInformationOption();
    OrganizationPage.validateHeading();
    
  });

});