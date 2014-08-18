//#!/usr/bin/node 

Math.log2 = function (val) {
    return Math.log (val) / Math.LN2;
};

String.prototype.repeat = function (count) {
    var result = '';
    for (var i = 0; i < count; i++) {
        result += this;
    }
    return result;
};

/**
 * Array shuffle algorithm
 */
Array.prototype.fisherYates = function () {
    var temp, j;
    for (var i = this.length - 1; i >= 0; i--) {
        j = Math.floor (Math.random () * i);
        temp = this[i];
        this[i] = this[j]; 
        this[j] = temp;
    }
    return this;
};


var Benchmarking = (function () {

function Benchmarking () {
};

Benchmarking.getRandom = function () {
    return new Array (n).join ('0').split ('').map (
        function (a, i) {
            return i;
        }).fisherYates ();
}

Benchmarking.getReverseSortedArr = function (n) {
    return new Array (n).join ('0').split ('').map (
        function (a, i) {
            return i;
        }).reverse ();
}

Benchmarking.getSortedArr = function (n) {
    return new Array (n).join ('0').split ('').map (
        function (a, i) {
            return i;
        });
}

Benchmarking.assertSorted = function (arr) {
    console.assert (arr.reduce (function (a, b) {
        return a <= b;
    }));
}

Benchmarking.timeFn = function (fn) {
    var start = +new Date ();
    fn ();
    return +new Date () - start;
}


return Benchmarking;

}) ();

