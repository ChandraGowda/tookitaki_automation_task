

var LoginPage = function() {

			this.usernameTextbox = element(by.id("txtUsername"));
			this.passwordTextbox = element(by.id("txtPassword"));
			this.loginButton = element(by.id("btnLogin"));

			
			this.get = function() {
				browser.get('https://opensource-demo.orangehrmlive.com/');
			};


			this.login = function(userName, password){
				this.usernameTextbox.sendKeys(userName);
				this.passwordTextbox.sendKeys(password);
				this.loginButton.click();
				return require('./homePage.js');
			}
  };
  module.exports = LoginPage