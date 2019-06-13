

var DashboardPage = function() {

            this.employeeDistributionGraph = element(by.id("div_graph_display_emp_distribution"));
            
            this.mouseOver = function(){
                browser.actions().mouseMove(this.employeeDistributionGraph).perform();
            }
  };
  module.exports = DashboardPage