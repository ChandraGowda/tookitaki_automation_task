var app = angular.module('reportingApp', []);

//<editor-fold desc="global helpers">

var isValueAnArray = function (val) {
    return Array.isArray(val);
};

var getSpec = function (str) {
    var describes = str.split('|');
    return describes[describes.length - 1];
};
var checkIfShouldDisplaySpecName = function (prevItem, item) {
    if (!prevItem) {
        item.displaySpecName = true;
    } else if (getSpec(item.description) !== getSpec(prevItem.description)) {
        item.displaySpecName = true;
    }
};

var getParent = function (str) {
    var arr = str.split('|');
    str = "";
    for (var i = arr.length - 2; i > 0; i--) {
        str += arr[i] + " > ";
    }
    return str.slice(0, -3);
};

var getShortDescription = function (str) {
    return str.split('|')[0];
};

var countLogMessages = function (item) {
    if ((!item.logWarnings || !item.logErrors) && item.browserLogs && item.browserLogs.length > 0) {
        item.logWarnings = 0;
        item.logErrors = 0;
        for (var logNumber = 0; logNumber < item.browserLogs.length; logNumber++) {
            var logEntry = item.browserLogs[logNumber];
            if (logEntry.level === 'SEVERE') {
                item.logErrors++;
            }
            if (logEntry.level === 'WARNING') {
                item.logWarnings++;
            }
        }
    }
};

var defaultSortFunction = function sortFunction(a, b) {
    if (a.sessionId < b.sessionId) {
        return -1;
    }
    else if (a.sessionId > b.sessionId) {
        return 1;
    }

    if (a.timestamp < b.timestamp) {
        return -1;
    }
    else if (a.timestamp > b.timestamp) {
        return 1;
    }

    return 0;
};


//</editor-fold>

app.controller('ScreenshotReportController', function ($scope, $http) {
    var that = this;
    var clientDefaults = {};

    $scope.searchSettings = Object.assign({
        description: '',
        allselected: true,
        passed: true,
        failed: true,
        pending: true,
        withLog: true
    }, clientDefaults.searchSettings || {}); // enable customisation of search settings on first page hit

    var initialColumnSettings = clientDefaults.columnSettings; // enable customisation of visible columns on first page hit
    if (initialColumnSettings) {
        if (initialColumnSettings.displayTime !== undefined) {
            // initial settings have be inverted because the html bindings are inverted (e.g. !ctrl.displayTime)
            this.displayTime = !initialColumnSettings.displayTime;
        }
        if (initialColumnSettings.displayBrowser !== undefined) {
            this.displayBrowser = !initialColumnSettings.displayBrowser; // same as above
        }
        if (initialColumnSettings.displaySessionId !== undefined) {
            this.displaySessionId = !initialColumnSettings.displaySessionId; // same as above
        }
        if (initialColumnSettings.displayOS !== undefined) {
            this.displayOS = !initialColumnSettings.displayOS; // same as above
        }
        if (initialColumnSettings.inlineScreenshots !== undefined) {
            this.inlineScreenshots = initialColumnSettings.inlineScreenshots; // this setting does not have to be inverted
        } else {
            this.inlineScreenshots = false;
        }
    }

    this.showSmartStackTraceHighlight = true;

    this.chooseAllTypes = function () {
        var value = true;
        $scope.searchSettings.allselected = !$scope.searchSettings.allselected;
        if (!$scope.searchSettings.allselected) {
            value = false;
        }

        $scope.searchSettings.passed = value;
        $scope.searchSettings.failed = value;
        $scope.searchSettings.pending = value;
        $scope.searchSettings.withLog = value;
    };

    this.isValueAnArray = function (val) {
        return isValueAnArray(val);
    };

    this.getParent = function (str) {
        return getParent(str);
    };

    this.getSpec = function (str) {
        return getSpec(str);
    };

    this.getShortDescription = function (str) {
        return getShortDescription(str);
    };

    this.convertTimestamp = function (timestamp) {
        var d = new Date(timestamp),
            yyyy = d.getFullYear(),
            mm = ('0' + (d.getMonth() + 1)).slice(-2),
            dd = ('0' + d.getDate()).slice(-2),
            hh = d.getHours(),
            h = hh,
            min = ('0' + d.getMinutes()).slice(-2),
            ampm = 'AM',
            time;

        if (hh > 12) {
            h = hh - 12;
            ampm = 'PM';
        } else if (hh === 12) {
            h = 12;
            ampm = 'PM';
        } else if (hh === 0) {
            h = 12;
        }

        // ie: 2013-02-18, 8:35 AM
        time = yyyy + '-' + mm + '-' + dd + ', ' + h + ':' + min + ' ' + ampm;

        return time;
    };


    this.round = function (number, roundVal) {
        return (parseFloat(number) / 1000).toFixed(roundVal);
    };


    this.passCount = function () {
        var passCount = 0;
        for (var i in this.results) {
            var result = this.results[i];
            if (result.passed) {
                passCount++;
            }
        }
        return passCount;
    };


    this.pendingCount = function () {
        var pendingCount = 0;
        for (var i in this.results) {
            var result = this.results[i];
            if (result.pending) {
                pendingCount++;
            }
        }
        return pendingCount;
    };


    this.failCount = function () {
        var failCount = 0;
        for (var i in this.results) {
            var result = this.results[i];
            if (!result.passed && !result.pending) {
                failCount++;
            }
        }
        return failCount;
    };

    this.passPerc = function () {
        return (this.passCount() / this.totalCount()) * 100;
    };
    this.pendingPerc = function () {
        return (this.pendingCount() / this.totalCount()) * 100;
    };
    this.failPerc = function () {
        return (this.failCount() / this.totalCount()) * 100;
    };
    this.totalCount = function () {
        return this.passCount() + this.failCount() + this.pendingCount();
    };

    this.applySmartHighlight = function (line) {
        if (this.showSmartStackTraceHighlight) {
            if (line.indexOf('node_modules') > -1) {
                return 'greyout';
            }
            if (line.indexOf('  at ') === -1) {
                return '';
            }

            return 'highlight';
        }
        return true;
    };

    var results = [
    {
        "description": "should navigate to Orange HRM page|Login with user and Validate Weclome text",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "instanceId": 18324,
        "browser": {
            "name": "chrome",
            "version": "74.0.3729.169"
        },
        "message": "Passed",
        "browserLogs": [
            {
                "level": "WARNING",
                "message": "https://opensource-demo.orangehrmlive.com/ - [DOM] Found 2 elements with non-unique id #csrf_token: (More info: https://goo.gl/9p2vKq) %o %o",
                "timestamp": 1560441553997,
                "type": ""
            }
        ],
        "screenShotFile": "009d00fe-005f-009f-00e3-00b0009b0040.png",
        "timestamp": 1560441551092,
        "duration": 4132
    },
    {
        "description": "should login using username and password|Login with user and Validate Weclome text",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "instanceId": 18324,
        "browser": {
            "name": "chrome",
            "version": "74.0.3729.169"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "006e00ac-00d6-004f-0097-00400059002f.png",
        "timestamp": 1560441555735,
        "duration": 1967
    },
    {
        "description": "should navigate to Orange HRM page and login|Navigate to Admin tab and check General info",
        "passed": false,
        "pending": true,
        "os": "Windows NT",
        "instanceId": 18324,
        "browser": {
            "name": "chrome",
            "version": "74.0.3729.169"
        },
        "message": "Temporarily disabled with xit",
        "browserLogs": [
            {
                "level": "WARNING",
                "message": "https://opensource-demo.orangehrmlive.com/webres_5cfea87b4387f2.35910947/js/jquery/jquery-1.7.2.min.js 3 Synchronous XMLHttpRequest on the main thread is deprecated because of its detrimental effects to the end user's experience. For more help, check https://xhr.spec.whatwg.org/.",
                "timestamp": 1560441557912,
                "type": ""
            }
        ],
        "screenShotFile": "008a000a-00ed-00b3-0079-0061000a0011.png",
        "timestamp": 1560441559580,
        "duration": 0
    },
    {
        "description": "should navigate to Admin Tab and Add New Employee|Navigate to Admin tab and check General info",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "instanceId": 18324,
        "browser": {
            "name": "chrome",
            "version": "74.0.3729.169"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00ee00a4-00c9-0080-0009-001600640055.png",
        "timestamp": 1560441559589,
        "duration": 4592
    },
    {
        "description": "should navigate to Orange HRM page and login|Navigate to Admin tab and check General info",
        "passed": false,
        "pending": true,
        "os": "Windows NT",
        "instanceId": 18324,
        "browser": {
            "name": "chrome",
            "version": "74.0.3729.169"
        },
        "message": "Temporarily disabled with xit",
        "browserLogs": [],
        "screenShotFile": "004c00f2-00a0-00f0-0031-004100e8005e.png",
        "timestamp": 1560441564646,
        "duration": 0
    },
    {
        "description": "should navigate to General Information page under Admin tab|Navigate to Admin tab and check General info",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "instanceId": 18324,
        "browser": {
            "name": "chrome",
            "version": "74.0.3729.169"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "004a0085-0052-0042-00ac-007000d600d0.png",
        "timestamp": 1560441564658,
        "duration": 2510
    },
    {
        "description": "should navigate to General Information page and edit Details|Navigate to Admin tab and check General info",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "instanceId": 18324,
        "browser": {
            "name": "chrome",
            "version": "74.0.3729.169"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "009400cc-0088-00b0-000b-005c00da00fc.png",
        "timestamp": 1560441567686,
        "duration": 2014
    },
    {
        "description": "should navigate to Orange HRM page and login|Login with user and Validate Weclome text",
        "passed": false,
        "pending": true,
        "os": "Windows NT",
        "instanceId": 18324,
        "browser": {
            "name": "chrome",
            "version": "74.0.3729.169"
        },
        "message": "Temporarily disabled with xit",
        "browserLogs": [],
        "screenShotFile": "00a2002c-0012-000a-0058-004d009500c8.png",
        "timestamp": 1560441570225,
        "duration": 0
    },
    {
        "description": "Should Navigate to Dashboard Tab|Login with user and Validate Weclome text",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "instanceId": 18324,
        "browser": {
            "name": "chrome",
            "version": "74.0.3729.169"
        },
        "message": "Passed",
        "browserLogs": [],
        "screenShotFile": "003700f9-00a9-009a-003b-002f0077009e.png",
        "timestamp": 1560441570235,
        "duration": 531
    },
    {
        "description": "Should mouse hover on Employee Distribution Subunit Graph|Login with user and Validate Weclome text",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "instanceId": 18324,
        "browser": {
            "name": "chrome",
            "version": "74.0.3729.169"
        },
        "message": "Passed",
        "browserLogs": [
            {
                "level": "WARNING",
                "message": "https://opensource-demo.orangehrmlive.com/webres_5cfea87b4387f2.35910947/js/jquery/jquery-1.7.2.min.js 3 Synchronous XMLHttpRequest on the main thread is deprecated because of its detrimental effects to the end user's experience. For more help, check https://xhr.spec.whatwg.org/.",
                "timestamp": 1560441571279,
                "type": ""
            }
        ],
        "screenShotFile": "004300ff-0000-00c2-00ad-00e20096002d.png",
        "timestamp": 1560441573877,
        "duration": 58
    }
];

    this.sortSpecs = function () {
        this.results = results.sort(function sortFunction(a, b) {
    if (a.sessionId < b.sessionId) return -1;else if (a.sessionId > b.sessionId) return 1;

    if (a.timestamp < b.timestamp) return -1;else if (a.timestamp > b.timestamp) return 1;

    return 0;
});
    };

    this.loadResultsViaAjax = function () {

        $http({
            url: './combined.json',
            method: 'GET'
        }).then(function (response) {
                var data = null;
                if (response && response.data) {
                    if (typeof response.data === 'object') {
                        data = response.data;
                    } else if (response.data[0] === '"') { //detect super escaped file (from circular json)
                        data = CircularJSON.parse(response.data); //the file is escaped in a weird way (with circular json)
                    }
                    else
                    {
                        data = JSON.parse(response.data);
                    }
                }
                if (data) {
                    results = data;
                    that.sortSpecs();
                }
            },
            function (error) {
                console.error(error);
            });
    };


    if (clientDefaults.useAjax) {
        this.loadResultsViaAjax();
    } else {
        this.sortSpecs();
    }


});

app.filter('bySearchSettings', function () {
    return function (items, searchSettings) {
        var filtered = [];
        if (!items) {
            return filtered; // to avoid crashing in where results might be empty
        }
        var prevItem = null;

        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            item.displaySpecName = false;

            var isHit = false; //is set to true if any of the search criteria matched
            countLogMessages(item); // modifies item contents

            var hasLog = searchSettings.withLog && item.browserLogs && item.browserLogs.length > 0;
            if (searchSettings.description === '' ||
                (item.description && item.description.toLowerCase().indexOf(searchSettings.description.toLowerCase()) > -1)) {

                if (searchSettings.passed && item.passed || hasLog) {
                    isHit = true;
                } else if (searchSettings.failed && !item.passed && !item.pending || hasLog) {
                    isHit = true;
                } else if (searchSettings.pending && item.pending || hasLog) {
                    isHit = true;
                }
            }
            if (isHit) {
                checkIfShouldDisplaySpecName(prevItem, item);

                filtered.push(item);
                prevItem = item;
            }
        }

        return filtered;
    };
});

