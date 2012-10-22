/*
 *  Project: jQuery Speed Reader
 *  Description: Add spreeder-like speed reading functionality to your page
 *  Author: Munaf Assaf
 *  License: WTFPL (http://sam.zoy.org/wtfpl)
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
        
        // Initialize plugin
        this.init();
    } 

    // Plugin initializer
    Plugin.prototype.init = function () {

        // Split content into sections
        this.sections = utils.parse( this.element, this.options.schema );

        // Initialize content meta variables
        this._length = 0;
        this._pos = {
            section: 0,
            word: 0
        };

        // Add speed reader to DOM
        this.$modal = utils.createPlayer();
        this.$modal.appendTo( 'body' );

    };

    // Plugin initializer
    Plugin.prototype.play = function () {

        var $player  = this.$modal.find( '.chunk-display' ),
            self     = this,
            playerID = enablePlayer();

        function enablePlayer() {
            return window.setInterval( printChunk, self.options.chunkTime );
        }

        function disablePlayer() {
            window.clearInterval( playerID );
        }

        function printChunk() {
            var wordPos = self._pos.word;

            var chunk = self.sections[ self._pos.section ]
                        .content.slice( wordPos, wordPos + self.options.chunkSize )
                        .join(' ');

            $player.html( '<span>' + chunk + '</span>' );

            advancePosition();
        }

        function advancePosition() {
            self._pos.word += self.options.chunkSize;

            if ( self._pos.word >= self.sections[ self._pos.section ].content.length ) {

                self._pos.word = 0;
                self._pos.section++;

            }

            if ( self._pos.section >= self.sections.length ) {

                self._pos.section = 0;
                self._pos.word = 0;

                disablePlayer();
            }
        }

    };

    // General, private utilities (not exposed via plugin API)
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

            }); // $.each

            return sections;

        }, // parse()

        createPlayer: function() {

            var html = [
                    '<div class="jq-speedread-modal">',
                        '<div class="player">',
                            '<div class="close-icon">x</div>',
                            '<div class="chunk-display"></div>',
                        '</div>',
                    '</div>'
                ].join('');

            return $( html );
        }

    }; // utils object

    // Plugin wrapper to prevent multiple instantiations
    $.fn[pluginName] = function ( options ) {

        var plugin = null;

        var data = this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {

                plugin = new Plugin( this, options );

                $.data(this, 'plugin_' + pluginName, plugin );
            }
        });

        return plugin;
    };

}(jQuery, window));