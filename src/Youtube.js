Ext.define('HelloHartoApp.component.Youtube', {
    extend: 'Ext.Img',
    xtype: ['youtube'],

    config: {
        thumb:            null,
        youtube_id:       null,
        overlay:          false,

        /**
         * @cfg
         * @inheritdoc
         */
        baseCls : Ext.baseCSSPrefix + 'youtube',

        /**
         * @cfg {String} imageCls The CSS class to be used when {@link #mode} is not set to 'background'
         * @accessor
         */
        imageCls : Ext.baseCSSPrefix + 'youtube-image',

        /**
         * @cfg {String} backgroundCls The CSS class to be used when {@link #mode} is set to 'background'
         * @accessor
         */
        backgroundCls : Ext.baseCSSPrefix + 'youtube-background'
    },

    initialize: function() {
        var me = this;

        var thumb     = me.getThumb();
        this.yt_thumb = false;

        if (!thumb) {
            var thumb     = "http://img.youtube.com/vi/" + this.getYoutube_id() + "/0.jpg";
            this.yt_thumb = true;
        }

        me.setSrc(thumb);

        me.callParent();

        me.on('tap',  this.playerTapped, this);
        me.on('load', this.afterLoad, this);
    },

    getImageWidth: function() {
        return ($) ? $(this.element.dom).width() : this.element.dom.offsetWidth;
    },

    getImageHeight: function() {
        return ($) ? $(this.element.dom).height() : this.element.dom.offsetHeight;
    },

    afterLoad: function (argument) {
        if (this.getOverlay()) {
            $(this.element.dom).addClass('x-youtube-overlay');
        }

        var width  = this.getImageWidth(),
            height = this.getImageHeight();

        if(this.yt_thumb) {
            this.element.dom.style.backgroundSize     = 'cover';
            this.element.dom.style.backgroundPosition = 'center center';
        } else {
            this.element.dom.style.backgroundSize = width + 'px ' + height + 'px';
        }        
    },

    playerTapped: function() {
        if (window.youtube_iframe_api_ready) {
            if (this.player) {
                /*
                   Side Note:
                   There is a iPhone player bug, when hit play via api or tap
                   the iframe play button, fullscreen player brings up, but do
                   not start playing. User should double tap, the play button
                   then video starts to play.
                */                
                this.player.playVideo();
            } else {
                this.initVideo();
            }
        } else {
            console.log('Youtube api is not ready.')
        }
    },

    initVideo: function() {
        $(this.element.dom).addClass('x-youtube-loading');

        me = this;

        // Create component to be replaced with iframe ====

        youtube_div = me.element.createChild({ tag: 'div' });
        youtube_div.dom.style.position = 'absolute';

        // Youtube iframe initialization ==================

        me.player = new YT.Player(youtube_div.id, {
            width:   me.getImageWidth(),
            height:  me.getImageHeight(),
            videoId: me.getYoutube_id(),
            events: {
                'onReady': function (event) {
                    me.youtube_iframe = $(me.element.dom).find('iframe');

                    event.target.playVideo();
                },
                'onStateChange': function(event) {
                    me.onStateChange(event);
                } 
            }
        });
    },

    onStateChange: function(e) {
        if (e.data == YT.PlayerState.STOPED || e.data == YT.PlayerState.PAUSED) {
            
            // Hiding iframe so it doesn't break the scrolling

            $(this.element.dom).removeClass('x-youtube-loading');
            this.youtube_iframe.css({
                width:  '10px',
                height: '10px',
                'margin-left': me.getImageWidth() /2 - 5,
                'margin-top':  me.getImageHeight() /2 - 5,
                position: 'absolute'
            });
        }
    }
});


