

var AdminPage = function() {

    this.organizationMenu = element(by.id("menu_admin_Organization"));
	this.generalInformationOption = element(by.id("menu_admin_viewOrganizationGeneralInformation"));

        this.clickOrganizationMenu = function(){
            this.organizationMenu.click();
        }

        this.clickGeneralInformationOption = function(){
            browser.actions().mouseMove(this.organizationMenu).perform();
            browser.wait(EC.presenceOf(this.generalInformationOption), 5000);
            this.generalInformationOption.click();
            return require('./organizationPage.js');
        }
			
  };
  module.exports = AdminPage