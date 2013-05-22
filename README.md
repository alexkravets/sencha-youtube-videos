# Sencha Youtube Videos (0.1)

Embeded youtube iframe breaks screen scrolling experience. When user touch the iframe area trying to scroll nothing happens, cause iframe intercepts touch event and sencha scrolling engine is not able to handle touch event.


## How to use

Put the ```Youtube.js``` file from the **src** folder into ```app/component``` folder of the application. Fix the namespace of the component in the first line of ```Youtube.js``` by renaming ```AppName``` to the real name.

Add ```jquery``` dependency (should be removed in future versions) by adding following code in ```app.json``` file into ```js``` array:

```
{
    "path": "jquery.js",
    "update": "delta"
},
```

Embed [YouTube iFrame JavaScript API](https://developers.google.com/youtube/iframe_api_reference) by adding the following function to the ```app.js``` and call ```this.addYoutubeApi()``` in ```launch``` function:

```
launch: function() {
    // Add YT JS API
    this.addYutubeApi();

    // Destroy the #appLoadingIndicator element
    Ext.fly('appLoadingIndicator').destroy();

    // Initialize the main view
    Ext.Viewport.add(Ext.create('YtVideosDemo.view.Main'));
},

addYoutubeApi: function() {
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";

    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = function () {
        console.log('youtube api loaded');
        window.youtube_iframe_api_ready = true;
    }
},
```

```window.youtube_iframe_api_ready``` is used by component to make sure API has been successfully loaded.

Add reference to the video component in the view where videos are going to be used, replace ```AppName``` with a real name:

```requires: [ 'AppName.component.Youtube' ]```

Put the video component in your views layout using template:

```
{
    xtype:      'youtube',
    thumb:      'resources/images/intro-thumb@2x.png',
    youtube_id: 'KIMCR0BQndM',
    width:      304,
    height:     190
}
```

Parameters:

```thumb``` is used to set the thumbnail for the video, if not set default YouTube thumbnail is used.

```youtube_id``` - YouTube video id which is used in videos URL.

Add styles for the play button to ```resources/sass/app.scss```:

```
.x-youtube                            {
  &:after                             { content: '';
                                        display: block;
                                        position: absolute;
                                        width:100%;
                                        height:100%;
                                        background: url('../images/youtube-play@2x.png') no-repeat center;
                                        background-size: 58px 58px;
  }

  &.x-youtube-overlay                 {
    &:after                           { background-color: rgba(0,0,0,0.5);
    }
  }

  &.x-youtube-loading                 {
    &:after                           { background-image: none;
    }
  }

  iframe                              { border: 0;
  }
}
```

After all of these finished you can build sencha project and wrap it with cordova. Please reference demo project for example.


## Demo

In ```demo``` folder two projects are available ```sencha``` (2.2) and ```cordova```(2.7). Sencha app is build for production and copied to ```demo/cordova/www``` folder. So to test things out launch the cordova project and run app in simulator.


## Details

This component uses [YouTube iFrame JavaScript API](https://developers.google.com/youtube/iframe_api_reference) and with a bunch of hacks doing a pretty good job on the iPhone. For the Android I would recommend to use [YouTube Android API](https://developers.google.com/youtube/android/player/).

1. The component is based on Senchas ```Ext.Img``` class which provides a basis for video thumb and shows play button overlay.

2. When user taps on thumb, iframe is added to DOM, shown and video starts playing. To make this autoplay feature possible we use [YouTube iFrame JavaScript API](https://developers.google.com/youtube/iframe_api_reference).

3. After video ends/stops/paused iframe is resized to the 10px box and hidden under play button overlay. This part is important and tricky, I've tried to hide, delete iframe and some other options, but ended up with resizing. It allows to continue playing after pause and have a few youtube iframes on the same page with no issue. Video can be resized only once, cause after second play tap player goes into fullscreen mode and user don't see the iframe itself.


## TODO

1. Remove ```jQuery``` dependency for the iframe resizing function.
2. Add reference and code to support Android YT API.
3. Make component namespace independent.

--
[Alexander Kravets](http://www.akravets.com) @ [Slate](http://www.slatestudio.com), May 2013
