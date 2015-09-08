MobFox-JavaScript-SDK
=====================

MobFox JavaScript SDK supporting Banner Ads, Video Ads, and Native Ads  http://www.mobfox.com


## How To Use

```HTML
<script 
    class="mobfoxConfig" 
    src="http://my.mobfox.com/ad_sdk.js?cb=CACHEBUSTER&referrer=REFERRER_URL&width=320&height=50&pid=fe96717d9875b9da4339ea5367eff1ec&type=banner&refresh=3000"
>
</script>
```

You can use the Mobfox [Tag Generator](https://account.mobfox.com/www/cp/integration.php) (select your web publication) to easily create tags.


Insert this tag in your html page where you wish Mobfox ad/s to be located, for example:
```HTML
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>My Page</title>
</head>
<body>
    <div id="main"">
        <!-- ad will be placed inside the div with id 'main' -->
        <script 
    class="mobfoxConfig" 
    src="http://my.mobfox.com/ad_sdk.js?cb=CACHEBUSTER&referrer=REFERRER_URL&width=320&height=50&pid=fe96717d9875b9da4339ea5367eff1ec&type=banner&refresh=3000"
>
</script>
    </div>
</body>
</html>
```
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
 * ```adspace_strict```
 * ```no_markup```
 * ```s_subid```
 * ```allow_mr```
 * ```r_floor```


### Building

You will need to first to install [NodeJS](https://nodejs.org/) and [Browserify](http://browserify.org/). Then run ```make.sh```.

### Testing

You will need tp first to install [NodeJS](https://nodejs.org/) and [SlimerJS](http://slimerjs.org/). Then run ```test/run.js```.
