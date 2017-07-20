(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (process,global){
/*!
 * async
 * https://github.com/caolan/async
 *
 * Copyright 2010-2014 Caolan McMahon
 * Released under the MIT license
 */
(function () {

    var async = {};
    var noop = function () {};

    // global on the server, window in the browser
    var root, previous_async;

    if (typeof window == 'object' && this === window) {
        root = window;
    }
    else if (typeof global == 'object' && this === global) {
        root = global;
    }
    else {
        root = this;
    }

    if (root != null) {
      previous_async = root.async;
    }

    async.noConflict = function () {
        root.async = previous_async;
        return async;
    };

    function only_once(fn) {
        var called = false;
        return function() {
            if (called) throw new Error("Callback was already called.");
            called = true;
            fn.apply(root, arguments);
        };
    }

    //// cross-browser compatiblity functions ////

    var _toString = Object.prototype.toString;

    var _isArray = Array.isArray || function (obj) {
        return _toString.call(obj) === '[object Array]';
    };

    var _each = function (arr, iterator) {
      var index = -1,
          length = arr.length;

      while (++index < length) {
        iterator(arr[index], index, arr);
      }
    };

    var _map = function (arr, iterator) {
      var index = -1,
          length = arr.length,
          result = Array(length);

      while (++index < length) {
        result[index] = iterator(arr[index], index, arr);
      }
      return result;
    };

    var _reduce = function (arr, iterator, memo) {
        _each(arr, function (x, i, a) {
            memo = iterator(memo, x, i, a);
        });
        return memo;
    };

    var _forEachOf = function (object, iterator) {
        _each(_keys(object), function (key) {
            iterator(object[key], key);
        });
    };

    var _keys = Object.keys || function (obj) {
        var keys = [];
        for (var k in obj) {
            if (obj.hasOwnProperty(k)) {
                keys.push(k);
            }
        }
        return keys;
    };

    var _baseSlice = function (arr, start) {
        start = start || 0;
        var index = -1;
        var length = arr.length;

        if (start) {
          length -= start;
          length = length < 0 ? 0 : length;
        }
        var result = Array(length);

        while (++index < length) {
          result[index] = arr[index + start];
        }
        return result;
    };

    //// exported async module functions ////

    //// nextTick implementation with browser-compatible fallback ////

    // capture the global reference to guard against fakeTimer mocks
    var _setImmediate;
    if (typeof setImmediate === 'function') {
        _setImmediate = setImmediate;
    }

    if (typeof process === 'undefined' || !(process.nextTick)) {
        if (_setImmediate) {
            async.nextTick = function (fn) {
                // not a direct alias for IE10 compatibility
                _setImmediate(fn);
            };
            async.setImmediate = async.nextTick;
        }
        else {
            async.nextTick = function (fn) {
                setTimeout(fn, 0);
            };
            async.setImmediate = async.nextTick;
        }
    }
    else {
        async.nextTick = process.nextTick;
        if (_setImmediate) {
            async.setImmediate = function (fn) {
              // not a direct alias for IE10 compatibility
              _setImmediate(fn);
            };
        }
        else {
            async.setImmediate = async.nextTick;
        }
    }

    async.each = function (arr, iterator, callback) {
        callback = callback || noop;
        if (!arr.length) {
            return callback();
        }
        var completed = 0;
        _each(arr, function (x) {
            iterator(x, only_once(done) );
        });
        function done(err) {
          if (err) {
              callback(err);
              callback = noop;
          }
          else {
              completed += 1;
              if (completed >= arr.length) {
                  callback();
              }
          }
        }
    };
    async.forEach = async.each;

    async.eachSeries = function (arr, iterator, callback) {
        callback = callback || noop;
        if (!arr.length) {
            return callback();
        }
        var completed = 0;
        var iterate = function () {
            iterator(arr[completed], function (err) {
                if (err) {
                    callback(err);
                    callback = noop;
                }
                else {
                    completed += 1;
                    if (completed >= arr.length) {
                        callback();
                    }
                    else {
                        iterate();
                    }
                }
            });
        };
        iterate();
    };
    async.forEachSeries = async.eachSeries;


    async.eachLimit = function (arr, limit, iterator, callback) {
        var fn = _eachLimit(limit);
        fn.apply(null, [arr, iterator, callback]);
    };
    async.forEachLimit = async.eachLimit;

    var _eachLimit = function (limit) {

        return function (arr, iterator, callback) {
            callback = callback || noop;
            if (!arr.length || limit <= 0) {
                return callback();
            }
            var completed = 0;
            var started = 0;
            var running = 0;

            (function replenish () {
                if (completed >= arr.length) {
                    return callback();
                }

                while (running < limit && started < arr.length) {
                    started += 1;
                    running += 1;
                    iterator(arr[started - 1], function (err) {
                        if (err) {
                            callback(err);
                            callback = noop;
                        }
                        else {
                            completed += 1;
                            running -= 1;
                            if (completed >= arr.length) {
                                callback();
                            }
                            else {
                                replenish();
                            }
                        }
                    });
                }
            })();
        };
    };



    async.forEachOf = async.eachOf = function (object, iterator, callback) {
        callback = callback || function () {};
        var size = object.length || _keys(object).length;
        var completed = 0;
        if (!size) {
            return callback();
        }
        _forEachOf(object, function (value, key) {
            iterator(object[key], key, function (err) {
                if (err) {
                    callback(err);
                    callback = function () {};
                } else {
                    completed += 1;
                    if (completed === size) {
                        callback(null);
                    }
                }
            });
        });
    };

    async.forEachOfSeries = async.eachOfSeries = function (obj, iterator, callback) {
        callback = callback || function () {};
        var keys = _keys(obj);
        var size = keys.length;
        if (!size) {
            return callback();
        }
        var completed = 0;
        var iterate = function () {
            var sync = true;
            var key = keys[completed];
            iterator(obj[key], key, function (err) {
                if (err) {
                    callback(err);
                    callback = function () {};
                }
                else {
                    completed += 1;
                    if (completed >= size) {
                        callback(null);
                    }
                    else {
                        if (sync) {
                            async.nextTick(iterate);
                        }
                        else {
                            iterate();
                        }
                    }
                }
            });
            sync = false;
        };
        iterate();
    };



    async.forEachOfLimit = async.eachOfLimit = function (obj, limit, iterator, callback) {
        _forEachOfLimit(limit)(obj, iterator, callback);
    };

    var _forEachOfLimit = function (limit) {

        return function (obj, iterator, callback) {
            callback = callback || function () {};
            var keys = _keys(obj);
            var size = keys.length;
            if (!size || limit <= 0) {
                return callback();
            }
            var completed = 0;
            var started = 0;
            var running = 0;

            (function replenish () {
                if (completed >= size) {
                    return callback();
                }

                while (running < limit && started < size) {
                    started += 1;
                    running += 1;
                    var key = keys[started - 1];
                    iterator(obj[key], key, function (err) {
                        if (err) {
                            callback(err);
                            callback = function () {};
                        }
                        else {
                            completed += 1;
                            running -= 1;
                            if (completed >= size) {
                                callback();
                            }
                            else {
                                replenish();
                            }
                        }
                    });
                }
            })();
        };
    };


    var doParallel = function (fn) {
        return function () {
            var args = _baseSlice(arguments);
            return fn.apply(null, [async.each].concat(args));
        };
    };
    var doParallelLimit = function(limit, fn) {
        return function () {
            var args = _baseSlice(arguments);
            return fn.apply(null, [_eachLimit(limit)].concat(args));
        };
    };
    var doSeries = function (fn) {
        return function () {
            var args = _baseSlice(arguments);
            return fn.apply(null, [async.eachSeries].concat(args));
        };
    };


    var _asyncMap = function (eachfn, arr, iterator, callback) {
        arr = _map(arr, function (x, i) {
            return {index: i, value: x};
        });
        if (!callback) {
            eachfn(arr, function (x, callback) {
                iterator(x.value, function (err) {
                    callback(err);
                });
            });
        } else {
            var results = [];
            eachfn(arr, function (x, callback) {
                iterator(x.value, function (err, v) {
                    results[x.index] = v;
                    callback(err);
                });
            }, function (err) {
                callback(err, results);
            });
        }
    };
    async.map = doParallel(_asyncMap);
    async.mapSeries = doSeries(_asyncMap);
    async.mapLimit = function (arr, limit, iterator, callback) {
        return _mapLimit(limit)(arr, iterator, callback);
    };

    var _mapLimit = function(limit) {
        return doParallelLimit(limit, _asyncMap);
    };

    // reduce only has a series version, as doing reduce in parallel won't
    // work in many situations.
    async.reduce = function (arr, memo, iterator, callback) {
        async.eachSeries(arr, function (x, callback) {
            iterator(memo, x, function (err, v) {
                memo = v;
                callback(err);
            });
        }, function (err) {
            callback(err, memo);
        });
    };
    // inject alias
    async.inject = async.reduce;
    // foldl alias
    async.foldl = async.reduce;

    async.reduceRight = function (arr, memo, iterator, callback) {
        var reversed = _map(arr, function (x) {
            return x;
        }).reverse();
        async.reduce(reversed, memo, iterator, callback);
    };
    // foldr alias
    async.foldr = async.reduceRight;

    var _filter = function (eachfn, arr, iterator, callback) {
        var results = [];
        arr = _map(arr, function (x, i) {
            return {index: i, value: x};
        });
        eachfn(arr, function (x, callback) {
            iterator(x.value, function (v) {
                if (v) {
                    results.push(x);
                }
                callback();
            });
        }, function (err) {
            callback(_map(results.sort(function (a, b) {
                return a.index - b.index;
            }), function (x) {
                return x.value;
            }));
        });
    };
    async.filter = doParallel(_filter);
    async.filterSeries = doSeries(_filter);
    // select alias
    async.select = async.filter;
    async.selectSeries = async.filterSeries;

    var _reject = function (eachfn, arr, iterator, callback) {
        var results = [];
        arr = _map(arr, function (x, i) {
            return {index: i, value: x};
        });
        eachfn(arr, function (x, callback) {
            iterator(x.value, function (v) {
                if (!v) {
                    results.push(x);
                }
                callback();
            });
        }, function (err) {
            callback(_map(results.sort(function (a, b) {
                return a.index - b.index;
            }), function (x) {
                return x.value;
            }));
        });
    };
    async.reject = doParallel(_reject);
    async.rejectSeries = doSeries(_reject);

    var _detect = function (eachfn, arr, iterator, main_callback) {
        eachfn(arr, function (x, callback) {
            iterator(x, function (result) {
                if (result) {
                    main_callback(x);
                    main_callback = noop;
                }
                else {
                    callback();
                }
            });
        }, function (err) {
            main_callback();
        });
    };
    async.detect = doParallel(_detect);
    async.detectSeries = doSeries(_detect);

    async.some = function (arr, iterator, main_callback) {
        async.each(arr, function (x, callback) {
            iterator(x, function (v) {
                if (v) {
                    main_callback(true);
                    main_callback = noop;
                }
                callback();
            });
        }, function (err) {
            main_callback(false);
        });
    };
    // any alias
    async.any = async.some;

    async.every = function (arr, iterator, main_callback) {
        async.each(arr, function (x, callback) {
            iterator(x, function (v) {
                if (!v) {
                    main_callback(false);
                    main_callback = noop;
                }
                callback();
            });
        }, function (err) {
            main_callback(true);
        });
    };
    // all alias
    async.all = async.every;

    async.sortBy = function (arr, iterator, callback) {
        async.map(arr, function (x, callback) {
            iterator(x, function (err, criteria) {
                if (err) {
                    callback(err);
                }
                else {
                    callback(null, {value: x, criteria: criteria});
                }
            });
        }, function (err, results) {
            if (err) {
                return callback(err);
            }
            else {
                var fn = function (left, right) {
                    var a = left.criteria, b = right.criteria;
                    return a < b ? -1 : a > b ? 1 : 0;
                };
                callback(null, _map(results.sort(fn), function (x) {
                    return x.value;
                }));
            }
        });
    };

    async.auto = function (tasks, callback) {
        callback = callback || noop;
        var keys = _keys(tasks);
        var remainingTasks = keys.length;
        if (!remainingTasks) {
            return callback();
        }

        var results = {};

        var listeners = [];
        var addListener = function (fn) {
            listeners.unshift(fn);
        };
        var removeListener = function (fn) {
            for (var i = 0; i < listeners.length; i += 1) {
                if (listeners[i] === fn) {
                    listeners.splice(i, 1);
                    return;
                }
            }
        };
        var taskComplete = function () {
            remainingTasks--;
            _each(listeners.slice(0), function (fn) {
                fn();
            });
        };

        addListener(function () {
            if (!remainingTasks) {
                var theCallback = callback;
                // prevent final callback from calling itself if it errors
                callback = noop;

                theCallback(null, results);
            }
        });

        _each(keys, function (k) {
            var task = _isArray(tasks[k]) ? tasks[k]: [tasks[k]];
            var taskCallback = function (err) {
                var args = _baseSlice(arguments, 1);
                if (args.length <= 1) {
                    args = args[0];
                }
                if (err) {
                    var safeResults = {};
                    _each(_keys(results), function(rkey) {
                        safeResults[rkey] = results[rkey];
                    });
                    safeResults[k] = args;
                    callback(err, safeResults);
                    // stop subsequent errors hitting callback multiple times
                    callback = noop;
                }
                else {
                    results[k] = args;
                    async.setImmediate(taskComplete);
                }
            };
            var requires = task.slice(0, Math.abs(task.length - 1)) || [];
            // prevent dead-locks
            var len = requires.length;
            var dep;
            while (len--) {
                if (!(dep = tasks[requires[len]])) {
                    throw new Error('Has inexistant dependency');
                }
                if (_isArray(dep) && !!~dep.indexOf(k)) {
                    throw new Error('Has cyclic dependencies');
                }
            }
            var ready = function () {
                return _reduce(requires, function (a, x) {
                    return (a && results.hasOwnProperty(x));
                }, true) && !results.hasOwnProperty(k);
            };
            if (ready()) {
                task[task.length - 1](taskCallback, results);
            }
            else {
                var listener = function () {
                    if (ready()) {
                        removeListener(listener);
                        task[task.length - 1](taskCallback, results);
                    }
                };
                addListener(listener);
            }
        });
    };

    async.retry = function(times, task, callback) {
        var DEFAULT_TIMES = 5;
        var attempts = [];
        // Use defaults if times not passed
        if (typeof times === 'function') {
            callback = task;
            task = times;
            times = DEFAULT_TIMES;
        }
        // Make sure times is a number
        times = parseInt(times, 10) || DEFAULT_TIMES;
        var wrappedTask = function(wrappedCallback, wrappedResults) {
            var retryAttempt = function(task, finalAttempt) {
                return function(seriesCallback) {
                    task(function(err, result){
                        seriesCallback(!err || finalAttempt, {err: err, result: result});
                    }, wrappedResults);
                };
            };
            while (times) {
                attempts.push(retryAttempt(task, !(times-=1)));
            }
            async.series(attempts, function(done, data){
                data = data[data.length - 1];
                (wrappedCallback || callback)(data.err, data.result);
            });
        };
        // If a callback is passed, run this as a controll flow
        return callback ? wrappedTask() : wrappedTask;
    };

    async.waterfall = function (tasks, callback) {
        callback = callback || noop;
        if (!_isArray(tasks)) {
          var err = new Error('First argument to waterfall must be an array of functions');
          return callback(err);
        }
        if (!tasks.length) {
            return callback();
        }
        var wrapIterator = function (iterator) {
            return function (err) {
                if (err) {
                    callback.apply(null, arguments);
                    callback = noop;
                }
                else {
                    var args = _baseSlice(arguments, 1);
                    var next = iterator.next();
                    if (next) {
                        args.push(wrapIterator(next));
                    }
                    else {
                        args.push(callback);
                    }
                    async.setImmediate(function () {
                        iterator.apply(null, args);
                    });
                }
            };
        };
        wrapIterator(async.iterator(tasks))();
    };

    var _parallel = function(eachfn, tasks, callback) {
        callback = callback || noop;
        if (_isArray(tasks)) {
            eachfn.map(tasks, function (fn, callback) {
                if (fn) {
                    fn(function (err) {
                        var args = _baseSlice(arguments, 1);
                        if (args.length <= 1) {
                            args = args[0];
                        }
                        callback.call(null, err, args);
                    });
                }
            }, callback);
        }
        else {
            var results = {};
            eachfn.each(_keys(tasks), function (k, callback) {
                tasks[k](function (err) {
                    var args = _baseSlice(arguments, 1);
                    if (args.length <= 1) {
                        args = args[0];
                    }
                    results[k] = args;
                    callback(err);
                });
            }, function (err) {
                callback(err, results);
            });
        }
    };

    async.parallel = function (tasks, callback) {
        _parallel({ map: async.map, each: async.each }, tasks, callback);
    };

    async.parallelLimit = function(tasks, limit, callback) {
        _parallel({ map: _mapLimit(limit), each: _eachLimit(limit) }, tasks, callback);
    };

    async.series = function (tasks, callback) {
        callback = callback || noop;
        if (_isArray(tasks)) {
            async.mapSeries(tasks, function (fn, callback) {
                if (fn) {
                    fn(function (err) {
                        var args = _baseSlice(arguments, 1);
                        if (args.length <= 1) {
                            args = args[0];
                        }
                        callback.call(null, err, args);
                    });
                }
            }, callback);
        }
        else {
            var results = {};
            async.eachSeries(_keys(tasks), function (k, callback) {
                tasks[k](function (err) {
                    var args = _baseSlice(arguments, 1);
                    if (args.length <= 1) {
                        args = args[0];
                    }
                    results[k] = args;
                    callback(err);
                });
            }, function (err) {
                callback(err, results);
            });
        }
    };

    async.iterator = function (tasks) {
        var makeCallback = function (index) {
            var fn = function () {
                if (tasks.length) {
                    tasks[index].apply(null, arguments);
                }
                return fn.next();
            };
            fn.next = function () {
                return (index < tasks.length - 1) ? makeCallback(index + 1): null;
            };
            return fn;
        };
        return makeCallback(0);
    };

    async.apply = function (fn) {
        var args = _baseSlice(arguments, 1);
        return function () {
            return fn.apply(
                null, args.concat(_baseSlice(arguments))
            );
        };
    };

    var _concat = function (eachfn, arr, fn, callback) {
        var r = [];
        eachfn(arr, function (x, cb) {
            fn(x, function (err, y) {
                r = r.concat(y || []);
                cb(err);
            });
        }, function (err) {
            callback(err, r);
        });
    };
    async.concat = doParallel(_concat);
    async.concatSeries = doSeries(_concat);

    async.whilst = function (test, iterator, callback) {
        if (test()) {
            iterator(function (err) {
                if (err) {
                    return callback(err);
                }
                async.whilst(test, iterator, callback);
            });
        }
        else {
            callback();
        }
    };

    async.doWhilst = function (iterator, test, callback) {
        iterator(function (err) {
            if (err) {
                return callback(err);
            }
            var args = _baseSlice(arguments, 1);
            if (test.apply(null, args)) {
                async.doWhilst(iterator, test, callback);
            }
            else {
                callback();
            }
        });
    };

    async.until = function (test, iterator, callback) {
        if (!test()) {
            iterator(function (err) {
                if (err) {
                    return callback(err);
                }
                async.until(test, iterator, callback);
            });
        }
        else {
            callback();
        }
    };

    async.doUntil = function (iterator, test, callback) {
        iterator(function (err) {
            if (err) {
                return callback(err);
            }
            var args = _baseSlice(arguments, 1);
            if (!test.apply(null, args)) {
                async.doUntil(iterator, test, callback);
            }
            else {
                callback();
            }
        });
    };

    async.queue = function (worker, concurrency) {
        if (concurrency === undefined) {
            concurrency = 1;
        }
        else if(concurrency === 0) {
            throw new Error('Concurrency must not be zero');
        }
        function _insert(q, data, pos, callback) {
          if (!q.started){
            q.started = true;
          }
          if (!_isArray(data)) {
              data = [data];
          }
          if(data.length === 0) {
             // call drain immediately if there are no tasks
             return async.setImmediate(function() {
                 if (q.drain) {
                     q.drain();
                 }
             });
          }
          _each(data, function(task) {
              var item = {
                  data: task,
                  callback: typeof callback === 'function' ? callback : null
              };

              if (pos) {
                q.tasks.unshift(item);
              } else {
                q.tasks.push(item);
              }

              if (q.saturated && q.tasks.length === q.concurrency) {
                  q.saturated();
              }
              async.setImmediate(q.process);
          });
        }

        var workers = 0;
        var q = {
            tasks: [],
            concurrency: concurrency,
            saturated: null,
            empty: null,
            drain: null,
            started: false,
            paused: false,
            push: function (data, callback) {
              _insert(q, data, false, callback);
            },
            kill: function () {
              q.drain = null;
              q.tasks = [];
            },
            unshift: function (data, callback) {
              _insert(q, data, true, callback);
            },
            process: function () {
                if (!q.paused && workers < q.concurrency && q.tasks.length) {
                    var task = q.tasks.shift();
                    if (q.empty && q.tasks.length === 0) {
                        q.empty();
                    }
                    workers += 1;
                    var next = function () {
                        workers -= 1;
                        if (task.callback) {
                            task.callback.apply(task, arguments);
                        }
                        if (q.drain && q.tasks.length + workers === 0) {
                            q.drain();
                        }
                        q.process();
                    };
                    var cb = only_once(next);
                    worker(task.data, cb);
                }
            },
            length: function () {
                return q.tasks.length;
            },
            running: function () {
                return workers;
            },
            idle: function() {
                return q.tasks.length + workers === 0;
            },
            pause: function () {
                if (q.paused === true) { return; }
                q.paused = true;
            },
            resume: function () {
                if (q.paused === false) { return; }
                q.paused = false;
                var resumeCount = Math.min(q.concurrency, q.tasks.length);
                // Need to call q.process once per concurrent
                // worker to preserve full concurrency after pause
                for (var w = 1; w <= resumeCount; w++) {
                    async.setImmediate(q.process);
                }
            }
        };
        return q;
    };

    async.priorityQueue = function (worker, concurrency) {

        function _compareTasks(a, b){
          return a.priority - b.priority;
        }

        function _binarySearch(sequence, item, compare) {
          var beg = -1,
              end = sequence.length - 1;
          while (beg < end) {
            var mid = beg + ((end - beg + 1) >>> 1);
            if (compare(item, sequence[mid]) >= 0) {
              beg = mid;
            } else {
              end = mid - 1;
            }
          }
          return beg;
        }

        function _insert(q, data, priority, callback) {
          if (!q.started){
            q.started = true;
          }
          if (!_isArray(data)) {
              data = [data];
          }
          if(data.length === 0) {
             // call drain immediately if there are no tasks
             return async.setImmediate(function() {
                 if (q.drain) {
                     q.drain();
                 }
             });
          }
          _each(data, function(task) {
              var item = {
                  data: task,
                  priority: priority,
                  callback: typeof callback === 'function' ? callback : null
              };

              q.tasks.splice(_binarySearch(q.tasks, item, _compareTasks) + 1, 0, item);

              if (q.saturated && q.tasks.length === q.concurrency) {
                  q.saturated();
              }
              async.setImmediate(q.process);
          });
        }

        // Start with a normal queue
        var q = async.queue(worker, concurrency);

        // Override push to accept second parameter representing priority
        q.push = function (data, priority, callback) {
          _insert(q, data, priority, callback);
        };

        // Remove unshift function
        delete q.unshift;

        return q;
    };

    async.cargo = function (worker, payload) {
        var working     = false,
            tasks       = [];

        var cargo = {
            tasks: tasks,
            payload: payload,
            saturated: null,
            empty: null,
            drain: null,
            drained: true,
            push: function (data, callback) {
                if (!_isArray(data)) {
                    data = [data];
                }
                _each(data, function(task) {
                    tasks.push({
                        data: task,
                        callback: typeof callback === 'function' ? callback : null
                    });
                    cargo.drained = false;
                    if (cargo.saturated && tasks.length === payload) {
                        cargo.saturated();
                    }
                });
                async.setImmediate(cargo.process);
            },
            process: function process() {
                if (working) return;
                if (tasks.length === 0) {
                    if(cargo.drain && !cargo.drained) cargo.drain();
                    cargo.drained = true;
                    return;
                }

                var ts = typeof payload === 'number' ?
                    tasks.splice(0, payload) :
                    tasks.splice(0, tasks.length);

                var ds = _map(ts, function (task) {
                    return task.data;
                });

                if(cargo.empty) cargo.empty();
                working = true;
                worker(ds, function () {
                    working = false;

                    var args = arguments;
                    _each(ts, function (data) {
                        if (data.callback) {
                            data.callback.apply(null, args);
                        }
                    });

                    process();
                });
            },
            length: function () {
                return tasks.length;
            },
            running: function () {
                return working;
            }
        };
        return cargo;
    };

    var _console_fn = function (name) {
        return function (fn) {
            var args = _baseSlice(arguments, 1);
            fn.apply(null, args.concat([function (err) {
                var args = _baseSlice(arguments, 1);
                if (typeof console !== 'undefined') {
                    if (err) {
                        if (console.error) {
                            console.error(err);
                        }
                    }
                    else if (console[name]) {
                        _each(args, function (x) {
                            console[name](x);
                        });
                    }
                }
            }]));
        };
    };
    async.log = _console_fn('log');
    async.dir = _console_fn('dir');
    /*async.info = _console_fn('info');
    async.warn = _console_fn('warn');
    async.error = _console_fn('error');*/

    async.memoize = function (fn, hasher) {
        var memo = {};
        var queues = {};
        hasher = hasher || function (x) {
            return x;
        };
        var memoized = function () {
            var args = _baseSlice(arguments);
            var callback = args.pop();
            var key = hasher.apply(null, args);
            if (key in memo) {
                async.nextTick(function () {
                    callback.apply(null, memo[key]);
                });
            }
            else if (key in queues) {
                queues[key].push(callback);
            }
            else {
                queues[key] = [callback];
                fn.apply(null, args.concat([function () {
                    memo[key] = _baseSlice(arguments);
                    var q = queues[key];
                    delete queues[key];
                    for (var i = 0, l = q.length; i < l; i++) {
                      q[i].apply(null, arguments);
                    }
                }]));
            }
        };
        memoized.memo = memo;
        memoized.unmemoized = fn;
        return memoized;
    };

    async.unmemoize = function (fn) {
      return function () {
        return (fn.unmemoized || fn).apply(null, arguments);
      };
    };

    async.times = function (count, iterator, callback) {
        var counter = [];
        for (var i = 0; i < count; i++) {
            counter.push(i);
        }
        return async.map(counter, iterator, callback);
    };

    async.timesSeries = function (count, iterator, callback) {
        var counter = [];
        for (var i = 0; i < count; i++) {
            counter.push(i);
        }
        return async.mapSeries(counter, iterator, callback);
    };

    async.seq = function (/* functions... */) {
        var fns = arguments;
        return function () {
            var that = this;
            var args = _baseSlice(arguments);
            var callback = args.pop();
            async.reduce(fns, args, function (newargs, fn, cb) {
                fn.apply(that, newargs.concat([function () {
                    var err = arguments[0];
                    var nextargs = _baseSlice(arguments, 1);
                    cb(err, nextargs);
                }]));
            },
            function (err, results) {
                callback.apply(that, [err].concat(results));
            });
        };
    };

    async.compose = function (/* functions... */) {
      return async.seq.apply(null, Array.prototype.reverse.call(arguments));
    };

    var _applyEach = function (eachfn, fns /*args...*/) {
        var go = function () {
            var that = this;
            var args = _baseSlice(arguments);
            var callback = args.pop();
            return eachfn(fns, function (fn, cb) {
                fn.apply(that, args.concat([cb]));
            },
            callback);
        };
        if (arguments.length > 2) {
            var args = _baseSlice(arguments, 2);
            return go.apply(this, args);
        }
        else {
            return go;
        }
    };
    async.applyEach = doParallel(_applyEach);
    async.applyEachSeries = doSeries(_applyEach);

    async.forever = function (fn, callback) {
        function next(err) {
            if (err) {
                if (callback) {
                    return callback(err);
                }
                throw err;
            }
            fn(next);
        }
        next();
    };

    // Node.js
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = async;
    }
    // AMD / RequireJS
    else if (typeof define !== 'undefined' && define.amd) {
        define([], function () {
            return async;
        });
    }
    // included directly via <script> tag
    else {
        root.async = async;
    }

}());

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"_process":18}],2:[function(require,module,exports){

/**
 * Expose `Emitter`.
 */

if (typeof module !== 'undefined') {
  module.exports = Emitter;
}

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  function on() {
    this.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks['$' + event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks['$' + event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks['$' + event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks['$' + event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};

},{}],3:[function(require,module,exports){
/**
 * Root reference for iframes.
 */

var root;
if (typeof window !== 'undefined') { // Browser window
  root = window;
} else if (typeof self !== 'undefined') { // Web Worker
  root = self;
} else { // Other environments
  console.warn("Using browser-only version of superagent in non-browser environment");
  root = this;
}

var Emitter = require('component-emitter');
var RequestBase = require('./request-base');
var isObject = require('./is-object');
var isFunction = require('./is-function');
var ResponseBase = require('./response-base');
var shouldRetry = require('./should-retry');

/**
 * Noop.
 */

function noop(){};

/**
 * Expose `request`.
 */

var request = exports = module.exports = function(method, url) {
  // callback
  if ('function' == typeof url) {
    return new exports.Request('GET', method).end(url);
  }

  // url first
  if (1 == arguments.length) {
    return new exports.Request('GET', method);
  }

  return new exports.Request(method, url);
}

exports.Request = Request;

/**
 * Determine XHR.
 */

request.getXHR = function () {
  if (root.XMLHttpRequest
      && (!root.location || 'file:' != root.location.protocol
          || !root.ActiveXObject)) {
    return new XMLHttpRequest;
  } else {
    try { return new ActiveXObject('Microsoft.XMLHTTP'); } catch(e) {}
    try { return new ActiveXObject('Msxml2.XMLHTTP.6.0'); } catch(e) {}
    try { return new ActiveXObject('Msxml2.XMLHTTP.3.0'); } catch(e) {}
    try { return new ActiveXObject('Msxml2.XMLHTTP'); } catch(e) {}
  }
  throw Error("Browser-only verison of superagent could not find XHR");
};

/**
 * Removes leading and trailing whitespace, added to support IE.
 *
 * @param {String} s
 * @return {String}
 * @api private
 */

var trim = ''.trim
  ? function(s) { return s.trim(); }
  : function(s) { return s.replace(/(^\s*|\s*$)/g, ''); };

/**
 * Serialize the given `obj`.
 *
 * @param {Object} obj
 * @return {String}
 * @api private
 */

function serialize(obj) {
  if (!isObject(obj)) return obj;
  var pairs = [];
  for (var key in obj) {
    pushEncodedKeyValuePair(pairs, key, obj[key]);
  }
  return pairs.join('&');
}

/**
 * Helps 'serialize' with serializing arrays.
 * Mutates the pairs array.
 *
 * @param {Array} pairs
 * @param {String} key
 * @param {Mixed} val
 */

function pushEncodedKeyValuePair(pairs, key, val) {
  if (val != null) {
    if (Array.isArray(val)) {
      val.forEach(function(v) {
        pushEncodedKeyValuePair(pairs, key, v);
      });
    } else if (isObject(val)) {
      for(var subkey in val) {
        pushEncodedKeyValuePair(pairs, key + '[' + subkey + ']', val[subkey]);
      }
    } else {
      pairs.push(encodeURIComponent(key)
        + '=' + encodeURIComponent(val));
    }
  } else if (val === null) {
    pairs.push(encodeURIComponent(key));
  }
}

/**
 * Expose serialization method.
 */

 request.serializeObject = serialize;

 /**
  * Parse the given x-www-form-urlencoded `str`.
  *
  * @param {String} str
  * @return {Object}
  * @api private
  */

function parseString(str) {
  var obj = {};
  var pairs = str.split('&');
  var pair;
  var pos;

  for (var i = 0, len = pairs.length; i < len; ++i) {
    pair = pairs[i];
    pos = pair.indexOf('=');
    if (pos == -1) {
      obj[decodeURIComponent(pair)] = '';
    } else {
      obj[decodeURIComponent(pair.slice(0, pos))] =
        decodeURIComponent(pair.slice(pos + 1));
    }
  }

  return obj;
}

/**
 * Expose parser.
 */

request.parseString = parseString;

/**
 * Default MIME type map.
 *
 *     superagent.types.xml = 'application/xml';
 *
 */

request.types = {
  html: 'text/html',
  json: 'application/json',
  xml: 'application/xml',
  urlencoded: 'application/x-www-form-urlencoded',
  'form': 'application/x-www-form-urlencoded',
  'form-data': 'application/x-www-form-urlencoded'
};

/**
 * Default serialization map.
 *
 *     superagent.serialize['application/xml'] = function(obj){
 *       return 'generated xml here';
 *     };
 *
 */

 request.serialize = {
   'application/x-www-form-urlencoded': serialize,
   'application/json': JSON.stringify
 };

 /**
  * Default parsers.
  *
  *     superagent.parse['application/xml'] = function(str){
  *       return { object parsed from str };
  *     };
  *
  */

request.parse = {
  'application/x-www-form-urlencoded': parseString,
  'application/json': JSON.parse
};

/**
 * Parse the given header `str` into
 * an object containing the mapped fields.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

function parseHeader(str) {
  var lines = str.split(/\r?\n/);
  var fields = {};
  var index;
  var line;
  var field;
  var val;

  lines.pop(); // trailing CRLF

  for (var i = 0, len = lines.length; i < len; ++i) {
    line = lines[i];
    index = line.indexOf(':');
    field = line.slice(0, index).toLowerCase();
    val = trim(line.slice(index + 1));
    fields[field] = val;
  }

  return fields;
}

/**
 * Check if `mime` is json or has +json structured syntax suffix.
 *
 * @param {String} mime
 * @return {Boolean}
 * @api private
 */

function isJSON(mime) {
  return /[\/+]json\b/.test(mime);
}

/**
 * Initialize a new `Response` with the given `xhr`.
 *
 *  - set flags (.ok, .error, etc)
 *  - parse header
 *
 * Examples:
 *
 *  Aliasing `superagent` as `request` is nice:
 *
 *      request = superagent;
 *
 *  We can use the promise-like API, or pass callbacks:
 *
 *      request.get('/').end(function(res){});
 *      request.get('/', function(res){});
 *
 *  Sending data can be chained:
 *
 *      request
 *        .post('/user')
 *        .send({ name: 'tj' })
 *        .end(function(res){});
 *
 *  Or passed to `.send()`:
 *
 *      request
 *        .post('/user')
 *        .send({ name: 'tj' }, function(res){});
 *
 *  Or passed to `.post()`:
 *
 *      request
 *        .post('/user', { name: 'tj' })
 *        .end(function(res){});
 *
 * Or further reduced to a single call for simple cases:
 *
 *      request
 *        .post('/user', { name: 'tj' }, function(res){});
 *
 * @param {XMLHTTPRequest} xhr
 * @param {Object} options
 * @api private
 */

function Response(req) {
  this.req = req;
  this.xhr = this.req.xhr;
  // responseText is accessible only if responseType is '' or 'text' and on older browsers
  this.text = ((this.req.method !='HEAD' && (this.xhr.responseType === '' || this.xhr.responseType === 'text')) || typeof this.xhr.responseType === 'undefined')
     ? this.xhr.responseText
     : null;
  this.statusText = this.req.xhr.statusText;
  var status = this.xhr.status;
  // handle IE9 bug: http://stackoverflow.com/questions/10046972/msie-returns-status-code-of-1223-for-ajax-request
  if (status === 1223) {
      status = 204;
  }
  this._setStatusProperties(status);
  this.header = this.headers = parseHeader(this.xhr.getAllResponseHeaders());
  // getAllResponseHeaders sometimes falsely returns "" for CORS requests, but
  // getResponseHeader still works. so we get content-type even if getting
  // other headers fails.
  this.header['content-type'] = this.xhr.getResponseHeader('content-type');
  this._setHeaderProperties(this.header);

  if (null === this.text && req._responseType) {
    this.body = this.xhr.response;
  } else {
    this.body = this.req.method != 'HEAD'
      ? this._parseBody(this.text ? this.text : this.xhr.response)
      : null;
  }
}

ResponseBase(Response.prototype);

/**
 * Parse the given body `str`.
 *
 * Used for auto-parsing of bodies. Parsers
 * are defined on the `superagent.parse` object.
 *
 * @param {String} str
 * @return {Mixed}
 * @api private
 */

Response.prototype._parseBody = function(str){
  var parse = request.parse[this.type];
  if(this.req._parser) {
    return this.req._parser(this, str);
  }
  if (!parse && isJSON(this.type)) {
    parse = request.parse['application/json'];
  }
  return parse && str && (str.length || str instanceof Object)
    ? parse(str)
    : null;
};

/**
 * Return an `Error` representative of this response.
 *
 * @return {Error}
 * @api public
 */

Response.prototype.toError = function(){
  var req = this.req;
  var method = req.method;
  var url = req.url;

  var msg = 'cannot ' + method + ' ' + url + ' (' + this.status + ')';
  var err = new Error(msg);
  err.status = this.status;
  err.method = method;
  err.url = url;

  return err;
};

/**
 * Expose `Response`.
 */

request.Response = Response;

/**
 * Initialize a new `Request` with the given `method` and `url`.
 *
 * @param {String} method
 * @param {String} url
 * @api public
 */

function Request(method, url) {
  var self = this;
  this._query = this._query || [];
  this.method = method;
  this.url = url;
  this.header = {}; // preserves header name case
  this._header = {}; // coerces header names to lowercase
  this.on('end', function(){
    var err = null;
    var res = null;

    try {
      res = new Response(self);
    } catch(e) {
      err = new Error('Parser is unable to parse the response');
      err.parse = true;
      err.original = e;
      // issue #675: return the raw response if the response parsing fails
      if (self.xhr) {
        // ie9 doesn't have 'response' property
        err.rawResponse = typeof self.xhr.responseType == 'undefined' ? self.xhr.responseText : self.xhr.response;
        // issue #876: return the http status code if the response parsing fails
        err.status = self.xhr.status ? self.xhr.status : null;
        err.statusCode = err.status; // backwards-compat only
      } else {
        err.rawResponse = null;
        err.status = null;
      }

      return self.callback(err);
    }

    self.emit('response', res);

    var new_err;
    try {
      if (!self._isResponseOK(res)) {
        new_err = new Error(res.statusText || 'Unsuccessful HTTP response');
        new_err.original = err;
        new_err.response = res;
        new_err.status = res.status;
      }
    } catch(e) {
      new_err = e; // #985 touching res may cause INVALID_STATE_ERR on old Android
    }

    // #1000 don't catch errors from the callback to avoid double calling it
    if (new_err) {
      self.callback(new_err, res);
    } else {
      self.callback(null, res);
    }
  });
}

/**
 * Mixin `Emitter` and `RequestBase`.
 */

Emitter(Request.prototype);
RequestBase(Request.prototype);

/**
 * Set Content-Type to `type`, mapping values from `request.types`.
 *
 * Examples:
 *
 *      superagent.types.xml = 'application/xml';
 *
 *      request.post('/')
 *        .type('xml')
 *        .send(xmlstring)
 *        .end(callback);
 *
 *      request.post('/')
 *        .type('application/xml')
 *        .send(xmlstring)
 *        .end(callback);
 *
 * @param {String} type
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.type = function(type){
  this.set('Content-Type', request.types[type] || type);
  return this;
};

/**
 * Set Accept to `type`, mapping values from `request.types`.
 *
 * Examples:
 *
 *      superagent.types.json = 'application/json';
 *
 *      request.get('/agent')
 *        .accept('json')
 *        .end(callback);
 *
 *      request.get('/agent')
 *        .accept('application/json')
 *        .end(callback);
 *
 * @param {String} accept
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.accept = function(type){
  this.set('Accept', request.types[type] || type);
  return this;
};

/**
 * Set Authorization field value with `user` and `pass`.
 *
 * @param {String} user
 * @param {String} [pass] optional in case of using 'bearer' as type
 * @param {Object} options with 'type' property 'auto', 'basic' or 'bearer' (default 'basic')
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.auth = function(user, pass, options){
  if (typeof pass === 'object' && pass !== null) { // pass is optional and can substitute for options
    options = pass;
  }
  if (!options) {
    options = {
      type: 'function' === typeof btoa ? 'basic' : 'auto',
    }
  }

  switch (options.type) {
    case 'basic':
      this.set('Authorization', 'Basic ' + btoa(user + ':' + pass));
    break;

    case 'auto':
      this.username = user;
      this.password = pass;
    break;
      
    case 'bearer': // usage would be .auth(accessToken, { type: 'bearer' })
      this.set('Authorization', 'Bearer ' + user);
    break;  
  }
  return this;
};

/**
 * Add query-string `val`.
 *
 * Examples:
 *
 *   request.get('/shoes')
 *     .query('size=10')
 *     .query({ color: 'blue' })
 *
 * @param {Object|String} val
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.query = function(val){
  if ('string' != typeof val) val = serialize(val);
  if (val) this._query.push(val);
  return this;
};

/**
 * Queue the given `file` as an attachment to the specified `field`,
 * with optional `options` (or filename).
 *
 * ``` js
 * request.post('/upload')
 *   .attach('content', new Blob(['<a id="a"><b id="b">hey!</b></a>'], { type: "text/html"}))
 *   .end(callback);
 * ```
 *
 * @param {String} field
 * @param {Blob|File} file
 * @param {String|Object} options
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.attach = function(field, file, options){
  if (file) {
    if (this._data) {
      throw Error("superagent can't mix .send() and .attach()");
    }

    this._getFormData().append(field, file, options || file.name);
  }
  return this;
};

Request.prototype._getFormData = function(){
  if (!this._formData) {
    this._formData = new root.FormData();
  }
  return this._formData;
};

/**
 * Invoke the callback with `err` and `res`
 * and handle arity check.
 *
 * @param {Error} err
 * @param {Response} res
 * @api private
 */

Request.prototype.callback = function(err, res){
  // console.log(this._retries, this._maxRetries)
  if (this._maxRetries && this._retries++ < this._maxRetries && shouldRetry(err, res)) {
    return this._retry();
  }

  var fn = this._callback;
  this.clearTimeout();

  if (err) {
    if (this._maxRetries) err.retries = this._retries - 1;
    this.emit('error', err);
  }

  fn(err, res);
};

/**
 * Invoke callback with x-domain error.
 *
 * @api private
 */

Request.prototype.crossDomainError = function(){
  var err = new Error('Request has been terminated\nPossible causes: the network is offline, Origin is not allowed by Access-Control-Allow-Origin, the page is being unloaded, etc.');
  err.crossDomain = true;

  err.status = this.status;
  err.method = this.method;
  err.url = this.url;

  this.callback(err);
};

// This only warns, because the request is still likely to work
Request.prototype.buffer = Request.prototype.ca = Request.prototype.agent = function(){
  console.warn("This is not supported in browser version of superagent");
  return this;
};

// This throws, because it can't send/receive data as expected
Request.prototype.pipe = Request.prototype.write = function(){
  throw Error("Streaming is not supported in browser version of superagent");
};

/**
 * Compose querystring to append to req.url
 *
 * @api private
 */

Request.prototype._appendQueryString = function(){
  var query = this._query.join('&');
  if (query) {
    this.url += (this.url.indexOf('?') >= 0 ? '&' : '?') + query;
  }

  if (this._sort) {
    var index = this.url.indexOf('?');
    if (index >= 0) {
      var queryArr = this.url.substring(index + 1).split('&');
      if (isFunction(this._sort)) {
        queryArr.sort(this._sort);
      } else {
        queryArr.sort();
      }
      this.url = this.url.substring(0, index) + '?' + queryArr.join('&');
    }
  }
};

/**
 * Check if `obj` is a host object,
 * we don't want to serialize these :)
 *
 * @param {Object} obj
 * @return {Boolean}
 * @api private
 */
Request.prototype._isHost = function _isHost(obj) {
  // Native objects stringify to [object File], [object Blob], [object FormData], etc.
  return obj && 'object' === typeof obj && !Array.isArray(obj) && Object.prototype.toString.call(obj) !== '[object Object]';
}

/**
 * Initiate request, invoking callback `fn(res)`
 * with an instanceof `Response`.
 *
 * @param {Function} fn
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.end = function(fn){
  if (this._endCalled) {
    console.warn("Warning: .end() was called twice. This is not supported in superagent");
  }
  this._endCalled = true;

  // store callback
  this._callback = fn || noop;

  // querystring
  this._appendQueryString();

  return this._end();
};

Request.prototype._end = function() {
  var self = this;
  var xhr = this.xhr = request.getXHR();
  var data = this._formData || this._data;

  this._setTimeouts();

  // state change
  xhr.onreadystatechange = function(){
    var readyState = xhr.readyState;
    if (readyState >= 2 && self._responseTimeoutTimer) {
      clearTimeout(self._responseTimeoutTimer);
    }
    if (4 != readyState) {
      return;
    }

    // In IE9, reads to any property (e.g. status) off of an aborted XHR will
    // result in the error "Could not complete the operation due to error c00c023f"
    var status;
    try { status = xhr.status } catch(e) { status = 0; }

    if (!status) {
      if (self.timedout || self._aborted) return;
      return self.crossDomainError();
    }
    self.emit('end');
  };

  // progress
  var handleProgress = function(direction, e) {
    if (e.total > 0) {
      e.percent = e.loaded / e.total * 100;
    }
    e.direction = direction;
    self.emit('progress', e);
  }
  if (this.hasListeners('progress')) {
    try {
      xhr.onprogress = handleProgress.bind(null, 'download');
      if (xhr.upload) {
        xhr.upload.onprogress = handleProgress.bind(null, 'upload');
      }
    } catch(e) {
      // Accessing xhr.upload fails in IE from a web worker, so just pretend it doesn't exist.
      // Reported here:
      // https://connect.microsoft.com/IE/feedback/details/837245/xmlhttprequest-upload-throws-invalid-argument-when-used-from-web-worker-context
    }
  }

  // initiate request
  try {
    if (this.username && this.password) {
      xhr.open(this.method, this.url, true, this.username, this.password);
    } else {
      xhr.open(this.method, this.url, true);
    }
  } catch (err) {
    // see #1149
    return this.callback(err);
  }

  // CORS
  if (this._withCredentials) xhr.withCredentials = true;

  // body
  if (!this._formData && 'GET' != this.method && 'HEAD' != this.method && 'string' != typeof data && !this._isHost(data)) {
    // serialize stuff
    var contentType = this._header['content-type'];
    var serialize = this._serializer || request.serialize[contentType ? contentType.split(';')[0] : ''];
    if (!serialize && isJSON(contentType)) {
      serialize = request.serialize['application/json'];
    }
    if (serialize) data = serialize(data);
  }

  // set header fields
  for (var field in this.header) {
    if (null == this.header[field]) continue;

    if (this.header.hasOwnProperty(field))
      xhr.setRequestHeader(field, this.header[field]);
  }

  if (this._responseType) {
    xhr.responseType = this._responseType;
  }

  // send stuff
  this.emit('request', this);

  // IE11 xhr.send(undefined) sends 'undefined' string as POST payload (instead of nothing)
  // We need null here if data is undefined
  xhr.send(typeof data !== 'undefined' ? data : null);
  return this;
};

/**
 * GET `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} [data] or fn
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.get = function(url, data, fn){
  var req = request('GET', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.query(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * HEAD `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} [data] or fn
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.head = function(url, data, fn){
  var req = request('HEAD', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * OPTIONS query to `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} [data] or fn
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.options = function(url, data, fn){
  var req = request('OPTIONS', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * DELETE `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed} [data]
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

function del(url, data, fn){
  var req = request('DELETE', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

request['del'] = del;
request['delete'] = del;

/**
 * PATCH `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed} [data]
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.patch = function(url, data, fn){
  var req = request('PATCH', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * POST `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed} [data]
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.post = function(url, data, fn){
  var req = request('POST', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * PUT `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} [data] or fn
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.put = function(url, data, fn){
  var req = request('PUT', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

},{"./is-function":4,"./is-object":5,"./request-base":6,"./response-base":7,"./should-retry":8,"component-emitter":2}],4:[function(require,module,exports){
/**
 * Check if `fn` is a function.
 *
 * @param {Function} fn
 * @return {Boolean}
 * @api private
 */
var isObject = require('./is-object');

function isFunction(fn) {
  var tag = isObject(fn) ? Object.prototype.toString.call(fn) : '';
  return tag === '[object Function]';
}

module.exports = isFunction;

},{"./is-object":5}],5:[function(require,module,exports){
/**
 * Check if `obj` is an object.
 *
 * @param {Object} obj
 * @return {Boolean}
 * @api private
 */

function isObject(obj) {
  return null !== obj && 'object' === typeof obj;
}

module.exports = isObject;

},{}],6:[function(require,module,exports){
/**
 * Module of mixed-in functions shared between node and client code
 */
var isObject = require('./is-object');

/**
 * Expose `RequestBase`.
 */

module.exports = RequestBase;

/**
 * Initialize a new `RequestBase`.
 *
 * @api public
 */

function RequestBase(obj) {
  if (obj) return mixin(obj);
}

/**
 * Mixin the prototype properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in RequestBase.prototype) {
    obj[key] = RequestBase.prototype[key];
  }
  return obj;
}

/**
 * Clear previous timeout.
 *
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.clearTimeout = function _clearTimeout(){
  clearTimeout(this._timer);
  clearTimeout(this._responseTimeoutTimer);
  delete this._timer;
  delete this._responseTimeoutTimer;
  return this;
};

/**
 * Override default response body parser
 *
 * This function will be called to convert incoming data into request.body
 *
 * @param {Function}
 * @api public
 */

RequestBase.prototype.parse = function parse(fn){
  this._parser = fn;
  return this;
};

/**
 * Set format of binary response body.
 * In browser valid formats are 'blob' and 'arraybuffer',
 * which return Blob and ArrayBuffer, respectively.
 *
 * In Node all values result in Buffer.
 *
 * Examples:
 *
 *      req.get('/')
 *        .responseType('blob')
 *        .end(callback);
 *
 * @param {String} val
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.responseType = function(val){
  this._responseType = val;
  return this;
};

/**
 * Override default request body serializer
 *
 * This function will be called to convert data set via .send or .attach into payload to send
 *
 * @param {Function}
 * @api public
 */

RequestBase.prototype.serialize = function serialize(fn){
  this._serializer = fn;
  return this;
};

/**
 * Set timeouts.
 *
 * - response timeout is time between sending request and receiving the first byte of the response. Includes DNS and connection time.
 * - deadline is the time from start of the request to receiving response body in full. If the deadline is too short large files may not load at all on slow connections.
 *
 * Value of 0 or false means no timeout.
 *
 * @param {Number|Object} ms or {response, read, deadline}
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.timeout = function timeout(options){
  if (!options || 'object' !== typeof options) {
    this._timeout = options;
    this._responseTimeout = 0;
    return this;
  }

  for(var option in options) {
    switch(option) {
      case 'deadline':
        this._timeout = options.deadline;
        break;
      case 'response':
        this._responseTimeout = options.response;
        break;
      default:
        console.warn("Unknown timeout option", option);
    }
  }
  return this;
};

/**
 * Set number of retry attempts on error.
 *
 * Failed requests will be retried 'count' times if timeout or err.code >= 500.
 *
 * @param {Number} count
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.retry = function retry(count){
  // Default to 1 if no count passed or true
  if (arguments.length === 0 || count === true) count = 1;
  if (count <= 0) count = 0;
  this._maxRetries = count;
  this._retries = 0;
  return this;
};

/**
 * Retry request
 *
 * @return {Request} for chaining
 * @api private
 */

RequestBase.prototype._retry = function() {
  this.clearTimeout();

  // node
  if (this.req) {
    this.req = null;
    this.req = this.request();
  }

  this._aborted = false;
  this.timedout = false;

  return this._end();
};

/**
 * Promise support
 *
 * @param {Function} resolve
 * @param {Function} [reject]
 * @return {Request}
 */

RequestBase.prototype.then = function then(resolve, reject) {
  if (!this._fullfilledPromise) {
    var self = this;
    if (this._endCalled) {
      console.warn("Warning: superagent request was sent twice, because both .end() and .then() were called. Never call .end() if you use promises");
    }
    this._fullfilledPromise = new Promise(function(innerResolve, innerReject){
      self.end(function(err, res){
        if (err) innerReject(err); else innerResolve(res);
      });
    });
  }
  return this._fullfilledPromise.then(resolve, reject);
}

RequestBase.prototype.catch = function(cb) {
  return this.then(undefined, cb);
};

/**
 * Allow for extension
 */

RequestBase.prototype.use = function use(fn) {
  fn(this);
  return this;
}

RequestBase.prototype.ok = function(cb) {
  if ('function' !== typeof cb) throw Error("Callback required");
  this._okCallback = cb;
  return this;
};

RequestBase.prototype._isResponseOK = function(res) {
  if (!res) {
    return false;
  }

  if (this._okCallback) {
    return this._okCallback(res);
  }

  return res.status >= 200 && res.status < 300;
};


/**
 * Get request header `field`.
 * Case-insensitive.
 *
 * @param {String} field
 * @return {String}
 * @api public
 */

RequestBase.prototype.get = function(field){
  return this._header[field.toLowerCase()];
};

/**
 * Get case-insensitive header `field` value.
 * This is a deprecated internal API. Use `.get(field)` instead.
 *
 * (getHeader is no longer used internally by the superagent code base)
 *
 * @param {String} field
 * @return {String}
 * @api private
 * @deprecated
 */

RequestBase.prototype.getHeader = RequestBase.prototype.get;

/**
 * Set header `field` to `val`, or multiple fields with one object.
 * Case-insensitive.
 *
 * Examples:
 *
 *      req.get('/')
 *        .set('Accept', 'application/json')
 *        .set('X-API-Key', 'foobar')
 *        .end(callback);
 *
 *      req.get('/')
 *        .set({ Accept: 'application/json', 'X-API-Key': 'foobar' })
 *        .end(callback);
 *
 * @param {String|Object} field
 * @param {String} val
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.set = function(field, val){
  if (isObject(field)) {
    for (var key in field) {
      this.set(key, field[key]);
    }
    return this;
  }
  this._header[field.toLowerCase()] = val;
  this.header[field] = val;
  return this;
};

/**
 * Remove header `field`.
 * Case-insensitive.
 *
 * Example:
 *
 *      req.get('/')
 *        .unset('User-Agent')
 *        .end(callback);
 *
 * @param {String} field
 */
RequestBase.prototype.unset = function(field){
  delete this._header[field.toLowerCase()];
  delete this.header[field];
  return this;
};

/**
 * Write the field `name` and `val`, or multiple fields with one object
 * for "multipart/form-data" request bodies.
 *
 * ``` js
 * request.post('/upload')
 *   .field('foo', 'bar')
 *   .end(callback);
 *
 * request.post('/upload')
 *   .field({ foo: 'bar', baz: 'qux' })
 *   .end(callback);
 * ```
 *
 * @param {String|Object} name
 * @param {String|Blob|File|Buffer|fs.ReadStream} val
 * @return {Request} for chaining
 * @api public
 */
RequestBase.prototype.field = function(name, val) {

  // name should be either a string or an object.
  if (null === name ||  undefined === name) {
    throw new Error('.field(name, val) name can not be empty');
  }

  if (this._data) {
    console.error(".field() can't be used if .send() is used. Please use only .send() or only .field() & .attach()");
  }

  if (isObject(name)) {
    for (var key in name) {
      this.field(key, name[key]);
    }
    return this;
  }

  if (Array.isArray(val)) {
    for (var i in val) {
      this.field(name, val[i]);
    }
    return this;
  }

  // val should be defined now
  if (null === val || undefined === val) {
    throw new Error('.field(name, val) val can not be empty');
  }
  if ('boolean' === typeof val) {
    val = '' + val;
  }
  this._getFormData().append(name, val);
  return this;
};

/**
 * Abort the request, and clear potential timeout.
 *
 * @return {Request}
 * @api public
 */
RequestBase.prototype.abort = function(){
  if (this._aborted) {
    return this;
  }
  this._aborted = true;
  this.xhr && this.xhr.abort(); // browser
  this.req && this.req.abort(); // node
  this.clearTimeout();
  this.emit('abort');
  return this;
};

/**
 * Enable transmission of cookies with x-domain requests.
 *
 * Note that for this to work the origin must not be
 * using "Access-Control-Allow-Origin" with a wildcard,
 * and also must set "Access-Control-Allow-Credentials"
 * to "true".
 *
 * @api public
 */

RequestBase.prototype.withCredentials = function(on){
  // This is browser-only functionality. Node side is no-op.
  if(on==undefined) on = true;
  this._withCredentials = on;
  return this;
};

/**
 * Set the max redirects to `n`. Does noting in browser XHR implementation.
 *
 * @param {Number} n
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.redirects = function(n){
  this._maxRedirects = n;
  return this;
};

/**
 * Convert to a plain javascript object (not JSON string) of scalar properties.
 * Note as this method is designed to return a useful non-this value,
 * it cannot be chained.
 *
 * @return {Object} describing method, url, and data of this request
 * @api public
 */

RequestBase.prototype.toJSON = function(){
  return {
    method: this.method,
    url: this.url,
    data: this._data,
    headers: this._header
  };
};


/**
 * Send `data` as the request body, defaulting the `.type()` to "json" when
 * an object is given.
 *
 * Examples:
 *
 *       // manual json
 *       request.post('/user')
 *         .type('json')
 *         .send('{"name":"tj"}')
 *         .end(callback)
 *
 *       // auto json
 *       request.post('/user')
 *         .send({ name: 'tj' })
 *         .end(callback)
 *
 *       // manual x-www-form-urlencoded
 *       request.post('/user')
 *         .type('form')
 *         .send('name=tj')
 *         .end(callback)
 *
 *       // auto x-www-form-urlencoded
 *       request.post('/user')
 *         .type('form')
 *         .send({ name: 'tj' })
 *         .end(callback)
 *
 *       // defaults to x-www-form-urlencoded
 *      request.post('/user')
 *        .send('name=tobi')
 *        .send('species=ferret')
 *        .end(callback)
 *
 * @param {String|Object} data
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.send = function(data){
  var isObj = isObject(data);
  var type = this._header['content-type'];

  if (this._formData) {
    console.error(".send() can't be used if .attach() or .field() is used. Please use only .send() or only .field() & .attach()");
  }

  if (isObj && !this._data) {
    if (Array.isArray(data)) {
      this._data = [];
    } else if (!this._isHost(data)) {
      this._data = {};
    }
  } else if (data && this._data && this._isHost(this._data)) {
    throw Error("Can't merge these send calls");
  }

  // merge
  if (isObj && isObject(this._data)) {
    for (var key in data) {
      this._data[key] = data[key];
    }
  } else if ('string' == typeof data) {
    // default to x-www-form-urlencoded
    if (!type) this.type('form');
    type = this._header['content-type'];
    if ('application/x-www-form-urlencoded' == type) {
      this._data = this._data
        ? this._data + '&' + data
        : data;
    } else {
      this._data = (this._data || '') + data;
    }
  } else {
    this._data = data;
  }

  if (!isObj || this._isHost(data)) {
    return this;
  }

  // default to json
  if (!type) this.type('json');
  return this;
};


/**
 * Sort `querystring` by the sort function
 *
 *
 * Examples:
 *
 *       // default order
 *       request.get('/user')
 *         .query('name=Nick')
 *         .query('search=Manny')
 *         .sortQuery()
 *         .end(callback)
 *
 *       // customized sort function
 *       request.get('/user')
 *         .query('name=Nick')
 *         .query('search=Manny')
 *         .sortQuery(function(a, b){
 *           return a.length - b.length;
 *         })
 *         .end(callback)
 *
 *
 * @param {Function} sort
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.sortQuery = function(sort) {
  // _sort default to true but otherwise can be a function or boolean
  this._sort = typeof sort === 'undefined' ? true : sort;
  return this;
};

/**
 * Invoke callback with timeout error.
 *
 * @api private
 */

RequestBase.prototype._timeoutError = function(reason, timeout, errno){
  if (this._aborted) {
    return;
  }
  var err = new Error(reason + timeout + 'ms exceeded');
  err.timeout = timeout;
  err.code = 'ECONNABORTED';
  err.errno = errno;
  this.timedout = true;
  this.abort();
  this.callback(err);
};

RequestBase.prototype._setTimeouts = function() {
  var self = this;

  // deadline
  if (this._timeout && !this._timer) {
    this._timer = setTimeout(function(){
      self._timeoutError('Timeout of ', self._timeout, 'ETIME');
    }, this._timeout);
  }
  // response timeout
  if (this._responseTimeout && !this._responseTimeoutTimer) {
    this._responseTimeoutTimer = setTimeout(function(){
      self._timeoutError('Response timeout of ', self._responseTimeout, 'ETIMEDOUT');
    }, this._responseTimeout);
  }
}

},{"./is-object":5}],7:[function(require,module,exports){

/**
 * Module dependencies.
 */

var utils = require('./utils');

/**
 * Expose `ResponseBase`.
 */

module.exports = ResponseBase;

/**
 * Initialize a new `ResponseBase`.
 *
 * @api public
 */

function ResponseBase(obj) {
  if (obj) return mixin(obj);
}

/**
 * Mixin the prototype properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in ResponseBase.prototype) {
    obj[key] = ResponseBase.prototype[key];
  }
  return obj;
}

/**
 * Get case-insensitive `field` value.
 *
 * @param {String} field
 * @return {String}
 * @api public
 */

ResponseBase.prototype.get = function(field){
    return this.header[field.toLowerCase()];
};

/**
 * Set header related properties:
 *
 *   - `.type` the content type without params
 *
 * A response of "Content-Type: text/plain; charset=utf-8"
 * will provide you with a `.type` of "text/plain".
 *
 * @param {Object} header
 * @api private
 */

ResponseBase.prototype._setHeaderProperties = function(header){
    // TODO: moar!
    // TODO: make this a util

    // content-type
    var ct = header['content-type'] || '';
    this.type = utils.type(ct);

    // params
    var params = utils.params(ct);
    for (var key in params) this[key] = params[key];

    this.links = {};

    // links
    try {
        if (header.link) {
            this.links = utils.parseLinks(header.link);
        }
    } catch (err) {
        // ignore
    }
};

/**
 * Set flags such as `.ok` based on `status`.
 *
 * For example a 2xx response will give you a `.ok` of __true__
 * whereas 5xx will be __false__ and `.error` will be __true__. The
 * `.clientError` and `.serverError` are also available to be more
 * specific, and `.statusType` is the class of error ranging from 1..5
 * sometimes useful for mapping respond colors etc.
 *
 * "sugar" properties are also defined for common cases. Currently providing:
 *
 *   - .noContent
 *   - .badRequest
 *   - .unauthorized
 *   - .notAcceptable
 *   - .notFound
 *
 * @param {Number} status
 * @api private
 */

ResponseBase.prototype._setStatusProperties = function(status){
    var type = status / 100 | 0;

    // status / class
    this.status = this.statusCode = status;
    this.statusType = type;

    // basics
    this.info = 1 == type;
    this.ok = 2 == type;
    this.redirect = 3 == type;
    this.clientError = 4 == type;
    this.serverError = 5 == type;
    this.error = (4 == type || 5 == type)
        ? this.toError()
        : false;

    // sugar
    this.accepted = 202 == status;
    this.noContent = 204 == status;
    this.badRequest = 400 == status;
    this.unauthorized = 401 == status;
    this.notAcceptable = 406 == status;
    this.forbidden = 403 == status;
    this.notFound = 404 == status;
};

},{"./utils":9}],8:[function(require,module,exports){
var ERROR_CODES = [
  'ECONNRESET',
  'ETIMEDOUT',
  'EADDRINFO',
  'ESOCKETTIMEDOUT'
];

/**
 * Determine if a request should be retried.
 * (Borrowed from segmentio/superagent-retry)
 *
 * @param {Error} err
 * @param {Response} [res]
 * @returns {Boolean}
 */
module.exports = function shouldRetry(err, res) {
  if (err && err.code && ~ERROR_CODES.indexOf(err.code)) return true;
  if (res && res.status && res.status >= 500) return true;
  // Superagent timeout
  if (err && 'timeout' in err && err.code == 'ECONNABORTED') return true;
  if (err && 'crossDomain' in err) return true;
  return false;
};

},{}],9:[function(require,module,exports){

/**
 * Return the mime type for the given `str`.
 *
 * @param {String} str
 * @return {String}
 * @api private
 */

exports.type = function(str){
  return str.split(/ *; */).shift();
};

/**
 * Return header field parameters.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

exports.params = function(str){
  return str.split(/ *; */).reduce(function(obj, str){
    var parts = str.split(/ *= */);
    var key = parts.shift();
    var val = parts.shift();

    if (key && val) obj[key] = val;
    return obj;
  }, {});
};

/**
 * Parse Link header fields.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

exports.parseLinks = function(str){
  return str.split(/ *, */).reduce(function(obj, str){
    var parts = str.split(/ *; */);
    var url = parts[0].slice(1, -1);
    var rel = parts[1].split(/ *= */)[1].slice(1, -1);
    obj[rel] = url;
    return obj;
  }, {});
};

/**
 * Strip content related fields from `header`.
 *
 * @param {Object} header
 * @return {Object} header
 * @api private
 */

exports.cleanHeader = function(header, shouldStripCookie){
  delete header['content-type'];
  delete header['content-length'];
  delete header['transfer-encoding'];
  delete header['host'];
  if (shouldStripCookie) {
    delete header['cookie'];
  }
  return header;
};
},{}],10:[function(require,module,exports){
function DOMParser(options){
	this.options = options ||{locator:{}};
	
}
DOMParser.prototype.parseFromString = function(source,mimeType){
	var options = this.options;
	var sax =  new XMLReader();
	var domBuilder = options.domBuilder || new DOMHandler();//contentHandler and LexicalHandler
	var errorHandler = options.errorHandler;
	var locator = options.locator;
	var defaultNSMap = options.xmlns||{};
	var entityMap = {'lt':'<','gt':'>','amp':'&','quot':'"','apos':"'"}
	if(locator){
		domBuilder.setDocumentLocator(locator)
	}
	
	sax.errorHandler = buildErrorHandler(errorHandler,domBuilder,locator);
	sax.domBuilder = options.domBuilder || domBuilder;
	if(/\/x?html?$/.test(mimeType)){
		entityMap.nbsp = '\xa0';
		entityMap.copy = '\xa9';
		defaultNSMap['']= 'http://www.w3.org/1999/xhtml';
	}
	defaultNSMap.xml = defaultNSMap.xml || 'http://www.w3.org/XML/1998/namespace';
	if(source){
		sax.parse(source,defaultNSMap,entityMap);
	}else{
		sax.errorHandler.error("invalid doc source");
	}
	return domBuilder.doc;
}
function buildErrorHandler(errorImpl,domBuilder,locator){
	if(!errorImpl){
		if(domBuilder instanceof DOMHandler){
			return domBuilder;
		}
		errorImpl = domBuilder ;
	}
	var errorHandler = {}
	var isCallback = errorImpl instanceof Function;
	locator = locator||{}
	function build(key){
		var fn = errorImpl[key];
		if(!fn && isCallback){
			fn = errorImpl.length == 2?function(msg){errorImpl(key,msg)}:errorImpl;
		}
		errorHandler[key] = fn && function(msg){
			fn('[xmldom '+key+']\t'+msg+_locator(locator));
		}||function(){};
	}
	build('warning');
	build('error');
	build('fatalError');
	return errorHandler;
}

//console.log('#\n\n\n\n\n\n\n####')
/**
 * +ContentHandler+ErrorHandler
 * +LexicalHandler+EntityResolver2
 * -DeclHandler-DTDHandler 
 * 
 * DefaultHandler:EntityResolver, DTDHandler, ContentHandler, ErrorHandler
 * DefaultHandler2:DefaultHandler,LexicalHandler, DeclHandler, EntityResolver2
 * @link http://www.saxproject.org/apidoc/org/xml/sax/helpers/DefaultHandler.html
 */
function DOMHandler() {
    this.cdata = false;
}
function position(locator,node){
	node.lineNumber = locator.lineNumber;
	node.columnNumber = locator.columnNumber;
}
/**
 * @see org.xml.sax.ContentHandler#startDocument
 * @link http://www.saxproject.org/apidoc/org/xml/sax/ContentHandler.html
 */ 
DOMHandler.prototype = {
	startDocument : function() {
    	this.doc = new DOMImplementation().createDocument(null, null, null);
    	if (this.locator) {
        	this.doc.documentURI = this.locator.systemId;
    	}
	},
	startElement:function(namespaceURI, localName, qName, attrs) {
		var doc = this.doc;
	    var el = doc.createElementNS(namespaceURI, qName||localName);
	    var len = attrs.length;
	    appendElement(this, el);
	    this.currentElement = el;
	    
		this.locator && position(this.locator,el)
	    for (var i = 0 ; i < len; i++) {
	        var namespaceURI = attrs.getURI(i);
	        var value = attrs.getValue(i);
	        var qName = attrs.getQName(i);
			var attr = doc.createAttributeNS(namespaceURI, qName);
			this.locator &&position(attrs.getLocator(i),attr);
			attr.value = attr.nodeValue = value;
			el.setAttributeNode(attr)
	    }
	},
	endElement:function(namespaceURI, localName, qName) {
		var current = this.currentElement
		var tagName = current.tagName;
		this.currentElement = current.parentNode;
	},
	startPrefixMapping:function(prefix, uri) {
	},
	endPrefixMapping:function(prefix) {
	},
	processingInstruction:function(target, data) {
	    var ins = this.doc.createProcessingInstruction(target, data);
	    this.locator && position(this.locator,ins)
	    appendElement(this, ins);
	},
	ignorableWhitespace:function(ch, start, length) {
	},
	characters:function(chars, start, length) {
		chars = _toString.apply(this,arguments)
		//console.log(chars)
		if(chars){
			if (this.cdata) {
				var charNode = this.doc.createCDATASection(chars);
			} else {
				var charNode = this.doc.createTextNode(chars);
			}
			if(this.currentElement){
				this.currentElement.appendChild(charNode);
			}else if(/^\s*$/.test(chars)){
				this.doc.appendChild(charNode);
				//process xml
			}
			this.locator && position(this.locator,charNode)
		}
	},
	skippedEntity:function(name) {
	},
	endDocument:function() {
		this.doc.normalize();
	},
	setDocumentLocator:function (locator) {
	    if(this.locator = locator){// && !('lineNumber' in locator)){
	    	locator.lineNumber = 0;
	    }
	},
	//LexicalHandler
	comment:function(chars, start, length) {
		chars = _toString.apply(this,arguments)
	    var comm = this.doc.createComment(chars);
	    this.locator && position(this.locator,comm)
	    appendElement(this, comm);
	},
	
	startCDATA:function() {
	    //used in characters() methods
	    this.cdata = true;
	},
	endCDATA:function() {
	    this.cdata = false;
	},
	
	startDTD:function(name, publicId, systemId) {
		var impl = this.doc.implementation;
	    if (impl && impl.createDocumentType) {
	        var dt = impl.createDocumentType(name, publicId, systemId);
	        this.locator && position(this.locator,dt)
	        appendElement(this, dt);
	    }
	},
	/**
	 * @see org.xml.sax.ErrorHandler
	 * @link http://www.saxproject.org/apidoc/org/xml/sax/ErrorHandler.html
	 */
	warning:function(error) {
		console.warn('[xmldom warning]\t'+error,_locator(this.locator));
	},
	error:function(error) {
		console.error('[xmldom error]\t'+error,_locator(this.locator));
	},
	fatalError:function(error) {
		console.error('[xmldom fatalError]\t'+error,_locator(this.locator));
	    throw error;
	}
}
function _locator(l){
	if(l){
		return '\n@'+(l.systemId ||'')+'#[line:'+l.lineNumber+',col:'+l.columnNumber+']'
	}
}
function _toString(chars,start,length){
	if(typeof chars == 'string'){
		return chars.substr(start,length)
	}else{//java sax connect width xmldom on rhino(what about: "? && !(chars instanceof String)")
		if(chars.length >= start+length || start){
			return new java.lang.String(chars,start,length)+'';
		}
		return chars;
	}
}

/*
 * @link http://www.saxproject.org/apidoc/org/xml/sax/ext/LexicalHandler.html
 * used method of org.xml.sax.ext.LexicalHandler:
 *  #comment(chars, start, length)
 *  #startCDATA()
 *  #endCDATA()
 *  #startDTD(name, publicId, systemId)
 *
 *
 * IGNORED method of org.xml.sax.ext.LexicalHandler:
 *  #endDTD()
 *  #startEntity(name)
 *  #endEntity(name)
 *
 *
 * @link http://www.saxproject.org/apidoc/org/xml/sax/ext/DeclHandler.html
 * IGNORED method of org.xml.sax.ext.DeclHandler
 * 	#attributeDecl(eName, aName, type, mode, value)
 *  #elementDecl(name, model)
 *  #externalEntityDecl(name, publicId, systemId)
 *  #internalEntityDecl(name, value)
 * @link http://www.saxproject.org/apidoc/org/xml/sax/ext/EntityResolver2.html
 * IGNORED method of org.xml.sax.EntityResolver2
 *  #resolveEntity(String name,String publicId,String baseURI,String systemId)
 *  #resolveEntity(publicId, systemId)
 *  #getExternalSubset(name, baseURI)
 * @link http://www.saxproject.org/apidoc/org/xml/sax/DTDHandler.html
 * IGNORED method of org.xml.sax.DTDHandler
 *  #notationDecl(name, publicId, systemId) {};
 *  #unparsedEntityDecl(name, publicId, systemId, notationName) {};
 */
"endDTD,startEntity,endEntity,attributeDecl,elementDecl,externalEntityDecl,internalEntityDecl,resolveEntity,getExternalSubset,notationDecl,unparsedEntityDecl".replace(/\w+/g,function(key){
	DOMHandler.prototype[key] = function(){return null}
})

/* Private static helpers treated below as private instance methods, so don't need to add these to the public API; we might use a Relator to also get rid of non-standard public properties */
function appendElement (hander,node) {
    if (!hander.currentElement) {
        hander.doc.appendChild(node);
    } else {
        hander.currentElement.appendChild(node);
    }
}//appendChild and setAttributeNS are preformance key

//if(typeof require == 'function'){
	var XMLReader = require('./sax').XMLReader;
	var DOMImplementation = exports.DOMImplementation = require('./dom').DOMImplementation;
	exports.XMLSerializer = require('./dom').XMLSerializer ;
	exports.DOMParser = DOMParser;
//}

},{"./dom":11,"./sax":12}],11:[function(require,module,exports){
/*
 * DOM Level 2
 * Object DOMException
 * @see http://www.w3.org/TR/REC-DOM-Level-1/ecma-script-language-binding.html
 * @see http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/ecma-script-binding.html
 */

function copy(src,dest){
	for(var p in src){
		dest[p] = src[p];
	}
}
/**
^\w+\.prototype\.([_\w]+)\s*=\s*((?:.*\{\s*?[\r\n][\s\S]*?^})|\S.*?(?=[;\r\n]));?
^\w+\.prototype\.([_\w]+)\s*=\s*(\S.*?(?=[;\r\n]));?
 */
function _extends(Class,Super){
	var pt = Class.prototype;
	if(Object.create){
		var ppt = Object.create(Super.prototype)
		pt.__proto__ = ppt;
	}
	if(!(pt instanceof Super)){
		function t(){};
		t.prototype = Super.prototype;
		t = new t();
		copy(pt,t);
		Class.prototype = pt = t;
	}
	if(pt.constructor != Class){
		if(typeof Class != 'function'){
			console.error("unknow Class:"+Class)
		}
		pt.constructor = Class
	}
}
var htmlns = 'http://www.w3.org/1999/xhtml' ;
// Node Types
var NodeType = {}
var ELEMENT_NODE                = NodeType.ELEMENT_NODE                = 1;
var ATTRIBUTE_NODE              = NodeType.ATTRIBUTE_NODE              = 2;
var TEXT_NODE                   = NodeType.TEXT_NODE                   = 3;
var CDATA_SECTION_NODE          = NodeType.CDATA_SECTION_NODE          = 4;
var ENTITY_REFERENCE_NODE       = NodeType.ENTITY_REFERENCE_NODE       = 5;
var ENTITY_NODE                 = NodeType.ENTITY_NODE                 = 6;
var PROCESSING_INSTRUCTION_NODE = NodeType.PROCESSING_INSTRUCTION_NODE = 7;
var COMMENT_NODE                = NodeType.COMMENT_NODE                = 8;
var DOCUMENT_NODE               = NodeType.DOCUMENT_NODE               = 9;
var DOCUMENT_TYPE_NODE          = NodeType.DOCUMENT_TYPE_NODE          = 10;
var DOCUMENT_FRAGMENT_NODE      = NodeType.DOCUMENT_FRAGMENT_NODE      = 11;
var NOTATION_NODE               = NodeType.NOTATION_NODE               = 12;

// ExceptionCode
var ExceptionCode = {}
var ExceptionMessage = {};
var INDEX_SIZE_ERR              = ExceptionCode.INDEX_SIZE_ERR              = ((ExceptionMessage[1]="Index size error"),1);
var DOMSTRING_SIZE_ERR          = ExceptionCode.DOMSTRING_SIZE_ERR          = ((ExceptionMessage[2]="DOMString size error"),2);
var HIERARCHY_REQUEST_ERR       = ExceptionCode.HIERARCHY_REQUEST_ERR       = ((ExceptionMessage[3]="Hierarchy request error"),3);
var WRONG_DOCUMENT_ERR          = ExceptionCode.WRONG_DOCUMENT_ERR          = ((ExceptionMessage[4]="Wrong document"),4);
var INVALID_CHARACTER_ERR       = ExceptionCode.INVALID_CHARACTER_ERR       = ((ExceptionMessage[5]="Invalid character"),5);
var NO_DATA_ALLOWED_ERR         = ExceptionCode.NO_DATA_ALLOWED_ERR         = ((ExceptionMessage[6]="No data allowed"),6);
var NO_MODIFICATION_ALLOWED_ERR = ExceptionCode.NO_MODIFICATION_ALLOWED_ERR = ((ExceptionMessage[7]="No modification allowed"),7);
var NOT_FOUND_ERR               = ExceptionCode.NOT_FOUND_ERR               = ((ExceptionMessage[8]="Not found"),8);
var NOT_SUPPORTED_ERR           = ExceptionCode.NOT_SUPPORTED_ERR           = ((ExceptionMessage[9]="Not supported"),9);
var INUSE_ATTRIBUTE_ERR         = ExceptionCode.INUSE_ATTRIBUTE_ERR         = ((ExceptionMessage[10]="Attribute in use"),10);
//level2
var INVALID_STATE_ERR        	= ExceptionCode.INVALID_STATE_ERR        	= ((ExceptionMessage[11]="Invalid state"),11);
var SYNTAX_ERR               	= ExceptionCode.SYNTAX_ERR               	= ((ExceptionMessage[12]="Syntax error"),12);
var INVALID_MODIFICATION_ERR 	= ExceptionCode.INVALID_MODIFICATION_ERR 	= ((ExceptionMessage[13]="Invalid modification"),13);
var NAMESPACE_ERR            	= ExceptionCode.NAMESPACE_ERR           	= ((ExceptionMessage[14]="Invalid namespace"),14);
var INVALID_ACCESS_ERR       	= ExceptionCode.INVALID_ACCESS_ERR      	= ((ExceptionMessage[15]="Invalid access"),15);


function DOMException(code, message) {
	if(message instanceof Error){
		var error = message;
	}else{
		error = this;
		Error.call(this, ExceptionMessage[code]);
		this.message = ExceptionMessage[code];
		if(Error.captureStackTrace) Error.captureStackTrace(this, DOMException);
	}
	error.code = code;
	if(message) this.message = this.message + ": " + message;
	return error;
};
DOMException.prototype = Error.prototype;
copy(ExceptionCode,DOMException)
/**
 * @see http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/core.html#ID-536297177
 * The NodeList interface provides the abstraction of an ordered collection of nodes, without defining or constraining how this collection is implemented. NodeList objects in the DOM are live.
 * The items in the NodeList are accessible via an integral index, starting from 0.
 */
function NodeList() {
};
NodeList.prototype = {
	/**
	 * The number of nodes in the list. The range of valid child node indices is 0 to length-1 inclusive.
	 * @standard level1
	 */
	length:0, 
	/**
	 * Returns the indexth item in the collection. If index is greater than or equal to the number of nodes in the list, this returns null.
	 * @standard level1
	 * @param index  unsigned long 
	 *   Index into the collection.
	 * @return Node
	 * 	The node at the indexth position in the NodeList, or null if that is not a valid index. 
	 */
	item: function(index) {
		return this[index] || null;
	},
	toString:function(isHTML,nodeFilter){
		for(var buf = [], i = 0;i<this.length;i++){
			serializeToString(this[i],buf,isHTML,nodeFilter);
		}
		return buf.join('');
	}
};
function LiveNodeList(node,refresh){
	this._node = node;
	this._refresh = refresh
	_updateLiveList(this);
}
function _updateLiveList(list){
	var inc = list._node._inc || list._node.ownerDocument._inc;
	if(list._inc != inc){
		var ls = list._refresh(list._node);
		//console.log(ls.length)
		__set__(list,'length',ls.length);
		copy(ls,list);
		list._inc = inc;
	}
}
LiveNodeList.prototype.item = function(i){
	_updateLiveList(this);
	return this[i];
}

_extends(LiveNodeList,NodeList);
/**
 * 
 * Objects implementing the NamedNodeMap interface are used to represent collections of nodes that can be accessed by name. Note that NamedNodeMap does not inherit from NodeList; NamedNodeMaps are not maintained in any particular order. Objects contained in an object implementing NamedNodeMap may also be accessed by an ordinal index, but this is simply to allow convenient enumeration of the contents of a NamedNodeMap, and does not imply that the DOM specifies an order to these Nodes.
 * NamedNodeMap objects in the DOM are live.
 * used for attributes or DocumentType entities 
 */
function NamedNodeMap() {
};

function _findNodeIndex(list,node){
	var i = list.length;
	while(i--){
		if(list[i] === node){return i}
	}
}

function _addNamedNode(el,list,newAttr,oldAttr){
	if(oldAttr){
		list[_findNodeIndex(list,oldAttr)] = newAttr;
	}else{
		list[list.length++] = newAttr;
	}
	if(el){
		newAttr.ownerElement = el;
		var doc = el.ownerDocument;
		if(doc){
			oldAttr && _onRemoveAttribute(doc,el,oldAttr);
			_onAddAttribute(doc,el,newAttr);
		}
	}
}
function _removeNamedNode(el,list,attr){
	//console.log('remove attr:'+attr)
	var i = _findNodeIndex(list,attr);
	if(i>=0){
		var lastIndex = list.length-1
		while(i<lastIndex){
			list[i] = list[++i]
		}
		list.length = lastIndex;
		if(el){
			var doc = el.ownerDocument;
			if(doc){
				_onRemoveAttribute(doc,el,attr);
				attr.ownerElement = null;
			}
		}
	}else{
		throw DOMException(NOT_FOUND_ERR,new Error(el.tagName+'@'+attr))
	}
}
NamedNodeMap.prototype = {
	length:0,
	item:NodeList.prototype.item,
	getNamedItem: function(key) {
//		if(key.indexOf(':')>0 || key == 'xmlns'){
//			return null;
//		}
		//console.log()
		var i = this.length;
		while(i--){
			var attr = this[i];
			//console.log(attr.nodeName,key)
			if(attr.nodeName == key){
				return attr;
			}
		}
	},
	setNamedItem: function(attr) {
		var el = attr.ownerElement;
		if(el && el!=this._ownerElement){
			throw new DOMException(INUSE_ATTRIBUTE_ERR);
		}
		var oldAttr = this.getNamedItem(attr.nodeName);
		_addNamedNode(this._ownerElement,this,attr,oldAttr);
		return oldAttr;
	},
	/* returns Node */
	setNamedItemNS: function(attr) {// raises: WRONG_DOCUMENT_ERR,NO_MODIFICATION_ALLOWED_ERR,INUSE_ATTRIBUTE_ERR
		var el = attr.ownerElement, oldAttr;
		if(el && el!=this._ownerElement){
			throw new DOMException(INUSE_ATTRIBUTE_ERR);
		}
		oldAttr = this.getNamedItemNS(attr.namespaceURI,attr.localName);
		_addNamedNode(this._ownerElement,this,attr,oldAttr);
		return oldAttr;
	},

	/* returns Node */
	removeNamedItem: function(key) {
		var attr = this.getNamedItem(key);
		_removeNamedNode(this._ownerElement,this,attr);
		return attr;
		
		
	},// raises: NOT_FOUND_ERR,NO_MODIFICATION_ALLOWED_ERR
	
	//for level2
	removeNamedItemNS:function(namespaceURI,localName){
		var attr = this.getNamedItemNS(namespaceURI,localName);
		_removeNamedNode(this._ownerElement,this,attr);
		return attr;
	},
	getNamedItemNS: function(namespaceURI, localName) {
		var i = this.length;
		while(i--){
			var node = this[i];
			if(node.localName == localName && node.namespaceURI == namespaceURI){
				return node;
			}
		}
		return null;
	}
};
/**
 * @see http://www.w3.org/TR/REC-DOM-Level-1/level-one-core.html#ID-102161490
 */
function DOMImplementation(/* Object */ features) {
	this._features = {};
	if (features) {
		for (var feature in features) {
			 this._features = features[feature];
		}
	}
};

DOMImplementation.prototype = {
	hasFeature: function(/* string */ feature, /* string */ version) {
		var versions = this._features[feature.toLowerCase()];
		if (versions && (!version || version in versions)) {
			return true;
		} else {
			return false;
		}
	},
	// Introduced in DOM Level 2:
	createDocument:function(namespaceURI,  qualifiedName, doctype){// raises:INVALID_CHARACTER_ERR,NAMESPACE_ERR,WRONG_DOCUMENT_ERR
		var doc = new Document();
		doc.implementation = this;
		doc.childNodes = new NodeList();
		doc.doctype = doctype;
		if(doctype){
			doc.appendChild(doctype);
		}
		if(qualifiedName){
			var root = doc.createElementNS(namespaceURI,qualifiedName);
			doc.appendChild(root);
		}
		return doc;
	},
	// Introduced in DOM Level 2:
	createDocumentType:function(qualifiedName, publicId, systemId){// raises:INVALID_CHARACTER_ERR,NAMESPACE_ERR
		var node = new DocumentType();
		node.name = qualifiedName;
		node.nodeName = qualifiedName;
		node.publicId = publicId;
		node.systemId = systemId;
		// Introduced in DOM Level 2:
		//readonly attribute DOMString        internalSubset;
		
		//TODO:..
		//  readonly attribute NamedNodeMap     entities;
		//  readonly attribute NamedNodeMap     notations;
		return node;
	}
};


/**
 * @see http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/core.html#ID-1950641247
 */

function Node() {
};

Node.prototype = {
	firstChild : null,
	lastChild : null,
	previousSibling : null,
	nextSibling : null,
	attributes : null,
	parentNode : null,
	childNodes : null,
	ownerDocument : null,
	nodeValue : null,
	namespaceURI : null,
	prefix : null,
	localName : null,
	// Modified in DOM Level 2:
	insertBefore:function(newChild, refChild){//raises 
		return _insertBefore(this,newChild,refChild);
	},
	replaceChild:function(newChild, oldChild){//raises 
		this.insertBefore(newChild,oldChild);
		if(oldChild){
			this.removeChild(oldChild);
		}
	},
	removeChild:function(oldChild){
		return _removeChild(this,oldChild);
	},
	appendChild:function(newChild){
		return this.insertBefore(newChild,null);
	},
	hasChildNodes:function(){
		return this.firstChild != null;
	},
	cloneNode:function(deep){
		return cloneNode(this.ownerDocument||this,this,deep);
	},
	// Modified in DOM Level 2:
	normalize:function(){
		var child = this.firstChild;
		while(child){
			var next = child.nextSibling;
			if(next && next.nodeType == TEXT_NODE && child.nodeType == TEXT_NODE){
				this.removeChild(next);
				child.appendData(next.data);
			}else{
				child.normalize();
				child = next;
			}
		}
	},
  	// Introduced in DOM Level 2:
	isSupported:function(feature, version){
		return this.ownerDocument.implementation.hasFeature(feature,version);
	},
    // Introduced in DOM Level 2:
    hasAttributes:function(){
    	return this.attributes.length>0;
    },
    lookupPrefix:function(namespaceURI){
    	var el = this;
    	while(el){
    		var map = el._nsMap;
    		//console.dir(map)
    		if(map){
    			for(var n in map){
    				if(map[n] == namespaceURI){
    					return n;
    				}
    			}
    		}
    		el = el.nodeType == ATTRIBUTE_NODE?el.ownerDocument : el.parentNode;
    	}
    	return null;
    },
    // Introduced in DOM Level 3:
    lookupNamespaceURI:function(prefix){
    	var el = this;
    	while(el){
    		var map = el._nsMap;
    		//console.dir(map)
    		if(map){
    			if(prefix in map){
    				return map[prefix] ;
    			}
    		}
    		el = el.nodeType == ATTRIBUTE_NODE?el.ownerDocument : el.parentNode;
    	}
    	return null;
    },
    // Introduced in DOM Level 3:
    isDefaultNamespace:function(namespaceURI){
    	var prefix = this.lookupPrefix(namespaceURI);
    	return prefix == null;
    }
};


function _xmlEncoder(c){
	return c == '<' && '&lt;' ||
         c == '>' && '&gt;' ||
         c == '&' && '&amp;' ||
         c == '"' && '&quot;' ||
         '&#'+c.charCodeAt()+';'
}


copy(NodeType,Node);
copy(NodeType,Node.prototype);

/**
 * @param callback return true for continue,false for break
 * @return boolean true: break visit;
 */
function _visitNode(node,callback){
	if(callback(node)){
		return true;
	}
	if(node = node.firstChild){
		do{
			if(_visitNode(node,callback)){return true}
        }while(node=node.nextSibling)
    }
}



function Document(){
}
function _onAddAttribute(doc,el,newAttr){
	doc && doc._inc++;
	var ns = newAttr.namespaceURI ;
	if(ns == 'http://www.w3.org/2000/xmlns/'){
		//update namespace
		el._nsMap[newAttr.prefix?newAttr.localName:''] = newAttr.value
	}
}
function _onRemoveAttribute(doc,el,newAttr,remove){
	doc && doc._inc++;
	var ns = newAttr.namespaceURI ;
	if(ns == 'http://www.w3.org/2000/xmlns/'){
		//update namespace
		delete el._nsMap[newAttr.prefix?newAttr.localName:'']
	}
}
function _onUpdateChild(doc,el,newChild){
	if(doc && doc._inc){
		doc._inc++;
		//update childNodes
		var cs = el.childNodes;
		if(newChild){
			cs[cs.length++] = newChild;
		}else{
			//console.log(1)
			var child = el.firstChild;
			var i = 0;
			while(child){
				cs[i++] = child;
				child =child.nextSibling;
			}
			cs.length = i;
		}
	}
}

/**
 * attributes;
 * children;
 * 
 * writeable properties:
 * nodeValue,Attr:value,CharacterData:data
 * prefix
 */
function _removeChild(parentNode,child){
	var previous = child.previousSibling;
	var next = child.nextSibling;
	if(previous){
		previous.nextSibling = next;
	}else{
		parentNode.firstChild = next
	}
	if(next){
		next.previousSibling = previous;
	}else{
		parentNode.lastChild = previous;
	}
	_onUpdateChild(parentNode.ownerDocument,parentNode);
	return child;
}
/**
 * preformance key(refChild == null)
 */
function _insertBefore(parentNode,newChild,nextChild){
	var cp = newChild.parentNode;
	if(cp){
		cp.removeChild(newChild);//remove and update
	}
	if(newChild.nodeType === DOCUMENT_FRAGMENT_NODE){
		var newFirst = newChild.firstChild;
		if (newFirst == null) {
			return newChild;
		}
		var newLast = newChild.lastChild;
	}else{
		newFirst = newLast = newChild;
	}
	var pre = nextChild ? nextChild.previousSibling : parentNode.lastChild;

	newFirst.previousSibling = pre;
	newLast.nextSibling = nextChild;
	
	
	if(pre){
		pre.nextSibling = newFirst;
	}else{
		parentNode.firstChild = newFirst;
	}
	if(nextChild == null){
		parentNode.lastChild = newLast;
	}else{
		nextChild.previousSibling = newLast;
	}
	do{
		newFirst.parentNode = parentNode;
	}while(newFirst !== newLast && (newFirst= newFirst.nextSibling))
	_onUpdateChild(parentNode.ownerDocument||parentNode,parentNode);
	//console.log(parentNode.lastChild.nextSibling == null)
	if (newChild.nodeType == DOCUMENT_FRAGMENT_NODE) {
		newChild.firstChild = newChild.lastChild = null;
	}
	return newChild;
}
function _appendSingleChild(parentNode,newChild){
	var cp = newChild.parentNode;
	if(cp){
		var pre = parentNode.lastChild;
		cp.removeChild(newChild);//remove and update
		var pre = parentNode.lastChild;
	}
	var pre = parentNode.lastChild;
	newChild.parentNode = parentNode;
	newChild.previousSibling = pre;
	newChild.nextSibling = null;
	if(pre){
		pre.nextSibling = newChild;
	}else{
		parentNode.firstChild = newChild;
	}
	parentNode.lastChild = newChild;
	_onUpdateChild(parentNode.ownerDocument,parentNode,newChild);
	return newChild;
	//console.log("__aa",parentNode.lastChild.nextSibling == null)
}
Document.prototype = {
	//implementation : null,
	nodeName :  '#document',
	nodeType :  DOCUMENT_NODE,
	doctype :  null,
	documentElement :  null,
	_inc : 1,
	
	insertBefore :  function(newChild, refChild){//raises 
		if(newChild.nodeType == DOCUMENT_FRAGMENT_NODE){
			var child = newChild.firstChild;
			while(child){
				var next = child.nextSibling;
				this.insertBefore(child,refChild);
				child = next;
			}
			return newChild;
		}
		if(this.documentElement == null && newChild.nodeType == ELEMENT_NODE){
			this.documentElement = newChild;
		}
		
		return _insertBefore(this,newChild,refChild),(newChild.ownerDocument = this),newChild;
	},
	removeChild :  function(oldChild){
		if(this.documentElement == oldChild){
			this.documentElement = null;
		}
		return _removeChild(this,oldChild);
	},
	// Introduced in DOM Level 2:
	importNode : function(importedNode,deep){
		return importNode(this,importedNode,deep);
	},
	// Introduced in DOM Level 2:
	getElementById :	function(id){
		var rtv = null;
		_visitNode(this.documentElement,function(node){
			if(node.nodeType == ELEMENT_NODE){
				if(node.getAttribute('id') == id){
					rtv = node;
					return true;
				}
			}
		})
		return rtv;
	},
	
	//document factory method:
	createElement :	function(tagName){
		var node = new Element();
		node.ownerDocument = this;
		node.nodeName = tagName;
		node.tagName = tagName;
		node.childNodes = new NodeList();
		var attrs	= node.attributes = new NamedNodeMap();
		attrs._ownerElement = node;
		return node;
	},
	createDocumentFragment :	function(){
		var node = new DocumentFragment();
		node.ownerDocument = this;
		node.childNodes = new NodeList();
		return node;
	},
	createTextNode :	function(data){
		var node = new Text();
		node.ownerDocument = this;
		node.appendData(data)
		return node;
	},
	createComment :	function(data){
		var node = new Comment();
		node.ownerDocument = this;
		node.appendData(data)
		return node;
	},
	createCDATASection :	function(data){
		var node = new CDATASection();
		node.ownerDocument = this;
		node.appendData(data)
		return node;
	},
	createProcessingInstruction :	function(target,data){
		var node = new ProcessingInstruction();
		node.ownerDocument = this;
		node.tagName = node.target = target;
		node.nodeValue= node.data = data;
		return node;
	},
	createAttribute :	function(name){
		var node = new Attr();
		node.ownerDocument	= this;
		node.name = name;
		node.nodeName	= name;
		node.localName = name;
		node.specified = true;
		return node;
	},
	createEntityReference :	function(name){
		var node = new EntityReference();
		node.ownerDocument	= this;
		node.nodeName	= name;
		return node;
	},
	// Introduced in DOM Level 2:
	createElementNS :	function(namespaceURI,qualifiedName){
		var node = new Element();
		var pl = qualifiedName.split(':');
		var attrs	= node.attributes = new NamedNodeMap();
		node.childNodes = new NodeList();
		node.ownerDocument = this;
		node.nodeName = qualifiedName;
		node.tagName = qualifiedName;
		node.namespaceURI = namespaceURI;
		if(pl.length == 2){
			node.prefix = pl[0];
			node.localName = pl[1];
		}else{
			//el.prefix = null;
			node.localName = qualifiedName;
		}
		attrs._ownerElement = node;
		return node;
	},
	// Introduced in DOM Level 2:
	createAttributeNS :	function(namespaceURI,qualifiedName){
		var node = new Attr();
		var pl = qualifiedName.split(':');
		node.ownerDocument = this;
		node.nodeName = qualifiedName;
		node.name = qualifiedName;
		node.namespaceURI = namespaceURI;
		node.specified = true;
		if(pl.length == 2){
			node.prefix = pl[0];
			node.localName = pl[1];
		}else{
			//el.prefix = null;
			node.localName = qualifiedName;
		}
		return node;
	}
};
_extends(Document,Node);


function Element() {
	this._nsMap = {};
};
Element.prototype = {
	nodeType : ELEMENT_NODE,
	hasAttribute : function(name){
		return this.getAttributeNode(name)!=null;
	},
	getAttribute : function(name){
		var attr = this.getAttributeNode(name);
		return attr && attr.value || '';
	},
	getAttributeNode : function(name){
		return this.attributes.getNamedItem(name);
	},
	setAttribute : function(name, value){
		var attr = this.ownerDocument.createAttribute(name);
		attr.value = attr.nodeValue = "" + value;
		this.setAttributeNode(attr)
	},
	removeAttribute : function(name){
		var attr = this.getAttributeNode(name)
		attr && this.removeAttributeNode(attr);
	},
	
	//four real opeartion method
	appendChild:function(newChild){
		if(newChild.nodeType === DOCUMENT_FRAGMENT_NODE){
			return this.insertBefore(newChild,null);
		}else{
			return _appendSingleChild(this,newChild);
		}
	},
	setAttributeNode : function(newAttr){
		return this.attributes.setNamedItem(newAttr);
	},
	setAttributeNodeNS : function(newAttr){
		return this.attributes.setNamedItemNS(newAttr);
	},
	removeAttributeNode : function(oldAttr){
		//console.log(this == oldAttr.ownerElement)
		return this.attributes.removeNamedItem(oldAttr.nodeName);
	},
	//get real attribute name,and remove it by removeAttributeNode
	removeAttributeNS : function(namespaceURI, localName){
		var old = this.getAttributeNodeNS(namespaceURI, localName);
		old && this.removeAttributeNode(old);
	},
	
	hasAttributeNS : function(namespaceURI, localName){
		return this.getAttributeNodeNS(namespaceURI, localName)!=null;
	},
	getAttributeNS : function(namespaceURI, localName){
		var attr = this.getAttributeNodeNS(namespaceURI, localName);
		return attr && attr.value || '';
	},
	setAttributeNS : function(namespaceURI, qualifiedName, value){
		var attr = this.ownerDocument.createAttributeNS(namespaceURI, qualifiedName);
		attr.value = attr.nodeValue = "" + value;
		this.setAttributeNode(attr)
	},
	getAttributeNodeNS : function(namespaceURI, localName){
		return this.attributes.getNamedItemNS(namespaceURI, localName);
	},
	
	getElementsByTagName : function(tagName){
		return new LiveNodeList(this,function(base){
			var ls = [];
			_visitNode(base,function(node){
				if(node !== base && node.nodeType == ELEMENT_NODE && (tagName === '*' || node.tagName == tagName)){
					ls.push(node);
				}
			});
			return ls;
		});
	},
	getElementsByTagNameNS : function(namespaceURI, localName){
		return new LiveNodeList(this,function(base){
			var ls = [];
			_visitNode(base,function(node){
				if(node !== base && node.nodeType === ELEMENT_NODE && (namespaceURI === '*' || node.namespaceURI === namespaceURI) && (localName === '*' || node.localName == localName)){
					ls.push(node);
				}
			});
			return ls;
			
		});
	}
};
Document.prototype.getElementsByTagName = Element.prototype.getElementsByTagName;
Document.prototype.getElementsByTagNameNS = Element.prototype.getElementsByTagNameNS;


_extends(Element,Node);
function Attr() {
};
Attr.prototype.nodeType = ATTRIBUTE_NODE;
_extends(Attr,Node);


function CharacterData() {
};
CharacterData.prototype = {
	data : '',
	substringData : function(offset, count) {
		return this.data.substring(offset, offset+count);
	},
	appendData: function(text) {
		text = this.data+text;
		this.nodeValue = this.data = text;
		this.length = text.length;
	},
	insertData: function(offset,text) {
		this.replaceData(offset,0,text);
	
	},
	appendChild:function(newChild){
		throw new Error(ExceptionMessage[HIERARCHY_REQUEST_ERR])
	},
	deleteData: function(offset, count) {
		this.replaceData(offset,count,"");
	},
	replaceData: function(offset, count, text) {
		var start = this.data.substring(0,offset);
		var end = this.data.substring(offset+count);
		text = start + text + end;
		this.nodeValue = this.data = text;
		this.length = text.length;
	}
}
_extends(CharacterData,Node);
function Text() {
};
Text.prototype = {
	nodeName : "#text",
	nodeType : TEXT_NODE,
	splitText : function(offset) {
		var text = this.data;
		var newText = text.substring(offset);
		text = text.substring(0, offset);
		this.data = this.nodeValue = text;
		this.length = text.length;
		var newNode = this.ownerDocument.createTextNode(newText);
		if(this.parentNode){
			this.parentNode.insertBefore(newNode, this.nextSibling);
		}
		return newNode;
	}
}
_extends(Text,CharacterData);
function Comment() {
};
Comment.prototype = {
	nodeName : "#comment",
	nodeType : COMMENT_NODE
}
_extends(Comment,CharacterData);

function CDATASection() {
};
CDATASection.prototype = {
	nodeName : "#cdata-section",
	nodeType : CDATA_SECTION_NODE
}
_extends(CDATASection,CharacterData);


function DocumentType() {
};
DocumentType.prototype.nodeType = DOCUMENT_TYPE_NODE;
_extends(DocumentType,Node);

function Notation() {
};
Notation.prototype.nodeType = NOTATION_NODE;
_extends(Notation,Node);

function Entity() {
};
Entity.prototype.nodeType = ENTITY_NODE;
_extends(Entity,Node);

function EntityReference() {
};
EntityReference.prototype.nodeType = ENTITY_REFERENCE_NODE;
_extends(EntityReference,Node);

function DocumentFragment() {
};
DocumentFragment.prototype.nodeName =	"#document-fragment";
DocumentFragment.prototype.nodeType =	DOCUMENT_FRAGMENT_NODE;
_extends(DocumentFragment,Node);


function ProcessingInstruction() {
}
ProcessingInstruction.prototype.nodeType = PROCESSING_INSTRUCTION_NODE;
_extends(ProcessingInstruction,Node);
function XMLSerializer(){}
XMLSerializer.prototype.serializeToString = function(node,isHtml,nodeFilter){
	return nodeSerializeToString.call(node,isHtml,nodeFilter);
}
Node.prototype.toString = nodeSerializeToString;
function nodeSerializeToString(isHtml,nodeFilter){
	var buf = [];
	var refNode = this.nodeType == 9?this.documentElement:this;
	var prefix = refNode.prefix;
	var uri = refNode.namespaceURI;
	
	if(uri && prefix == null){
		//console.log(prefix)
		var prefix = refNode.lookupPrefix(uri);
		if(prefix == null){
			//isHTML = true;
			var visibleNamespaces=[
			{namespace:uri,prefix:null}
			//{namespace:uri,prefix:''}
			]
		}
	}
	serializeToString(this,buf,isHtml,nodeFilter,visibleNamespaces);
	//console.log('###',this.nodeType,uri,prefix,buf.join(''))
	return buf.join('');
}
function needNamespaceDefine(node,isHTML, visibleNamespaces) {
	var prefix = node.prefix||'';
	var uri = node.namespaceURI;
	if (!prefix && !uri){
		return false;
	}
	if (prefix === "xml" && uri === "http://www.w3.org/XML/1998/namespace" 
		|| uri == 'http://www.w3.org/2000/xmlns/'){
		return false;
	}
	
	var i = visibleNamespaces.length 
	//console.log('@@@@',node.tagName,prefix,uri,visibleNamespaces)
	while (i--) {
		var ns = visibleNamespaces[i];
		// get namespace prefix
		//console.log(node.nodeType,node.tagName,ns.prefix,prefix)
		if (ns.prefix == prefix){
			return ns.namespace != uri;
		}
	}
	//console.log(isHTML,uri,prefix=='')
	//if(isHTML && prefix ==null && uri == 'http://www.w3.org/1999/xhtml'){
	//	return false;
	//}
	//node.flag = '11111'
	//console.error(3,true,node.flag,node.prefix,node.namespaceURI)
	return true;
}
function serializeToString(node,buf,isHTML,nodeFilter,visibleNamespaces){
	if(nodeFilter){
		node = nodeFilter(node);
		if(node){
			if(typeof node == 'string'){
				buf.push(node);
				return;
			}
		}else{
			return;
		}
		//buf.sort.apply(attrs, attributeSorter);
	}
	switch(node.nodeType){
	case ELEMENT_NODE:
		if (!visibleNamespaces) visibleNamespaces = [];
		var startVisibleNamespaces = visibleNamespaces.length;
		var attrs = node.attributes;
		var len = attrs.length;
		var child = node.firstChild;
		var nodeName = node.tagName;
		
		isHTML =  (htmlns === node.namespaceURI) ||isHTML 
		buf.push('<',nodeName);
		
		
		
		for(var i=0;i<len;i++){
			// add namespaces for attributes
			var attr = attrs.item(i);
			if (attr.prefix == 'xmlns') {
				visibleNamespaces.push({ prefix: attr.localName, namespace: attr.value });
			}else if(attr.nodeName == 'xmlns'){
				visibleNamespaces.push({ prefix: '', namespace: attr.value });
			}
		}
		for(var i=0;i<len;i++){
			var attr = attrs.item(i);
			if (needNamespaceDefine(attr,isHTML, visibleNamespaces)) {
				var prefix = attr.prefix||'';
				var uri = attr.namespaceURI;
				var ns = prefix ? ' xmlns:' + prefix : " xmlns";
				buf.push(ns, '="' , uri , '"');
				visibleNamespaces.push({ prefix: prefix, namespace:uri });
			}
			serializeToString(attr,buf,isHTML,nodeFilter,visibleNamespaces);
		}
		// add namespace for current node		
		if (needNamespaceDefine(node,isHTML, visibleNamespaces)) {
			var prefix = node.prefix||'';
			var uri = node.namespaceURI;
			var ns = prefix ? ' xmlns:' + prefix : " xmlns";
			buf.push(ns, '="' , uri , '"');
			visibleNamespaces.push({ prefix: prefix, namespace:uri });
		}
		
		if(child || isHTML && !/^(?:meta|link|img|br|hr|input)$/i.test(nodeName)){
			buf.push('>');
			//if is cdata child node
			if(isHTML && /^script$/i.test(nodeName)){
				while(child){
					if(child.data){
						buf.push(child.data);
					}else{
						serializeToString(child,buf,isHTML,nodeFilter,visibleNamespaces);
					}
					child = child.nextSibling;
				}
			}else
			{
				while(child){
					serializeToString(child,buf,isHTML,nodeFilter,visibleNamespaces);
					child = child.nextSibling;
				}
			}
			buf.push('</',nodeName,'>');
		}else{
			buf.push('/>');
		}
		// remove added visible namespaces
		//visibleNamespaces.length = startVisibleNamespaces;
		return;
	case DOCUMENT_NODE:
	case DOCUMENT_FRAGMENT_NODE:
		var child = node.firstChild;
		while(child){
			serializeToString(child,buf,isHTML,nodeFilter,visibleNamespaces);
			child = child.nextSibling;
		}
		return;
	case ATTRIBUTE_NODE:
		return buf.push(' ',node.name,'="',node.value.replace(/[<&"]/g,_xmlEncoder),'"');
	case TEXT_NODE:
		return buf.push(node.data.replace(/[<&]/g,_xmlEncoder));
	case CDATA_SECTION_NODE:
		return buf.push( '<![CDATA[',node.data,']]>');
	case COMMENT_NODE:
		return buf.push( "<!--",node.data,"-->");
	case DOCUMENT_TYPE_NODE:
		var pubid = node.publicId;
		var sysid = node.systemId;
		buf.push('<!DOCTYPE ',node.name);
		if(pubid){
			buf.push(' PUBLIC "',pubid);
			if (sysid && sysid!='.') {
				buf.push( '" "',sysid);
			}
			buf.push('">');
		}else if(sysid && sysid!='.'){
			buf.push(' SYSTEM "',sysid,'">');
		}else{
			var sub = node.internalSubset;
			if(sub){
				buf.push(" [",sub,"]");
			}
			buf.push(">");
		}
		return;
	case PROCESSING_INSTRUCTION_NODE:
		return buf.push( "<?",node.target," ",node.data,"?>");
	case ENTITY_REFERENCE_NODE:
		return buf.push( '&',node.nodeName,';');
	//case ENTITY_NODE:
	//case NOTATION_NODE:
	default:
		buf.push('??',node.nodeName);
	}
}
function importNode(doc,node,deep){
	var node2;
	switch (node.nodeType) {
	case ELEMENT_NODE:
		node2 = node.cloneNode(false);
		node2.ownerDocument = doc;
		//var attrs = node2.attributes;
		//var len = attrs.length;
		//for(var i=0;i<len;i++){
			//node2.setAttributeNodeNS(importNode(doc,attrs.item(i),deep));
		//}
	case DOCUMENT_FRAGMENT_NODE:
		break;
	case ATTRIBUTE_NODE:
		deep = true;
		break;
	//case ENTITY_REFERENCE_NODE:
	//case PROCESSING_INSTRUCTION_NODE:
	////case TEXT_NODE:
	//case CDATA_SECTION_NODE:
	//case COMMENT_NODE:
	//	deep = false;
	//	break;
	//case DOCUMENT_NODE:
	//case DOCUMENT_TYPE_NODE:
	//cannot be imported.
	//case ENTITY_NODE:
	//case NOTATION_NODE：
	//can not hit in level3
	//default:throw e;
	}
	if(!node2){
		node2 = node.cloneNode(false);//false
	}
	node2.ownerDocument = doc;
	node2.parentNode = null;
	if(deep){
		var child = node.firstChild;
		while(child){
			node2.appendChild(importNode(doc,child,deep));
			child = child.nextSibling;
		}
	}
	return node2;
}
//
//var _relationMap = {firstChild:1,lastChild:1,previousSibling:1,nextSibling:1,
//					attributes:1,childNodes:1,parentNode:1,documentElement:1,doctype,};
function cloneNode(doc,node,deep){
	var node2 = new node.constructor();
	for(var n in node){
		var v = node[n];
		if(typeof v != 'object' ){
			if(v != node2[n]){
				node2[n] = v;
			}
		}
	}
	if(node.childNodes){
		node2.childNodes = new NodeList();
	}
	node2.ownerDocument = doc;
	switch (node2.nodeType) {
	case ELEMENT_NODE:
		var attrs	= node.attributes;
		var attrs2	= node2.attributes = new NamedNodeMap();
		var len = attrs.length
		attrs2._ownerElement = node2;
		for(var i=0;i<len;i++){
			node2.setAttributeNode(cloneNode(doc,attrs.item(i),true));
		}
		break;;
	case ATTRIBUTE_NODE:
		deep = true;
	}
	if(deep){
		var child = node.firstChild;
		while(child){
			node2.appendChild(cloneNode(doc,child,deep));
			child = child.nextSibling;
		}
	}
	return node2;
}

function __set__(object,key,value){
	object[key] = value
}
//do dynamic
try{
	if(Object.defineProperty){
		Object.defineProperty(LiveNodeList.prototype,'length',{
			get:function(){
				_updateLiveList(this);
				return this.$$length;
			}
		});
		Object.defineProperty(Node.prototype,'textContent',{
			get:function(){
				return getTextContent(this);
			},
			set:function(data){
				switch(this.nodeType){
				case ELEMENT_NODE:
				case DOCUMENT_FRAGMENT_NODE:
					while(this.firstChild){
						this.removeChild(this.firstChild);
					}
					if(data || String(data)){
						this.appendChild(this.ownerDocument.createTextNode(data));
					}
					break;
				default:
					//TODO:
					this.data = data;
					this.value = data;
					this.nodeValue = data;
				}
			}
		})
		
		function getTextContent(node){
			switch(node.nodeType){
			case ELEMENT_NODE:
			case DOCUMENT_FRAGMENT_NODE:
				var buf = [];
				node = node.firstChild;
				while(node){
					if(node.nodeType!==7 && node.nodeType !==8){
						buf.push(getTextContent(node));
					}
					node = node.nextSibling;
				}
				return buf.join('');
			default:
				return node.nodeValue;
			}
		}
		__set__ = function(object,key,value){
			//console.log(value)
			object['$$'+key] = value
		}
	}
}catch(e){//ie8
}

//if(typeof require == 'function'){
	exports.DOMImplementation = DOMImplementation;
	exports.XMLSerializer = XMLSerializer;
//}

},{}],12:[function(require,module,exports){
//[4]   	NameStartChar	   ::=   	":" | [A-Z] | "_" | [a-z] | [#xC0-#xD6] | [#xD8-#xF6] | [#xF8-#x2FF] | [#x370-#x37D] | [#x37F-#x1FFF] | [#x200C-#x200D] | [#x2070-#x218F] | [#x2C00-#x2FEF] | [#x3001-#xD7FF] | [#xF900-#xFDCF] | [#xFDF0-#xFFFD] | [#x10000-#xEFFFF]
//[4a]   	NameChar	   ::=   	NameStartChar | "-" | "." | [0-9] | #xB7 | [#x0300-#x036F] | [#x203F-#x2040]
//[5]   	Name	   ::=   	NameStartChar (NameChar)*
var nameStartChar = /[A-Z_a-z\xC0-\xD6\xD8-\xF6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]///\u10000-\uEFFFF
var nameChar = new RegExp("[\\-\\.0-9"+nameStartChar.source.slice(1,-1)+"\\u00B7\\u0300-\\u036F\\u203F-\\u2040]");
var tagNamePattern = new RegExp('^'+nameStartChar.source+nameChar.source+'*(?:\:'+nameStartChar.source+nameChar.source+'*)?$');
//var tagNamePattern = /^[a-zA-Z_][\w\-\.]*(?:\:[a-zA-Z_][\w\-\.]*)?$/
//var handlers = 'resolveEntity,getExternalSubset,characters,endDocument,endElement,endPrefixMapping,ignorableWhitespace,processingInstruction,setDocumentLocator,skippedEntity,startDocument,startElement,startPrefixMapping,notationDecl,unparsedEntityDecl,error,fatalError,warning,attributeDecl,elementDecl,externalEntityDecl,internalEntityDecl,comment,endCDATA,endDTD,endEntity,startCDATA,startDTD,startEntity'.split(',')

//S_TAG,	S_ATTR,	S_EQ,	S_ATTR_NOQUOT_VALUE
//S_ATTR_SPACE,	S_ATTR_END,	S_TAG_SPACE, S_TAG_CLOSE
var S_TAG = 0;//tag name offerring
var S_ATTR = 1;//attr name offerring 
var S_ATTR_SPACE=2;//attr name end and space offer
var S_EQ = 3;//=space?
var S_ATTR_NOQUOT_VALUE = 4;//attr value(no quot value only)
var S_ATTR_END = 5;//attr value end and no space(quot end)
var S_TAG_SPACE = 6;//(attr value end || tag end ) && (space offer)
var S_TAG_CLOSE = 7;//closed el<el />

function XMLReader(){
	
}

XMLReader.prototype = {
	parse:function(source,defaultNSMap,entityMap){
		var domBuilder = this.domBuilder;
		domBuilder.startDocument();
		_copy(defaultNSMap ,defaultNSMap = {})
		parse(source,defaultNSMap,entityMap,
				domBuilder,this.errorHandler);
		domBuilder.endDocument();
	}
}
function parse(source,defaultNSMapCopy,entityMap,domBuilder,errorHandler){
	function fixedFromCharCode(code) {
		// String.prototype.fromCharCode does not supports
		// > 2 bytes unicode chars directly
		if (code > 0xffff) {
			code -= 0x10000;
			var surrogate1 = 0xd800 + (code >> 10)
				, surrogate2 = 0xdc00 + (code & 0x3ff);

			return String.fromCharCode(surrogate1, surrogate2);
		} else {
			return String.fromCharCode(code);
		}
	}
	function entityReplacer(a){
		var k = a.slice(1,-1);
		if(k in entityMap){
			return entityMap[k]; 
		}else if(k.charAt(0) === '#'){
			return fixedFromCharCode(parseInt(k.substr(1).replace('x','0x')))
		}else{
			errorHandler.error('entity not found:'+a);
			return a;
		}
	}
	function appendText(end){//has some bugs
		if(end>start){
			var xt = source.substring(start,end).replace(/&#?\w+;/g,entityReplacer);
			locator&&position(start);
			domBuilder.characters(xt,0,end-start);
			start = end
		}
	}
	function position(p,m){
		while(p>=lineEnd && (m = linePattern.exec(source))){
			lineStart = m.index;
			lineEnd = lineStart + m[0].length;
			locator.lineNumber++;
			//console.log('line++:',locator,startPos,endPos)
		}
		locator.columnNumber = p-lineStart+1;
	}
	var lineStart = 0;
	var lineEnd = 0;
	var linePattern = /.*(?:\r\n?|\n)|.*$/g
	var locator = domBuilder.locator;
	
	var parseStack = [{currentNSMap:defaultNSMapCopy}]
	var closeMap = {};
	var start = 0;
	while(true){
		try{
			var tagStart = source.indexOf('<',start);
			if(tagStart<0){
				if(!source.substr(start).match(/^\s*$/)){
					var doc = domBuilder.doc;
	    			var text = doc.createTextNode(source.substr(start));
	    			doc.appendChild(text);
	    			domBuilder.currentElement = text;
				}
				return;
			}
			if(tagStart>start){
				appendText(tagStart);
			}
			switch(source.charAt(tagStart+1)){
			case '/':
				var end = source.indexOf('>',tagStart+3);
				var tagName = source.substring(tagStart+2,end);
				var config = parseStack.pop();
				if(end<0){
					
	        		tagName = source.substring(tagStart+2).replace(/[\s<].*/,'');
	        		//console.error('#@@@@@@'+tagName)
	        		errorHandler.error("end tag name: "+tagName+' is not complete:'+config.tagName);
	        		end = tagStart+1+tagName.length;
	        	}else if(tagName.match(/\s</)){
	        		tagName = tagName.replace(/[\s<].*/,'');
	        		errorHandler.error("end tag name: "+tagName+' maybe not complete');
	        		end = tagStart+1+tagName.length;
				}
				//console.error(parseStack.length,parseStack)
				//console.error(config);
				var localNSMap = config.localNSMap;
				var endMatch = config.tagName == tagName;
				var endIgnoreCaseMach = endMatch || config.tagName&&config.tagName.toLowerCase() == tagName.toLowerCase()
		        if(endIgnoreCaseMach){
		        	domBuilder.endElement(config.uri,config.localName,tagName);
					if(localNSMap){
						for(var prefix in localNSMap){
							domBuilder.endPrefixMapping(prefix) ;
						}
					}
					if(!endMatch){
		            	errorHandler.fatalError("end tag name: "+tagName+' is not match the current start tagName:'+config.tagName );
					}
		        }else{
		        	parseStack.push(config)
		        }
				
				end++;
				break;
				// end elment
			case '?':// <?...?>
				locator&&position(tagStart);
				end = parseInstruction(source,tagStart,domBuilder);
				break;
			case '!':// <!doctype,<![CDATA,<!--
				locator&&position(tagStart);
				end = parseDCC(source,tagStart,domBuilder,errorHandler);
				break;
			default:
				locator&&position(tagStart);
				var el = new ElementAttributes();
				var currentNSMap = parseStack[parseStack.length-1].currentNSMap;
				//elStartEnd
				var end = parseElementStartPart(source,tagStart,el,currentNSMap,entityReplacer,errorHandler);
				var len = el.length;
				
				
				if(!el.closed && fixSelfClosed(source,end,el.tagName,closeMap)){
					el.closed = true;
					if(!entityMap.nbsp){
						errorHandler.warning('unclosed xml attribute');
					}
				}
				if(locator && len){
					var locator2 = copyLocator(locator,{});
					//try{//attribute position fixed
					for(var i = 0;i<len;i++){
						var a = el[i];
						position(a.offset);
						a.locator = copyLocator(locator,{});
					}
					//}catch(e){console.error('@@@@@'+e)}
					domBuilder.locator = locator2
					if(appendElement(el,domBuilder,currentNSMap)){
						parseStack.push(el)
					}
					domBuilder.locator = locator;
				}else{
					if(appendElement(el,domBuilder,currentNSMap)){
						parseStack.push(el)
					}
				}
				
				
				
				if(el.uri === 'http://www.w3.org/1999/xhtml' && !el.closed){
					end = parseHtmlSpecialContent(source,end,el.tagName,entityReplacer,domBuilder)
				}else{
					end++;
				}
			}
		}catch(e){
			errorHandler.error('element parse error: '+e)
			//errorHandler.error('element parse error: '+e);
			end = -1;
			//throw e;
		}
		if(end>start){
			start = end;
		}else{
			//TODO: 这里有可能sax回退，有位置错误风险
			appendText(Math.max(tagStart,start)+1);
		}
	}
}
function copyLocator(f,t){
	t.lineNumber = f.lineNumber;
	t.columnNumber = f.columnNumber;
	return t;
}

/**
 * @see #appendElement(source,elStartEnd,el,selfClosed,entityReplacer,domBuilder,parseStack);
 * @return end of the elementStartPart(end of elementEndPart for selfClosed el)
 */
function parseElementStartPart(source,start,el,currentNSMap,entityReplacer,errorHandler){
	var attrName;
	var value;
	var p = ++start;
	var s = S_TAG;//status
	while(true){
		var c = source.charAt(p);
		switch(c){
		case '=':
			if(s === S_ATTR){//attrName
				attrName = source.slice(start,p);
				s = S_EQ;
			}else if(s === S_ATTR_SPACE){
				s = S_EQ;
			}else{
				//fatalError: equal must after attrName or space after attrName
				throw new Error('attribute equal must after attrName');
			}
			break;
		case '\'':
		case '"':
			if(s === S_EQ || s === S_ATTR //|| s == S_ATTR_SPACE
				){//equal
				if(s === S_ATTR){
					errorHandler.warning('attribute value must after "="')
					attrName = source.slice(start,p)
				}
				start = p+1;
				p = source.indexOf(c,start)
				if(p>0){
					value = source.slice(start,p).replace(/&#?\w+;/g,entityReplacer);
					el.add(attrName,value,start-1);
					s = S_ATTR_END;
				}else{
					//fatalError: no end quot match
					throw new Error('attribute value no end \''+c+'\' match');
				}
			}else if(s == S_ATTR_NOQUOT_VALUE){
				value = source.slice(start,p).replace(/&#?\w+;/g,entityReplacer);
				//console.log(attrName,value,start,p)
				el.add(attrName,value,start);
				//console.dir(el)
				errorHandler.warning('attribute "'+attrName+'" missed start quot('+c+')!!');
				start = p+1;
				s = S_ATTR_END
			}else{
				//fatalError: no equal before
				throw new Error('attribute value must after "="');
			}
			break;
		case '/':
			switch(s){
			case S_TAG:
				el.setTagName(source.slice(start,p));
			case S_ATTR_END:
			case S_TAG_SPACE:
			case S_TAG_CLOSE:
				s =S_TAG_CLOSE;
				el.closed = true;
			case S_ATTR_NOQUOT_VALUE:
			case S_ATTR:
			case S_ATTR_SPACE:
				break;
			//case S_EQ:
			default:
				throw new Error("attribute invalid close char('/')")
			}
			break;
		case ''://end document
			//throw new Error('unexpected end of input')
			errorHandler.error('unexpected end of input');
			if(s == S_TAG){
				el.setTagName(source.slice(start,p));
			}
			return p;
		case '>':
			switch(s){
			case S_TAG:
				el.setTagName(source.slice(start,p));
			case S_ATTR_END:
			case S_TAG_SPACE:
			case S_TAG_CLOSE:
				break;//normal
			case S_ATTR_NOQUOT_VALUE://Compatible state
			case S_ATTR:
				value = source.slice(start,p);
				if(value.slice(-1) === '/'){
					el.closed  = true;
					value = value.slice(0,-1)
				}
			case S_ATTR_SPACE:
				if(s === S_ATTR_SPACE){
					value = attrName;
				}
				if(s == S_ATTR_NOQUOT_VALUE){
					errorHandler.warning('attribute "'+value+'" missed quot(")!!');
					el.add(attrName,value.replace(/&#?\w+;/g,entityReplacer),start)
				}else{
					if(currentNSMap[''] !== 'http://www.w3.org/1999/xhtml' || !value.match(/^(?:disabled|checked|selected)$/i)){
						errorHandler.warning('attribute "'+value+'" missed value!! "'+value+'" instead!!')
					}
					el.add(value,value,start)
				}
				break;
			case S_EQ:
				throw new Error('attribute value missed!!');
			}
//			console.log(tagName,tagNamePattern,tagNamePattern.test(tagName))
			return p;
		/*xml space '\x20' | #x9 | #xD | #xA; */
		case '\u0080':
			c = ' ';
		default:
			if(c<= ' '){//space
				switch(s){
				case S_TAG:
					el.setTagName(source.slice(start,p));//tagName
					s = S_TAG_SPACE;
					break;
				case S_ATTR:
					attrName = source.slice(start,p)
					s = S_ATTR_SPACE;
					break;
				case S_ATTR_NOQUOT_VALUE:
					var value = source.slice(start,p).replace(/&#?\w+;/g,entityReplacer);
					errorHandler.warning('attribute "'+value+'" missed quot(")!!');
					el.add(attrName,value,start)
				case S_ATTR_END:
					s = S_TAG_SPACE;
					break;
				//case S_TAG_SPACE:
				//case S_EQ:
				//case S_ATTR_SPACE:
				//	void();break;
				//case S_TAG_CLOSE:
					//ignore warning
				}
			}else{//not space
//S_TAG,	S_ATTR,	S_EQ,	S_ATTR_NOQUOT_VALUE
//S_ATTR_SPACE,	S_ATTR_END,	S_TAG_SPACE, S_TAG_CLOSE
				switch(s){
				//case S_TAG:void();break;
				//case S_ATTR:void();break;
				//case S_ATTR_NOQUOT_VALUE:void();break;
				case S_ATTR_SPACE:
					var tagName =  el.tagName;
					if(currentNSMap[''] !== 'http://www.w3.org/1999/xhtml' || !attrName.match(/^(?:disabled|checked|selected)$/i)){
						errorHandler.warning('attribute "'+attrName+'" missed value!! "'+attrName+'" instead2!!')
					}
					el.add(attrName,attrName,start);
					start = p;
					s = S_ATTR;
					break;
				case S_ATTR_END:
					errorHandler.warning('attribute space is required"'+attrName+'"!!')
				case S_TAG_SPACE:
					s = S_ATTR;
					start = p;
					break;
				case S_EQ:
					s = S_ATTR_NOQUOT_VALUE;
					start = p;
					break;
				case S_TAG_CLOSE:
					throw new Error("elements closed character '/' and '>' must be connected to");
				}
			}
		}//end outer switch
		//console.log('p++',p)
		p++;
	}
}
/**
 * @return true if has new namespace define
 */
function appendElement(el,domBuilder,currentNSMap){
	var tagName = el.tagName;
	var localNSMap = null;
	//var currentNSMap = parseStack[parseStack.length-1].currentNSMap;
	var i = el.length;
	while(i--){
		var a = el[i];
		var qName = a.qName;
		var value = a.value;
		var nsp = qName.indexOf(':');
		if(nsp>0){
			var prefix = a.prefix = qName.slice(0,nsp);
			var localName = qName.slice(nsp+1);
			var nsPrefix = prefix === 'xmlns' && localName
		}else{
			localName = qName;
			prefix = null
			nsPrefix = qName === 'xmlns' && ''
		}
		//can not set prefix,because prefix !== ''
		a.localName = localName ;
		//prefix == null for no ns prefix attribute 
		if(nsPrefix !== false){//hack!!
			if(localNSMap == null){
				localNSMap = {}
				//console.log(currentNSMap,0)
				_copy(currentNSMap,currentNSMap={})
				//console.log(currentNSMap,1)
			}
			currentNSMap[nsPrefix] = localNSMap[nsPrefix] = value;
			a.uri = 'http://www.w3.org/2000/xmlns/'
			domBuilder.startPrefixMapping(nsPrefix, value) 
		}
	}
	var i = el.length;
	while(i--){
		a = el[i];
		var prefix = a.prefix;
		if(prefix){//no prefix attribute has no namespace
			if(prefix === 'xml'){
				a.uri = 'http://www.w3.org/XML/1998/namespace';
			}if(prefix !== 'xmlns'){
				a.uri = currentNSMap[prefix || '']
				
				//{console.log('###'+a.qName,domBuilder.locator.systemId+'',currentNSMap,a.uri)}
			}
		}
	}
	var nsp = tagName.indexOf(':');
	if(nsp>0){
		prefix = el.prefix = tagName.slice(0,nsp);
		localName = el.localName = tagName.slice(nsp+1);
	}else{
		prefix = null;//important!!
		localName = el.localName = tagName;
	}
	//no prefix element has default namespace
	var ns = el.uri = currentNSMap[prefix || ''];
	domBuilder.startElement(ns,localName,tagName,el);
	//endPrefixMapping and startPrefixMapping have not any help for dom builder
	//localNSMap = null
	if(el.closed){
		domBuilder.endElement(ns,localName,tagName);
		if(localNSMap){
			for(prefix in localNSMap){
				domBuilder.endPrefixMapping(prefix) 
			}
		}
	}else{
		el.currentNSMap = currentNSMap;
		el.localNSMap = localNSMap;
		//parseStack.push(el);
		return true;
	}
}
function parseHtmlSpecialContent(source,elStartEnd,tagName,entityReplacer,domBuilder){
	if(/^(?:script|textarea)$/i.test(tagName)){
		var elEndStart =  source.indexOf('</'+tagName+'>',elStartEnd);
		var text = source.substring(elStartEnd+1,elEndStart);
		if(/[&<]/.test(text)){
			if(/^script$/i.test(tagName)){
				//if(!/\]\]>/.test(text)){
					//lexHandler.startCDATA();
					domBuilder.characters(text,0,text.length);
					//lexHandler.endCDATA();
					return elEndStart;
				//}
			}//}else{//text area
				text = text.replace(/&#?\w+;/g,entityReplacer);
				domBuilder.characters(text,0,text.length);
				return elEndStart;
			//}
			
		}
	}
	return elStartEnd+1;
}
function fixSelfClosed(source,elStartEnd,tagName,closeMap){
	//if(tagName in closeMap){
	var pos = closeMap[tagName];
	if(pos == null){
		//console.log(tagName)
		pos =  source.lastIndexOf('</'+tagName+'>')
		if(pos<elStartEnd){//忘记闭合
			pos = source.lastIndexOf('</'+tagName)
		}
		closeMap[tagName] =pos
	}
	return pos<elStartEnd;
	//} 
}
function _copy(source,target){
	for(var n in source){target[n] = source[n]}
}
function parseDCC(source,start,domBuilder,errorHandler){//sure start with '<!'
	var next= source.charAt(start+2)
	switch(next){
	case '-':
		if(source.charAt(start + 3) === '-'){
			var end = source.indexOf('-->',start+4);
			//append comment source.substring(4,end)//<!--
			if(end>start){
				domBuilder.comment(source,start+4,end-start-4);
				return end+3;
			}else{
				errorHandler.error("Unclosed comment");
				return -1;
			}
		}else{
			//error
			return -1;
		}
	default:
		if(source.substr(start+3,6) == 'CDATA['){
			var end = source.indexOf(']]>',start+9);
			domBuilder.startCDATA();
			domBuilder.characters(source,start+9,end-start-9);
			domBuilder.endCDATA() 
			return end+3;
		}
		//<!DOCTYPE
		//startDTD(java.lang.String name, java.lang.String publicId, java.lang.String systemId) 
		var matchs = split(source,start);
		var len = matchs.length;
		if(len>1 && /!doctype/i.test(matchs[0][0])){
			var name = matchs[1][0];
			var pubid = len>3 && /^public$/i.test(matchs[2][0]) && matchs[3][0]
			var sysid = len>4 && matchs[4][0];
			var lastMatch = matchs[len-1]
			domBuilder.startDTD(name,pubid && pubid.replace(/^(['"])(.*?)\1$/,'$2'),
					sysid && sysid.replace(/^(['"])(.*?)\1$/,'$2'));
			domBuilder.endDTD();
			
			return lastMatch.index+lastMatch[0].length
		}
	}
	return -1;
}



function parseInstruction(source,start,domBuilder){
	var end = source.indexOf('?>',start);
	if(end){
		var match = source.substring(start,end).match(/^<\?(\S*)\s*([\s\S]*?)\s*$/);
		if(match){
			var len = match[0].length;
			domBuilder.processingInstruction(match[1], match[2]) ;
			return end+2;
		}else{//error
			return -1;
		}
	}
	return -1;
}

/**
 * @param source
 */
function ElementAttributes(source){
	
}
ElementAttributes.prototype = {
	setTagName:function(tagName){
		if(!tagNamePattern.test(tagName)){
			throw new Error('invalid tagName:'+tagName)
		}
		this.tagName = tagName
	},
	add:function(qName,value,offset){
		if(!tagNamePattern.test(qName)){
			throw new Error('invalid attribute:'+qName)
		}
		this[this.length++] = {qName:qName,value:value,offset:offset}
	},
	length:0,
	getLocalName:function(i){return this[i].localName},
	getLocator:function(i){return this[i].locator},
	getQName:function(i){return this[i].qName},
	getURI:function(i){return this[i].uri},
	getValue:function(i){return this[i].value}
//	,getIndex:function(uri, localName)){
//		if(localName){
//			
//		}else{
//			var qName = uri
//		}
//	},
//	getValue:function(){return this.getValue(this.getIndex.apply(this,arguments))},
//	getType:function(uri,localName){}
//	getType:function(i){},
}




function _set_proto_(thiz,parent){
	thiz.__proto__ = parent;
	return thiz;
}
if(!(_set_proto_({},_set_proto_.prototype) instanceof _set_proto_)){
	_set_proto_ = function(thiz,parent){
		function p(){};
		p.prototype = parent;
		p = new p();
		for(parent in thiz){
			p[parent] = thiz[parent];
		}
		return p;
	}
}

function split(source,start){
	var match;
	var buf = [];
	var reg = /'[^']+'|"[^"]+"|[^\s<>\/=]+=?|(\/?\s*>|<)/g;
	reg.lastIndex = start;
	reg.exec(source);//skip <
	while(match = reg.exec(source)){
		buf.push(match);
		if(match[1])return buf;
	}
}

exports.XMLReader = XMLReader;


},{}],13:[function(require,module,exports){
module.exports.parse = function(res) {
    var cpm;
    Object.keys(res.headers).forEach(function(h) {
        if (h.toLowerCase().indexOf("x-pricing-cpm") !== 0) return;
        try {
            cpm = parseFloat(res.headers[h].trim());
        }
        catch(e) {
            return null;
        }
    });
    return cpm;
};
},{}],14:[function(require,module,exports){
module.exports = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMjAwcHgnIGhlaWdodD0nMjAwcHgnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaWRZTWlkIiBjbGFzcz0idWlsLWRlZmF1bHQiPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSJub25lIiBjbGFzcz0iYmsiPjwvcmVjdD48cmVjdCAgeD0nNDguNScgeT0nNDcnIHdpZHRoPSczJyBoZWlnaHQ9JzYnIHJ4PScxJyByeT0nMScgZmlsbD0nI2ZmZmZmZicgdHJhbnNmb3JtPSdyb3RhdGUoMCA1MCA1MCkgdHJhbnNsYXRlKDAgLTEwKSc+ICA8YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSdvcGFjaXR5JyBmcm9tPScxJyB0bz0nMCcgZHVyPScxcycgYmVnaW49JzBzJyByZXBlYXRDb3VudD0naW5kZWZpbml0ZScvPjwvcmVjdD48cmVjdCAgeD0nNDguNScgeT0nNDcnIHdpZHRoPSczJyBoZWlnaHQ9JzYnIHJ4PScxJyByeT0nMScgZmlsbD0nI2ZmZmZmZicgdHJhbnNmb3JtPSdyb3RhdGUoMzYgNTAgNTApIHRyYW5zbGF0ZSgwIC0xMCknPiAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT0nb3BhY2l0eScgZnJvbT0nMScgdG89JzAnIGR1cj0nMXMnIGJlZ2luPScwLjFzJyByZXBlYXRDb3VudD0naW5kZWZpbml0ZScvPjwvcmVjdD48cmVjdCAgeD0nNDguNScgeT0nNDcnIHdpZHRoPSczJyBoZWlnaHQ9JzYnIHJ4PScxJyByeT0nMScgZmlsbD0nI2ZmZmZmZicgdHJhbnNmb3JtPSdyb3RhdGUoNzIgNTAgNTApIHRyYW5zbGF0ZSgwIC0xMCknPiAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT0nb3BhY2l0eScgZnJvbT0nMScgdG89JzAnIGR1cj0nMXMnIGJlZ2luPScwLjJzJyByZXBlYXRDb3VudD0naW5kZWZpbml0ZScvPjwvcmVjdD48cmVjdCAgeD0nNDguNScgeT0nNDcnIHdpZHRoPSczJyBoZWlnaHQ9JzYnIHJ4PScxJyByeT0nMScgZmlsbD0nI2ZmZmZmZicgdHJhbnNmb3JtPSdyb3RhdGUoMTA4IDUwIDUwKSB0cmFuc2xhdGUoMCAtMTApJz4gIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9J29wYWNpdHknIGZyb209JzEnIHRvPScwJyBkdXI9JzFzJyBiZWdpbj0nMC4zcycgcmVwZWF0Q291bnQ9J2luZGVmaW5pdGUnLz48L3JlY3Q+PHJlY3QgIHg9JzQ4LjUnIHk9JzQ3JyB3aWR0aD0nMycgaGVpZ2h0PSc2JyByeD0nMScgcnk9JzEnIGZpbGw9JyNmZmZmZmYnIHRyYW5zZm9ybT0ncm90YXRlKDE0NCA1MCA1MCkgdHJhbnNsYXRlKDAgLTEwKSc+ICA8YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSdvcGFjaXR5JyBmcm9tPScxJyB0bz0nMCcgZHVyPScxcycgYmVnaW49JzAuNHMnIHJlcGVhdENvdW50PSdpbmRlZmluaXRlJy8+PC9yZWN0PjxyZWN0ICB4PSc0OC41JyB5PSc0Nycgd2lkdGg9JzMnIGhlaWdodD0nNicgcng9JzEnIHJ5PScxJyBmaWxsPScjZmZmZmZmJyB0cmFuc2Zvcm09J3JvdGF0ZSgxODAgNTAgNTApIHRyYW5zbGF0ZSgwIC0xMCknPiAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT0nb3BhY2l0eScgZnJvbT0nMScgdG89JzAnIGR1cj0nMXMnIGJlZ2luPScwLjVzJyByZXBlYXRDb3VudD0naW5kZWZpbml0ZScvPjwvcmVjdD48cmVjdCAgeD0nNDguNScgeT0nNDcnIHdpZHRoPSczJyBoZWlnaHQ9JzYnIHJ4PScxJyByeT0nMScgZmlsbD0nI2ZmZmZmZicgdHJhbnNmb3JtPSdyb3RhdGUoMjE2IDUwIDUwKSB0cmFuc2xhdGUoMCAtMTApJz4gIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9J29wYWNpdHknIGZyb209JzEnIHRvPScwJyBkdXI9JzFzJyBiZWdpbj0nMC42cycgcmVwZWF0Q291bnQ9J2luZGVmaW5pdGUnLz48L3JlY3Q+PHJlY3QgIHg9JzQ4LjUnIHk9JzQ3JyB3aWR0aD0nMycgaGVpZ2h0PSc2JyByeD0nMScgcnk9JzEnIGZpbGw9JyNmZmZmZmYnIHRyYW5zZm9ybT0ncm90YXRlKDI1MiA1MCA1MCkgdHJhbnNsYXRlKDAgLTEwKSc+ICA8YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSdvcGFjaXR5JyBmcm9tPScxJyB0bz0nMCcgZHVyPScxcycgYmVnaW49JzAuN3MnIHJlcGVhdENvdW50PSdpbmRlZmluaXRlJy8+PC9yZWN0PjxyZWN0ICB4PSc0OC41JyB5PSc0Nycgd2lkdGg9JzMnIGhlaWdodD0nNicgcng9JzEnIHJ5PScxJyBmaWxsPScjZmZmZmZmJyB0cmFuc2Zvcm09J3JvdGF0ZSgyODggNTAgNTApIHRyYW5zbGF0ZSgwIC0xMCknPiAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT0nb3BhY2l0eScgZnJvbT0nMScgdG89JzAnIGR1cj0nMXMnIGJlZ2luPScwLjhzJyByZXBlYXRDb3VudD0naW5kZWZpbml0ZScvPjwvcmVjdD48cmVjdCAgeD0nNDguNScgeT0nNDcnIHdpZHRoPSczJyBoZWlnaHQ9JzYnIHJ4PScxJyByeT0nMScgZmlsbD0nI2ZmZmZmZicgdHJhbnNmb3JtPSdyb3RhdGUoMzI0IDUwIDUwKSB0cmFuc2xhdGUoMCAtMTApJz4gIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9J29wYWNpdHknIGZyb209JzEnIHRvPScwJyBkdXI9JzFzJyBiZWdpbj0nMC45cycgcmVwZWF0Q291bnQ9J2luZGVmaW5pdGUnLz48L3JlY3Q+PC9zdmc+\n";

},{}],15:[function(require,module,exports){
module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUAAAAHgCAYAAADUjLREAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALFwAACxcB/2cbCgAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAACAASURBVHic7N13fBz1nf/x18xsL9pdrbpW1aq23ORewDZgmw6hhABphPQjPZd26bm7XC6/5FIuJLk0CAkEEhIg9GJMs8G4d0u2JVm9S6vtbX5/rFhZTqPbyn6ej4ce0qxnd7+7lt4785nvfEYBdIQQIgupp3sAQghxukgACiGylgSgECJrSQAKIbKWBKAQImtJAAohspYEoBAia0kACiGylgSgECJrSQAKIbKWBKAQImtJAAohspYEoBAia0kACiGylgSgECJrSQAKIbKWBKAQImtJAAohspYEoBAia0kACiGylgSgECJrSQAKIbKWBKAQImtJAAohspYEoBAia0kACiGylgSgECJrSQAKIbKWBKAQImtJAAohspYEoBAia0kACiGylgSgECJrSQAKIbKWBKAQImtJAAohspYEoBAia0kACiGylgSgECJrSQAKIbKWBKAQImtJAAohspYEoBAia0kACiGylgSgECJrSQAKIbKWBKAQImtJAAohspYEoBAia0kACiGylgSgECJrSQAKIbKWBKAQImtJAAohspYEoBAia0kACiGylgSgECJrSQAKIbKWBKAQImtJAAohspYEoBAia0kACiGylgSgECJrSQAKIbKWBKAQImtJAAohspYEoBAia0kACiGylgSgECJrSQAKIbKWBKAQImtJAAohspYEoBAia0kACiGylgSgECJrSQAKIbKWBKAQImtJAAohspYEoBAia0kACiGylgSgECJrSQAKIbKWBKAQImtJAAohspYEoBAia0kACiGylgSgECJrSQAKIbKWBKAQImtJAAohspYEoBAia0kACiGylgSgECJrSQAKIbKWBKAQImtJAAohspYEoBAia0kACiGylgSgECJrSQAKIbKWBKAQImtJAAohspYEoBAia0kACiGylgSgECJrSQAKIbKWBKAQImtJAAohspYEoBAia0kACiGylgSgECJrSQAKIbKWBKAQImtJAAohspYEoBAia0kACiGylgSgECJrSQAKIbKWBKAQImtJAAohspYEoBAia0kACiGylgSg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iKTFACQiaTEAiUhaDEAikhYDkIikxQAkImkxAIlIWgxAIpIWA5CIpMUAJCJpMQCJSFoMQCKSFgOQiKTFACQiaTEAiUhaDEAikhYDkIikxQAkImkxAIlIWgxAIpIWA5CIpMUAJCJpMQCJSFoMQCKSFgOQiKTFACQiaTEAiUhaDEAikhYDkIikxQAkImkxAIlIWgxAIpIWA5CIpMUAJCJpMQCJSFoMQCKSFgOQiKTFACQiaTEAiUhaDEAikhYDkIikxQAkImkxAIlIWgxAIpIWA5CIpMUAJCJpMQCJSFoMQCKSFgOQiKTFACQiaTEAiUhaDEAikhYDkIikxQAkImkxAIlIWgxAIpIWA5CIpMUAJCJpMQCJSFoMQCKSFgOQiKTFACQiaTEAiUhaDEAikhYDkIikxQAkImkxAIlIWgxAIpIWA5CIpMUAJCJpMQCJSFoMQCKSFgOQiKTFACQiaTEAiUhaDEAikhYDkIikxQAkImkxAIlIWgxAIpIWA5CIpMUAJCJpMQCJSFoMQCKSFgOQiKTFACQiaTEAiUhaDEAikhYDkIikxQAkImkxAIlIWgxAIpIWA5CIpMUAJCJpMQCJSFoMQCKSFgOQiKTFACQiaTEAiUhaDEAikhYDkIikxQAkImkxAIlIWgxAIpIWA5CIpMUAJCJp/X8udkESzyX4DQAAAABJRU5ErkJggg==";

},{}],16:[function(require,module,exports){
/*
 Copyright 2011-2013 Abdulla Abdurakhmanov
 Original sources are available at https://code.google.com/p/x2js/
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */
var DOMParser = require('xmldom').DOMParser;

module.exports = function X2JS(config) {
	'use strict';
		
	var VERSION = "1.1.5";
	
	config = config || {};
	initConfigDefaults();
	initRequiredPolyfills();
	
	function initConfigDefaults() {
		if(config.escapeMode === undefined) {
			config.escapeMode = true;
		}
		config.attributePrefix = config.attributePrefix || "_";
		config.arrayAccessForm = config.arrayAccessForm || "none";
		config.emptyNodeForm = config.emptyNodeForm || "text";
		if(config.enableToStringFunc === undefined) {
			config.enableToStringFunc = true; 
		}
		config.arrayAccessFormPaths = config.arrayAccessFormPaths || []; 
		if(config.skipEmptyTextNodesForObj === undefined) {
			config.skipEmptyTextNodesForObj = true;
		}
		if(config.stripWhitespaces === undefined) {
			config.stripWhitespaces = true;
		}
		config.datetimeAccessFormPaths = config.datetimeAccessFormPaths || [];
	}

	var DOMNodeTypes = {
		ELEMENT_NODE 	   : 1,
		TEXT_NODE    	   : 3,
		CDATA_SECTION_NODE : 4,
		COMMENT_NODE	   : 8,
		DOCUMENT_NODE 	   : 9
	};
	
	function initRequiredPolyfills() {
		function pad(number) {
	      var r = String(number);
	      if ( r.length === 1 ) {
	        r = '0' + r;
	      }
	      return r;
	    }
		// Hello IE8-
		if(typeof String.prototype.trim !== 'function') {			
			String.prototype.trim = function() {
				return this.replace(/^\s+|^\n+|(\s|\n)+$/g, '');
			}
		}
		if(typeof Date.prototype.toISOString !== 'function') {
			// Implementation from http://stackoverflow.com/questions/2573521/how-do-i-output-an-iso-8601-formatted-string-in-javascript
			Date.prototype.toISOString = function() {
		      return this.getUTCFullYear()
		        + '-' + pad( this.getUTCMonth() + 1 )
		        + '-' + pad( this.getUTCDate() )
		        + 'T' + pad( this.getUTCHours() )
		        + ':' + pad( this.getUTCMinutes() )
		        + ':' + pad( this.getUTCSeconds() )
		        + '.' + String( (this.getUTCMilliseconds()/1000).toFixed(3) ).slice( 2, 5 )
		        + 'Z';
		    };
		}
	}
	
	function getNodeLocalName( node ) {
		var nodeLocalName = node.localName;			
		if(nodeLocalName == null) // Yeah, this is IE!! 
			nodeLocalName = node.baseName;
		if(nodeLocalName == null || nodeLocalName=="") // =="" is IE too
			nodeLocalName = node.nodeName;
		return nodeLocalName;
	}
	
	function getNodePrefix(node) {
		return node.prefix;
	}
		
	function escapeXmlChars(str) {
		if(typeof(str) == "string")
			return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/\//g, '&#x2F;');
		else
			return str;
	}

	function unescapeXmlChars(str) {
		return str.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&#x2F;/g, '\/');
	}
	
	function toArrayAccessForm(obj, childName, path) {
		switch(config.arrayAccessForm) {
		case "property":
			if(!(obj[childName] instanceof Array))
				obj[childName+"_asArray"] = [obj[childName]];
			else
				obj[childName+"_asArray"] = obj[childName];
			break;		
		/*case "none":
			break;*/
		}
		
		if(!(obj[childName] instanceof Array) && config.arrayAccessFormPaths.length > 0) {
			var idx = 0;
			for(; idx < config.arrayAccessFormPaths.length; idx++) {
				var arrayPath = config.arrayAccessFormPaths[idx];
				if( typeof arrayPath === "string" ) {
					if(arrayPath == path)
						break;
				}
				else
				if( arrayPath instanceof RegExp) {
					if(arrayPath.test(path))
						break;
				}				
				else
				if( typeof arrayPath === "function") {
					if(arrayPath(obj, childName, path))
						break;
				}
			}
			if(idx!=config.arrayAccessFormPaths.length) {
				obj[childName] = [obj[childName]];
			}
		}
	}
	
	function fromXmlDateTime(prop) {
		// Implementation based up on http://stackoverflow.com/questions/8178598/xml-datetime-to-javascript-date-object
		// Improved to support full spec and optional parts
		var bits = prop.split(/[-T:+Z]/g);
		
		var d = new Date(bits[0], bits[1]-1, bits[2]);			
		var secondBits = bits[5].split("\.");
		d.setHours(bits[3], bits[4], secondBits[0]);
		if(secondBits.length>1)
			d.setMilliseconds(secondBits[1]);

		// Get supplied time zone offset in minutes
		if(bits[6] && bits[7]) {
			var offsetMinutes = bits[6] * 60 + Number(bits[7]);
			var sign = /\d\d-\d\d:\d\d$/.test(prop)? '-' : '+';

			// Apply the sign
			offsetMinutes = 0 + (sign == '-'? -1 * offsetMinutes : offsetMinutes);

			// Apply offset and local timezone
			d.setMinutes(d.getMinutes() - offsetMinutes - d.getTimezoneOffset())
		}
		else
			if(prop.indexOf("Z", prop.length - 1) !== -1) {
				d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds()));					
			}

		// d is now a local time equivalent to the supplied time
		return d;
	}
	
	function checkFromXmlDateTimePaths(value, childName, fullPath) {
		if(config.datetimeAccessFormPaths.length > 0) {
			var path = fullPath.split("\.#")[0];
			var idx = 0;
			for(; idx < config.datetimeAccessFormPaths.length; idx++) {
				var dtPath = config.datetimeAccessFormPaths[idx];
				if( typeof dtPath === "string" ) {
					if(dtPath == path)
						break;
				}
				else
				if( dtPath instanceof RegExp) {
					if(dtPath.test(path))
						break;
				}				
				else
				if( typeof dtPath === "function") {
					if(dtPath(obj, childName, path))
						break;
				}
			}
			if(idx!=config.datetimeAccessFormPaths.length) {
				return fromXmlDateTime(value);
			}
			else
				return value;
		}
		else
			return value;
	}

	function parseDOMChildren( node, path ) {
		if(node.nodeType == DOMNodeTypes.DOCUMENT_NODE) {
			var result = new Object;
			var nodeChildren = node.childNodes;
			// Alternative for firstElementChild which is not supported in some environments
			for(var cidx=0; cidx <nodeChildren.length; cidx++) {
				var child = nodeChildren.item(cidx);
				if(child.nodeType == DOMNodeTypes.ELEMENT_NODE) {
					var childName = getNodeLocalName(child);
					result[childName] = parseDOMChildren(child, childName);
				}
			}
			return result;
		}
		else
		if(node.nodeType == DOMNodeTypes.ELEMENT_NODE) {
			var result = new Object;
			result.__cnt=0;
			
			var nodeChildren = node.childNodes;
			
			// Children nodes
			for(var cidx=0; cidx <nodeChildren.length; cidx++) {
				var child = nodeChildren.item(cidx); // nodeChildren[cidx];
				var childName = getNodeLocalName(child);
				
				if(child.nodeType!= DOMNodeTypes.COMMENT_NODE) {
					result.__cnt++;
					if(result[childName] == null) {
						result[childName] = parseDOMChildren(child, path+"."+childName);
						toArrayAccessForm(result, childName, path+"."+childName);					
					}
					else {
						if(result[childName] != null) {
							if( !(result[childName] instanceof Array)) {
								result[childName] = [result[childName]];
								toArrayAccessForm(result, childName, path+"."+childName);
							}
						}
						(result[childName])[result[childName].length] = parseDOMChildren(child, path+"."+childName);
					}
				}								
			}
			
			// Attributes
			for(var aidx=0; aidx <node.attributes.length; aidx++) {
				var attr = node.attributes.item(aidx); // [aidx];
				result.__cnt++;
				result[config.attributePrefix+attr.name]=attr.value;
			}
			
			// Node namespace prefix
			var nodePrefix = getNodePrefix(node);
			if(nodePrefix!=null && nodePrefix!="") {
				result.__cnt++;
				result.__prefix=nodePrefix;
			}
			
			if(result["#text"]!=null) {				
				result.__text = result["#text"];
				if(result.__text instanceof Array) {
					result.__text = result.__text.join("\n");
				}
				if(config.escapeMode)
					result.__text = unescapeXmlChars(result.__text);
				if(config.stripWhitespaces)
					result.__text = result.__text.trim();
				delete result["#text"];
				if(config.arrayAccessForm=="property")
					delete result["#text_asArray"];
				result.__text = checkFromXmlDateTimePaths(result.__text, childName, path+"."+childName);
			}
			if(result["#cdata-section"]!=null) {
				result.__cdata = result["#cdata-section"];
				delete result["#cdata-section"];
				if(config.arrayAccessForm=="property")
					delete result["#cdata-section_asArray"];
			}
			
			if( result.__cnt == 1 && result.__text!=null  ) {
				result = result.__text;
			}
			else
			if( result.__cnt == 0 && config.emptyNodeForm=="text" ) {
				result = '';
			}
			else
			if ( result.__cnt > 1 && result.__text!=null && config.skipEmptyTextNodesForObj) {
				if( (config.stripWhitespaces && result.__text=="") || (result.__text.trim()=="")) {
					delete result.__text;
				}
			}
			delete result.__cnt;			
			
			if( config.enableToStringFunc && (result.__text!=null || result.__cdata!=null )) {
				result.toString = function() {
					return (this.__text!=null? this.__text:'')+( this.__cdata!=null ? this.__cdata:'');
				};
			}
			
			return result;
		}
		else
		if(node.nodeType == DOMNodeTypes.TEXT_NODE || node.nodeType == DOMNodeTypes.CDATA_SECTION_NODE) {
			return node.nodeValue;
		}	
	}
	
	function startTag(jsonObj, element, attrList, closed) {
		var resultStr = "<"+ ( (jsonObj!=null && jsonObj.__prefix!=null)? (jsonObj.__prefix+":"):"") + element;
		if(attrList!=null) {
			for(var aidx = 0; aidx < attrList.length; aidx++) {
				var attrName = attrList[aidx];
				var attrVal = jsonObj[attrName];
				if(config.escapeMode)
					attrVal=escapeXmlChars(attrVal);
				resultStr+=" "+attrName.substr(config.attributePrefix.length)+"='"+attrVal+"'";
			}
		}
		if(!closed)
			resultStr+=">";
		else
			resultStr+="/>";
		return resultStr;
	}
	
	function endTag(jsonObj,elementName) {
		return "</"+ (jsonObj.__prefix!=null? (jsonObj.__prefix+":"):"")+elementName+">";
	}
	
	function endsWith(str, suffix) {
	    return str.indexOf(suffix, str.length - suffix.length) !== -1;
	}
	
	function jsonXmlSpecialElem ( jsonObj, jsonObjField ) {
		if((config.arrayAccessForm=="property" && endsWith(jsonObjField.toString(),("_asArray"))) 
				|| jsonObjField.toString().indexOf(config.attributePrefix)==0 
				|| jsonObjField.toString().indexOf("__")==0
				|| (jsonObj[jsonObjField] instanceof Function) )
			return true;
		else
			return false;
	}
	
	function jsonXmlElemCount ( jsonObj ) {
		var elementsCnt = 0;
		if(jsonObj instanceof Object ) {
			for( var it in jsonObj  ) {
				if(jsonXmlSpecialElem ( jsonObj, it) )
					continue;			
				elementsCnt++;
			}
		}
		return elementsCnt;
	}
	
	function parseJSONAttributes ( jsonObj ) {
		var attrList = [];
		if(jsonObj instanceof Object ) {
			for( var ait in jsonObj  ) {
				if(ait.toString().indexOf("__")== -1 && ait.toString().indexOf(config.attributePrefix)==0) {
					attrList.push(ait);
				}
			}
		}
		return attrList;
	}
	
	function parseJSONTextAttrs ( jsonTxtObj ) {
		var result ="";
		
		if(jsonTxtObj.__cdata!=null) {										
			result+="<![CDATA["+jsonTxtObj.__cdata+"]]>";					
		}
		
		if(jsonTxtObj.__text!=null) {			
			if(config.escapeMode)
				result+=escapeXmlChars(jsonTxtObj.__text);
			else
				result+=jsonTxtObj.__text;
		}
		return result;
	}
	
	function parseJSONTextObject ( jsonTxtObj ) {
		var result ="";

		if( jsonTxtObj instanceof Object ) {
			result+=parseJSONTextAttrs ( jsonTxtObj );
		}
		else
			if(jsonTxtObj!=null) {
				if(config.escapeMode)
					result+=escapeXmlChars(jsonTxtObj);
				else
					result+=jsonTxtObj;
			}
		
		return result;
	}
	
	function parseJSONArray ( jsonArrRoot, jsonArrObj, attrList ) {
		var result = ""; 
		if(jsonArrRoot.length == 0) {
			result+=startTag(jsonArrRoot, jsonArrObj, attrList, true);
		}
		else {
			for(var arIdx = 0; arIdx < jsonArrRoot.length; arIdx++) {
				result+=startTag(jsonArrRoot[arIdx], jsonArrObj, parseJSONAttributes(jsonArrRoot[arIdx]), false);
				result+=parseJSONObject(jsonArrRoot[arIdx]);
				result+=endTag(jsonArrRoot[arIdx],jsonArrObj);						
			}
		}
		return result;
	}
	
	function parseJSONObject ( jsonObj ) {
		var result = "";	

		var elementsCnt = jsonXmlElemCount ( jsonObj );
		
		if(elementsCnt > 0) {
			for( var it in jsonObj ) {
				
				if(jsonXmlSpecialElem ( jsonObj, it) )
					continue;			
				
				var subObj = jsonObj[it];						
				
				var attrList = parseJSONAttributes( subObj )
				
				if(subObj == null || subObj == undefined) {
					result+=startTag(subObj, it, attrList, true);
				}
				else
				if(subObj instanceof Object) {
					
					if(subObj instanceof Array) {					
						result+=parseJSONArray( subObj, it, attrList );					
					}
					else if(subObj instanceof Date) {
						result+=startTag(subObj, it, attrList, false);
						result+=subObj.toISOString();
						result+=endTag(subObj,it);
					}
					else {
						var subObjElementsCnt = jsonXmlElemCount ( subObj );
						if(subObjElementsCnt > 0 || subObj.__text!=null || subObj.__cdata!=null) {
							result+=startTag(subObj, it, attrList, false);
							result+=parseJSONObject(subObj);
							result+=endTag(subObj,it);
						}
						else {
							result+=startTag(subObj, it, attrList, true);
						}
					}
				}
				else {
					result+=startTag(subObj, it, attrList, false);
					result+=parseJSONTextObject(subObj);
					result+=endTag(subObj,it);
				}
			}
		}
		result+=parseJSONTextObject(jsonObj);
		
		return result;
	}
	
	this.parseXmlString = function(xmlDocStr) {

		if (xmlDocStr === undefined) {
			return null;
		}
		var xmlDoc;
        var parser=new DOMParser();			
        var parsererrorNS = null;
        
        try {
            xmlDoc = parser.parseFromString( xmlDocStr, "text/xml" );
            if( parsererrorNS!= null && xmlDoc.getElementsByTagNameNS(parsererrorNS, "parsererror").length > 0) {
                //throw new Error('Error parsing XML: '+xmlDocStr);
                xmlDoc = null;
            }
        }
        catch(err) {
            xmlDoc = null;
        }
		
		return xmlDoc;
	};
	
	this.asArray = function(prop) {
		if(prop instanceof Array)
			return prop;
		else
			return [prop];
	};
	
	this.toXmlDateTime = function(dt) {
		if(dt instanceof Date)
			return dt.toISOString();
		else
		if(typeof(dt) === 'number' )
			return new Date(dt).toISOString();
		else	
			return null;
	};
	
	this.asDateTime = function(prop) {
		if(typeof(prop) == "string") {
			return fromXmlDateTime(prop);
		}
		else
			return prop;
	};

	this.xml2json = function (xmlDoc) {
		return parseDOMChildren ( xmlDoc );
	};
	
	this.xml_str2json = function (xmlDocStr) {
		var xmlDoc = this.parseXmlString(xmlDocStr);
		if(xmlDoc!=null)
			return this.xml2json(xmlDoc);
		else
			return null;
	};

	this.json2xml_str = function (jsonObj) {
		return parseJSONObject ( jsonObj );
	};

	this.json2xml = function (jsonObj) {
		var xmlDocStr = this.json2xml_str (jsonObj);
		return this.parseXmlString(xmlDocStr);
	};
	
	this.getVersion = function () {
		return VERSION;
	};
	
}
},{"xmldom":10}],17:[function(require,module,exports){
var X2JS            = require('./res/js/x2js.js'),
    x2js            = new X2JS(),
    superagent      = require('superagent'),
    async           = require('async'),
    cpm             = require('./cpm.js'),
    loadingPoster   = require('./res/images/loading.txt'),
    audioPoster     = require('./res/images/poster.txt');

//----------------------------------------- members

var self            = this;
self.errorTrackers  = [];

//----------------------------------------- utils

var formatURL = function(urlObj) {
    if(!urlObj) return "";
    return (urlObj.__cdata || urlObj.__text || urlObj).replace(/[\r\n\s]*/g,"");
};

//----------------------------------------- network

var reportError = function(vasts, errCode, cb) {
    if (vasts.errorTrackers.length == 0) {
        cb();
    }
    async.each(vasts.errorTrackers,
        function(t, errRepCB) {
            t = t.replace("[ERRORCODE]", errCode);
            superagent.get(t).end(errRepCB);
        },
        cb
    );
};

//----------------------------------------- vast

window.collect = function(vast_array, cb) {
    if (typeof vast_array === 'string') {
        vast_array = JSON.parse(vast_array);
    }
    
    var vasts           = {};
    vasts.errorTrackers = [];
    vasts.arr           = [];
    
    for (var i = 0; i < vast_array.length; i++) {
        var vast_str = vast_array[i];
        console.log(vast_array[i]);
        var json = x2js.xml_str2json(vast_str);
        if (!json) {
            reportError(vasts, "100", function() {
                cb("error parsing xml");
            });
            return;
        }
        if (!json.VAST && !json.DAAST && !json.error) {
            reportError(vasts, "101", function() {
                cb("xml not valid VAST or DAAST");
            });
            return;
        }
        if (json.error) {
            reportError(vasts, "303", function() {
                if (typeof(json.error) === "string" && json.error.trim() === "No Ad Available") cb({noAd:true});
                else cb(json.error);
            });
            return;
        }
        
        var vast = json.VAST || json.DAAST;
        
        if (vast && vast.Error) {
            if (vast.Error.__cdata) {
                vasts.errorTrackers.push(vast.Error.__cdata);
            }
            reportError(vasts, "303", function() {
                cb({noAd:true});
            });
            return;
        }
        if (Object.keys(vast).length === 0 || (Object.keys(vast).length === 1 && vast._version)) {
            reportError(vasts, "303", function() {
                cb({noAd:true});
            });
            return;
        }
        
        if (vast && vast.Ad && vast.Ad.Wrapper && vast.Ad.Wrapper.Error) {
            if (vast.Ad.Wrapper.Error.__cdata) {
                vasts.errorTrackers.push(vast.Ad.Wrapper.Error.__cdata);
            }
        }
        if (vast && vast.Ad && vast.Ad.InLine && vast.Ad.InLine.Error) {
            errT = vast.Ad.InLine.Error;
            if (vast.Ad.InLine.Error.__cdata) {
                vasts.errorTrackers.push(vast.Ad.InLine.Error.__cdata);
            }
        }
                
        vasts.arr.push(json);
    }
    
    cb(null, vasts);
}
},{"./cpm.js":13,"./res/images/loading.txt":14,"./res/images/poster.txt":15,"./res/js/x2js.js":16,"async":1,"superagent":3}],18:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}]},{},[17]);
