
var loginPage = require('../pages/loginPage.js');
var homePage = require('../pages/homePage.js');
var dashboardPage = require('../pages/dashboardPage.js');
const testData = require('../testData/testdata.json');

describe('Login with user and Validate Weclome text', function() {
  beforeEach(function() {
    browser.ignoreSynchronization = true;
    browser.waitForAngular();
  });

  var LoginPage = new loginPage();
  var HomePage = new homePage();
  var DashboardPage = new dashboardPage();

  xit('should navigate to Orange HRM page and login', function() {
    LoginPage.get();
    LoginPage.login(testData.userName, testData.password);
  });

  it('Should Navigate to Dashboard Tab', function(){
    HomePage.clickDashboardTab(); 
    
  });

  it('Should mouse hover on Employee Distribution Subunit Graph', function(){

    DashboardPage.mouseOver();
  });

});