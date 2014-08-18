//#!/usr/bin/node

//var Benchmarking = require ('../../sorting/Benchmarking.js');

function partition (p, r) {
    var that = this;
    var q = (function () {
        var x = that[r];
        var i =  p - 1;
        var temp;
        for (var j = p; j < r; j++) {
            if (that[j] <= x) {
                i++;
                temp = that[i]; 
                that[i] = that[j];
                that[j] = temp;
            }
        }
        temp = that[i + 1];
        that[i + 1] = x;
        that[r] = temp;
        return i + 1;
    }) ();
    return q;
}

function randomPartition (p, r) {
    var i = Math.floor (Math.random () * (r - p + 1)) + p
    var temp = this[i];
    this[i] = this[r];
    this[r] = temp;
    return partition.call (this, p, r);
}

Array.prototype.qsort = function (data, p, r, depth) {
    var depth = typeof depth === 'undefined' ? 1 : depth; 
    this.depth = Math.max (depth, this.depth ? this.depth : 1);
    //console.log (' '.repeat (depth) + p + ',' + r + ':' + (r - p));
    var p = typeof p === 'undefined' ? 0 : p; 
    var r = typeof r === 'undefined' ? this.length - 1 : r; 
    if (p < r) {
        data.push ([depth, r - p]);
        var q = data.partition.call (this, p, r);
        this.qsort (data, p, q - 1, depth + 1);
        this.qsort (data, q + 1, r, depth + 1);
    }
    return this;
};

Array.prototype.logNStackSpaceQSort = function (
    data, p, r, depth) {

    var that = this;
    var depth = typeof depth === 'undefined' ? 1 : depth; 
    this.depth = Math.max (depth, this.depth ? this.depth : 1);
    //console.log (' '.repeat (depth) + p + ',' + r + ':' + (r - p));
    var p = typeof p === 'undefined' ? 0 : p; 
    var r = typeof r === 'undefined' ? this.length - 1 : r; 
    var i = 0;
    while (p < r) {
        data.push ([depth, r - p]);
        var q = data.partition.call (that, p, r);
        if (q - p + 1 <= Math.floor ((r - p + 1) / 2)) {
            that.logNStackSpaceQSort (data, p, q - 1, depth + 1);
            p = q + 1;
        } else {
            that.logNStackSpaceQSort (data, q + 1, r, depth + 1);
            r = q - 1;
        }
    }
    return that;
};

var AnimQueue = (function () {

function AnimQueue () {
    this._init ();
};

AnimQueue.prototype.push = function () {
    var retVal = Array.prototype.push.apply (
        this, Array.prototype.slice.call (arguments));
    return retVal;
};

AnimQueue.prototype.shift = function () {
    var retVal = Array.prototype.shift.call (this);
    return retVal;
};

AnimQueue.prototype._init = function () {
    var that = this;
    /*setInterval (function () {
        var fn = that.shift ();
        if (typeof fn !== 'undefined') fn ();
    }, 200);*/
};

return AnimQueue;

}) ();


var Chart = (function () {

function Chart (
    chartSelector, barWidth, barColor1, barColor2, height, width) {

    var barWidth = typeof barWidth === 'undefined' ? 2 : barWidth; 
    var barColor1 = typeof barColor1 === 'undefined' ? 
        'blue' : barColor1; 
    var barColor2 = typeof barColor2 === 'undefined' ? 
        'red' : barColor2; 
    var height = typeof height === 'undefined' ? 200 : height; 
    var width = typeof width === 'undefined' ? 500 : width; 
    this._svg = d3.select (chartSelector)
        .attr ('height', height);
        //.attr ('width', width);
    this.height = height;
    this.width = width;
    this.barWidth = barWidth;
    //this.animQueue = animQueue;
    //this.barColor1 = barColor1;
    //this.barColor2 = barColor2;
};

Chart.prototype.updateChart = function (data) {
    var that = this; 
    var y = d3.scale.linear ().range ([0, this.height / 2]);
    y.domain ([0, 200]);
    var y2 = d3.scale.linear ().range ([0, 1 * (this.height / 2)]);
    y2.domain ([0, data.arr.length]);
    var bar = this._svg
        .selectAll ('g')
            .data (data)
        .enter ()
            .append ('g')
                .attr ('transform', function (d, i) {
                    return 'translate(' + i * that.barWidth + ',0)';
                });

    //this.animQueue.push (function () {
    bar.append ('rect')
            .attr ('transform', function (d, i) {
                return 'rotate(180 ' + 
                    ((that.barWidth - 1) / 2) + ' ' +
                    (that.height - (y (d[0]) / 2)) + ')';
            })
            /*.transition ()
            .duration (function (d) {
                return 200 * (y (d[0]) / (that.height / 3));
            })*/
            .attr/*Tween*/ ('height', function (d) { 
                return y (d[0]);
                //return d3.interpolate (0, y (d[0]));
            })
            .attr ('y', function (d) { 
                return that.height - y (d[0]);
            })
            .attr ('width', that.barWidth - 1);
            //.style ({'fill': this.barColor1})
    //}, function () {
    bar.append ('rect')
            .attr ('transform', function (d, i) {
                var h = (d[1] < 0) ? 0 : y2 (d[1]); 
                return 'rotate(180 ' + 
                    ((that.barWidth - 1) / 2) + ' ' +
                    (that.height - (h / 2) - y (d[0])) + ')';
            })
            /*.transition ()
            .duration (function (d) {
                var h = (d[1] < 0) ? 0 : y2 (d[1]); 
                return 200 * (h / 2 / (that.height / 3));
            })*/
            .attr/*Tween*/ ('height', function (d) { 
                var h = (d[1] < 0) ? 0 : y2 (d[1]); 
                return h;
                //return d3.interpolate (0, h);
            })
            .attr ('y', function (d) { 
                var h = (d[1] < 0) ? 0 : y2 (d[1]); 
                return that.height - h - y (d[0]) + 1;
            })
            .attr ('width', that.barWidth - 1)
            //.style ({'fill': this.barColor2})
    ;
    //})
    this._svg.attr ('width', data.length * (this.barWidth));
    
};

return Chart;

}) ();


var ChartData = (function () {

function ChartData (chart, arr) {
    this._chart = chart;
    this.arr = arr;
};

ChartData.prototype.push = function () {
    var retVal = Array.prototype.push.apply (
        this, Array.prototype.slice.call (arguments));
    this._chart.updateChart (this);
    return retVal;
};



return ChartData;

}) ();


$(function () {
    var n = 200;
    var arr = Benchmarking.getSortedArr (n);
    var data = new ChartData (new Chart ('.chart1'), arr);
    data.partition = partition;
    arr.qsort (data);
    var arr = Benchmarking.getSortedArr (n);
    var data = new ChartData (new Chart ('.chart2'), arr);
    data.partition = partition;
    arr.logNStackSpaceQSort (data);

    var arr = Benchmarking.getSortedArr (n);
    var data = new ChartData (new Chart ('.chart3'), arr);
    data.partition = randomPartition;
    arr.qsort (data);
    var arr = Benchmarking.getSortedArr (n);
    var data = new ChartData (new Chart ('.chart4'), arr);
    data.partition = randomPartition;
    arr.logNStackSpaceQSort (data);
});

//var test = function () {
//    var n = 500;
//    var arr = Benchmarking.getSortedArr (n);
//    data = new ChartData ();
//    arr.qsort (data);
//    console.log ('data = ');
//    console.log (data);
//
//    /*console.log ('time: ' + Benchmarking.timeFn (function () {
//        arr.qsort ();
//    }) + ' ms');
//    Benchmarking.assertSorted (arr);
//    console.log ('max depth: '+ arr.depth);
//    var arr = Benchmarking.getSortedArr (n);
//    console.log ('time: ' + Benchmarking.timeFn (function () {
//        arr.logNStackSpaceQSort ();
//    }) + ' ms');
//    Benchmarking.assertSorted (arr);
//    console.log ('max depth: '+ arr.depth);*/
//};
