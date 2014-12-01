MobFox-JavaScript-SDK
=====================

 MobFox JavaScript SDK supporting Banner Ads, Video Ads, and Native Ads  http://www.mobfox.com


## WIP Docs
```html
<script id="mobfoxConfig">
    window.mobfoxConfig = {
        width       : 320,
        height      : 50,
        publisherID : 'fe96717d9875b9da4339ea5367eff1ec',
        type        : 'banner',
        refresh     : 3000,         // <-- get new ad every 3 seconds
        passback    : function(){   // <-- call this if no ad is available
            console.log("nothing to show here.");
        }
    }
</script>
<script type='text/javascript' src='../dist/ad.js'></script>

```
