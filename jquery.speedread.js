/*
 *  Project: jQuery Speed Reader
 *  Description: Add spreeder-like speed reading functionality to your page
 *  Author: Munaf Assaf
 *  License: MIT
 */

;(function ( $, window, undefined ) {
    var pluginName = 'speedread',
        document = window.document,
        defaults = {
            chunkSize: 2,
            chunkTime: 1000,
            headerTags: [ 'h1', 'h2', 'h3', 'h4', 'h5', 'h6' ],
            contentTags: [ 'p', 'section' ]
        };

    // Constructor
    function Plugin( element, options ) {

        // `element` is the container for the input text to be read
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
    Plugin.prototype.init = function () {

        // Split content into sections
        this.sections = this.sectionize();

        // Run speed reader

    };

    // Split content into sections
    Plugin.prototype.sectionize = function () {

        var sections    = [],
            headerTags  = this.options.headerTags,
            contentTags = this.options.contentTags;

        $( this.element ).children().each( function( index, child ) {

            if ( $.inArray( child.tagName.toLowerCase(), headerTags ) >= 0 ) {

                sections.push({
                    header: child.innerText,
                    content: []
                });

            } else if ( $.inArray( child.tagName.toLowerCase(), contentTags ) >= 0 ) {

                if ( sections.length > 0 ) {

                    $.merge( sections[ sections.length - 1 ].content, 
                         child.innerText.split( ' ' ) );

                } else {

                    sections.push({
                        header: null,
                        content: child.innerText.split( ' ' )
                    });
                }
            }

        });

        return sections;

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