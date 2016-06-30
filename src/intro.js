; (function (factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['jquery', 'd3'], factory($, d3));
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('jquery'), require('d3'));
    } else {
        factory(jQuery, d3);
    }
}(function ($, d3, undefined) {
    'use strict';