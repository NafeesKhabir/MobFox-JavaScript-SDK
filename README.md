MobFox-JavaScript-SDK
=====================

MobFox JavaScript SDK supporting Banner Ads, Video Ads, and Native Ads  http://www.mobfox.com


## How To Use

```html
<script id="mobfoxConfig">
    window.mobfoxConfig = {
        width           : 320,
        height          : 50,
        publicationID   : 'fe96717d9875b9da4339ea5367eff1ec',
        type            : 'banner',
        refresh         : 3000,         // <-- get new ad every 3 seconds
        passback        : function(){   // <-- call this if no ad is available
            console.log("nothing to show here.");
        }
    }
</script>
<script type='text/javascript' src='../dist/ad.js'></script>

```

* ```type``` - can be ```'banner'``` or ```'interstitial'```
* ```refresh``` - optional. Number of milliseconds before the ad will be refreshed.
* ```passback``` - optional. This function will be called in case no ad is returned.

#### Optional Parameters

For the documentation of each option please refer to the [API Doc](http://dev.mobfox.com/index.php?title=Ad_Request_API)

 * ```o_androidid```
 * ```o_androidimei```
 * ```o_iosadvid```
 * ```o_andadvid```
 * ```longitude```
 * ```latitude```
 * ```demo.gender```
 * ```demo.keyword```
 * ```demo.age```
 * ```adspace.strict```
 * ```no_markup```
 * ```s_subid```
 * ```allow_mr```
 * ```r_floor```


### Native Ads - TBD
