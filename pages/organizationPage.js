
var OrganizationPage = function() {


    this.generalInformationTitle = element(by.id("genInfoHeading"));
    this.organizationNameTextbox = element(by.id("organization_name"));
    this.taxIdTextbox = element(by.id("organization_taxId"));
    this.registrationNumber = element(by.id("organization_registraionNumber"));
    this.faxNumber = element(by.id("organization_fax"));
    this.editButton = element(by.id("btnSaveGenInfo"));

    this.validateHeading = function(){
        expect(this.generalInformationTitle.getText()).toEqual("General Information");
    }

    this.clickEditandSaveButton = function(){
        this.editButton.click();
    }

    this.fillOrganizationName = function(organizationName){
        expect(this.organizationNameTextbox.isEnabled()).toBe(true);
        this.organizationNameTextbox.clear().sendKeys(organizationName);
    }


    this.filltaxId = function(taxId){
        expect(this.taxIdTextbox.isEnabled()).toBe(true);
        this.taxIdTextbox.clear().sendKeys(taxId);
    }

    this.fillregistrationNumber = function(registrationNo){
        expect(this.registrationNumber.isEnabled()).toBe(true);
        this.registrationNumber.clear().sendKeys(registrationNo);
    }

    this.fillfaxNumber = function(faxNo){
        expect(this.faxNumber.isEnabled()).toBe(true);
        this.faxNumber.sendKeys(faxNo);
    }




};
	
module.exports = OrganizationPage