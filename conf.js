// conf.js


const HtmlReporter = require('protractor-beautiful-reporter'); // For generating reports


exports.config = {
    directConnect: true,
    allScriptsTimeout: 60000,
    getPageTimeout: 60000,
    // ng2 related configurations
    useAllAngulr2AppRoots: true,
    framework: 'jasmine2',
   

    //testcase to be executed
    specs: ['./testcases/loginSpec.js','./testcases/navigateToGeneralInfoSpec,js','./testcases/addNewEmployeeSpec.js','./testcases/editDetailsSpec.js','./testcases/mouseOverSpec.js'],

    rootElement: '*[ng-app]',
    
    //browser related configurations
    onPrepare: function() {
        browser.manage().timeouts().implicitlyWait(9000);
        browser.driver.manage().window().maximize();
        global.EC = protractor.ExpectedConditions;
        
		
		jasmine.getEnv().addReporter(new HtmlReporter({
			baseDirectory: 'reports/'
        }).getJasmine2Reporter());
    },
	
    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 200000
    },
    
    capabilities: {
        browserName: 'chrome',
        nativeEvents:false,
		acceptInsecureCerts : true
	}
};