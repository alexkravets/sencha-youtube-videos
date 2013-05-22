# Sencha Youtube Videos

Embeded youtube iframe breaks screen scrolling experience. When user touch the iframe area trying to scroll nothing happens, cause iframe intercepts touch event and sencha scrolling engine is not able to handle touch event.


## How to use

1. Embed [YouTube iFrame JavaScript API](https://developers.google.com/youtube/iframe_api_reference) with a following code after app initialized:

```
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
window.onYouTubeIframeAPIReady = function () {
    console.log('youtube api loaded');
    window.youtube_iframe_api_ready = true;
}
```

2. Put the video component in your layout using template:

```
{
    xtype:      'youtube',
    thumb:      'resources/images/intro-thumb@2x.png',
    youtube_id: 'KIMCR0BQndM',
    width:      304,
    height:     190
}
```

Parameters: ```thumb``` is used to set the thumbnail for the video, if not set default YouTube thumbnail is used. ```youtube_id``` - YouTube video id which is used in videos URL.


## Details

This component uses [YouTube iFrame JavaScript API](https://developers.google.com/youtube/iframe_api_reference) and with a bunch of hacks doing a pretty good job on the iPhone. For the Android I would recommend to use [YouTube Android API](https://developers.google.com/youtube/android/player/).

1. The component is based on Senchas ```Ext.Img``` class which provides a basis for video thumb and shows play button overlay.

2. When user taps on thumb, iframe is added to DOM, shown and video starts playing. To make this autoplay feature possible we use [YouTube iFrame JavaScript API](https://developers.google.com/youtube/iframe_api_reference).

3. After video ends/stops/paused iframe is resized to the 10px box and hidden under play button overlay. This part is important and tricky, I've tried to hide, delete iframe and some other options, but ended up with resizing. It allows to continue playing after pause and have a few youtube iframes on the same page with no issue. Video can be resized only once, cause after second play tap player goes into fullscreen mode and user don't see the iframe itself.

--
[Alexander Kravets](http://www.akravets.com) @ [Slate](http://www.slatestudio.com), May 2013
