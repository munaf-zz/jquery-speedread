/*
 *  Project: jQuery Speed Reader
 *  Description: Add spreeder-like speed reading functionality to your page
 *  Author: Munaf Assaf
 *  License: MIT
 */

;(function ( $, window, undefined ) {

    // Plugin meta-properties
    var pluginName = 'speedread',
        document = window.document,
        defaults = {
            chunkSize: 2,
            chunkTime: 1000,
            schema: {
                headers: [ 'h1', 'h2', 'h3', 'h4', 'h5', 'h6' ],
                content: [ 'p', 'section' ]
            }
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
        this._length = 0;
        
        // Initialize plugin
        this.init();
    }

    // Plugin initializer
    Plugin.prototype.init = function () {

        // Split content into sections
        this.sections = utils.parse( this.element, this.options.schema );

        // Run speed reader

    };

    // Split content into sections
    var utils = {
        parse: function ( element, schema ) {

            var sections    = [],
                content     = [],
                headerTags  = schema.headers,
                contentTags = schema.content;

            // Scrape content from each child node of given element
            $( element ).children().each( function( index, child ) {

                // Create a new section
                // Section titles will have different CSS than content
                if ( $.inArray( child.tagName.toLowerCase(), headerTags ) >= 0 ) {

                    sections.push({
                        header: child.innerText,
                        content: []
                    });

                // Add content to an existing section or create a new section
                } else if ( $.inArray( child.tagName.toLowerCase(), contentTags ) >= 0 ) {

                    content = child.innerText.split(' ');

                    // Update existing section
                    if ( sections.length > 0 ) {

                        $.merge( sections[ sections.length - 1 ].content, content );
                    }

                    // Or create a new section
                    else {

                        sections.push({
                            header: null,
                            content: content
                        });
                    }

                    // Update total length for progress bar
                    // Don't count headers as content
                    this._length += content.length;
                }
            });

            // Save parsed text to object
            return sections;
        }
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