
var library = require('../libraries/commonLibrary.js');
var HomePage = function() {
	

	this.welcomeText = element(by.id("welcome"));
	this.adminTab = element(by.id("menu_admin_viewAdminModule"));
	this.pimTab = element(by.id("menu_pim_viewPimModule"));
	this.dashboardTab = element(by.id("menu_dashboard_index"));


		this.validateHomePage = function(){
			expect(browser.driver.getCurrentUrl()).toMatch('/index.php/dashboard');
			expect(this.welcomeText.getText()).toContain("Welcome");
		}

		this.clickAdminTab = function(){
			this.adminTab.click();
			return require("./adminPage.js");
		}

		this.clickPimTab = function() {
			this.pimTab.click();
			return require("./pimPage.js");
		}

		this.clickDashboardTab = function() {
			this.dashboardTab.click();
			return require("./dashboardPage.js");
		}


		
		};
	
  module.exports = HomePage