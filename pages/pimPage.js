

var PimPage = function() {

			this.addEmployeeButton = element(by.id("menu_pim_addEmployee"));
            this.firstNameTextbox = element(by.id("firstName"));
            this.middleNameTextbox = element(by.id("middleName"));
            this.lastNameTextbox = element(by.id("lastName"));
            this.employeeIdTextbox = element(by.id("employeeId"));
            this.chooseFileButton = element(by.id("photofile"));
            this.saveButton = element(by.id("btnSave"));
            this.personalDetailsTitle = element(by.xpath("//div[@class='personalDetails']/div/h1"));


			this.addEmployee = function(firstName, lastName, empId){
                this.addEmployeeButton.click();
                this.firstNameTextbox.sendKeys(firstName);
                this.lastNameTextbox.sendKeys(lastName);
                this.employeeIdTextbox.sendKeys(empId);
                this.chooseFileButton.sendKeys("F:\\tookitaki_automation_task\\tookitaki_automation_task\\testData\\image.png");
                this.saveButton.click();
                expect(this.personalDetailsTitle.getText()).toEqual("Personal Details");
            }
  };
  module.exports = PimPage