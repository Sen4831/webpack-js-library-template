'use strict';

class FinanceChart {
    constructor(element, options) {
        this.element = element;
        options = this.options;
    }

    run() {
        console.log('Runned');
        
    }
}

export default FinanceChart;
window.FinanceChart = FinanceChart;
