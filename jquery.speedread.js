/*
 *  Project: jQuery Speed Reader
 *  Description: 
 *  Author: Munaf Assaf
 *  License: MIT
 */

;(function ( $, window, undefined ) {

    var pluginName = 'speedread',
        document = window.document,
        defaults = {
            chunkSize: 2,       // # of words to display at a time
            chunkTime: 1000     // time in (ms) to display a chunk
        };

    // Constructor
    function SpeedRead( element, options ) {

        // `element` is the container for the input html
        this.element = element;

        // Merge user options with defaults
        this.options = $.extend( {}, defaults, options );
        
        // Save meta info
        this._defaults = defaults;
        this._name = pluginName;
        
        // Initialize plugin
        this.init();
    }

    // Plugin initializer
    SpeedRead.prototype.init = function () {

        // Apply user options

        // Parse text into headers/content

        // Run speed reader

    };

    // Plugin wrapper to prevent multiple instantiations
    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName, new Plugin( this, options ));
            }
        });
    };

}(jQuery, window));