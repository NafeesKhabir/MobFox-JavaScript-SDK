/*

 * Lazy Load - jQuery plugin for lazy loading images

 *

 * Copyright (c) 2007-2013 Mika Tuupola

 *

 * Licensed under the MIT license:

 *   http://www.opensource.org/licenses/mit-license.php

 *

 * Project home:

 *   http://www.appelsiini.net/projects/lazyload

 *

 * Version: 1.9.0

 *

 */

! function (e, t, n, r) {

    var a = e(t);

    e.fn.lazyload = function (i) {

        function o() {

            var t = 0;

            l.each(function () {

                var n = e(this);

                if (!c.skip_invisible || n.is(":visible"))

                    if (e.abovethetop(this, c) || e.leftofbegin(this, c));

                    else if (e.belowthefold(this, c) || e.rightoffold(this, c)) {

                    if (++t > c.failure_limit) return !1

                } else n.trigger("appear"), t = 0

            })

        }

        var s, l = this,

            c = {

                threshold: 0,

                failure_limit: 0,

                event: "scroll",

                effect: "show",

                container: t,

                data_attribute: "original",

                skip_invisible: !0,

                appear: null,

                load: null,

                placeholder: "http://bloghuts.bloghuts.netdna-cdn.com/front_images/loading.gif"

            };

        return i && (r !== i.failurelimit && (i.failure_limit = i.failurelimit, delete i.failurelimit), r !== i.effectspeed && (i.effect_speed = i.effectspeed, delete i.effectspeed), e.extend(c, i)), s = c.container === r || c.container === t ? a : e(c.container), 0 === c.event.indexOf("scroll") && s.bind(c.event, function () {

            return o()

        }), this.each(function () {

            var t = this,

                n = e(t);

            t.loaded = !1, (n.attr("src") === r || n.attr("src") === !1) && n.attr("src", c.placeholder), n.one("appear", function () {

                if (!this.loaded) {

                    if (c.appear) {

                        var r = l.length;

                        c.appear.call(t, r, c)

                    }

                    e("<img />").bind("load", function () {

                        var r = n.data(c.data_attribute);

                        n.hide(), n.is("img") ? n.attr("src", r) : n.css("background-image", "url('" + r + "')"), n[c.effect](c.effect_speed), t.loaded = !0;

                        var a = e.grep(l, function (e) {

                            return !e.loaded

                        });

                        if (l = e(a), c.load) {

                            var i = l.length;

                            c.load.call(t, i, c)

                        }

                    }).attr("src", n.data(c.data_attribute))

                }

            }), 0 !== c.event.indexOf("scroll") && n.bind(c.event, function () {

                t.loaded || n.trigger("appear")

            })

        }), a.bind("resize", function () {

            o()

        }), /iphone|ipod|ipad.*os 5/gi.test(navigator.appVersion) && a.bind("pageshow", function (t) {

            t.originalEvent && t.originalEvent.persisted && l.each(function () {

                e(this).trigger("appear")

            })

        }), e(n).ready(function () {

            o()

        }), this

    }, e.belowthefold = function (n, i) {

        var o;

        return o = i.container === r || i.container === t ? (t.innerHeight ? t.innerHeight : a.height()) + a.scrollTop() : e(i.container).offset().top + e(i.container).height(), o <= e(n).offset().top - i.threshold

    }, e.rightoffold = function (n, i) {

        var o;

        return o = i.container === r || i.container === t ? a.width() + a.scrollLeft() : e(i.container).offset().left + e(i.container).width(), o <= e(n).offset().left - i.threshold

    }, e.abovethetop = function (n, i) {

        var o;

        return o = i.container === r || i.container === t ? a.scrollTop() : e(i.container).offset().top, o >= e(n).offset().top + i.threshold + e(n).height()

    }, e.leftofbegin = function (n, i) {

        var o;

        return o = i.container === r || i.container === t ? a.scrollLeft() : e(i.container).offset().left, o >= e(n).offset().left + i.threshold + e(n).width()

    }, e.inviewport = function (t, n) {

        return !(e.rightoffold(t, n) || e.leftofbegin(t, n) || e.belowthefold(t, n) || e.abovethetop(t, n))

    }, e.extend(e.expr[":"], {

        "below-the-fold": function (t) {

            return e.belowthefold(t, {

                threshold: 0

            })

        },

        "above-the-top": function (t) {

            return !e.belowthefold(t, {

                threshold: 0

            })

        },

        "right-of-screen": function (t) {

            return e.rightoffold(t, {

                threshold: 0

            })

        },

        "left-of-screen": function (t) {

            return !e.rightoffold(t, {

                threshold: 0

            })

        },

        "in-viewport": function (t) {

            return e.inviewport(t, {

                threshold: 0

            })

        },

        "above-the-fold": function (t) {

            return !e.belowthefold(t, {

                threshold: 0

            })

        },

        "right-of-fold": function (t) {

            return e.rightoffold(t, {

                threshold: 0

            })

        },

        "left-of-fold": function (t) {

            return !e.rightoffold(t, {

                threshold: 0

            })

        }

    })

}(jQuery, window, document), ! function () {

    var e = null;

    window.PR_SHOULD_USE_CONTINUATION = !0,

        function () {

            function t(e) {

                function t(e) {

                    var t = e.charCodeAt(0);

                    if (92 !== t) return t;

                    var n = e.charAt(1);

                    return (t = u[n]) ? t : n >= "0" && "7" >= n ? parseInt(e.substring(1), 8) : "u" === n || "x" === n ? parseInt(e.substring(2), 16) : e.charCodeAt(1)

                }



                function n(e) {

                    return 32 > e ? (16 > e ? "\\x0" : "\\x") + e.toString(16) : (e = String.fromCharCode(e), "\\" === e || "-" === e || "]" === e || "^" === e ? "\\" + e : e)

                }



                function r(e) {

                    var r = e.substring(1, e.length - 1).match(/\\u[\dA-Fa-f]{4}|\\x[\dA-Fa-f]{2}|\\[0-3][0-7]{0,2}|\\[0-7]{1,2}|\\[\S\s]|[^\\]/g),

                        e = [],

                        a = "^" === r[0],

                        i = ["["];

                    a && i.push("^");

                    for (var a = a ? 1 : 0, o = r.length; o > a; ++a) {

                        var s = r[a];

                        if (/\\[bdsw]/i.test(s)) i.push(s);

                        else {

                            var l, s = t(s);

                            o > a + 2 && "-" === r[a + 1] ? (l = t(r[a + 2]), a += 2) : l = s, e.push([s, l]), 65 > l || s > 122 || (65 > l || s > 90 || e.push([32 | Math.max(65, s), 32 | Math.min(l, 90)]), 97 > l || s > 122 || e.push([-33 & Math.max(97, s), -33 & Math.min(l, 122)]))

                        }

                    }

                    for (e.sort(function (e, t) {

                        return e[0] - t[0] || t[1] - e[1]

                    }), r = [], o = [], a = 0; a < e.length; ++a) s = e[a], s[0] <= o[1] + 1 ? o[1] = Math.max(o[1], s[1]) : r.push(o = s);

                    for (a = 0; a < r.length; ++a) s = r[a], i.push(n(s[0])), s[1] > s[0] && (s[1] + 1 > s[0] && i.push("-"), i.push(n(s[1])));

                    return i.push("]"), i.join("")

                }



                function a(e) {

                    for (var t = e.source.match(/\[(?:[^\\\]]|\\[\S\s])*]|\\u[\dA-Fa-f]{4}|\\x[\dA-Fa-f]{2}|\\\d+|\\[^\dux]|\(\?[!:=]|[()^]|[^()[\\^]+/g), a = t.length, s = [], l = 0, c = 0; a > l; ++l) {

                        var d = t[l];

                        "(" === d ? ++c : "\\" === d.charAt(0) && (d = +d.substring(1)) && (c >= d ? s[d] = -1 : t[l] = n(d))

                    }

                    for (l = 1; l < s.length; ++l) - 1 === s[l] && (s[l] = ++i);

                    for (c = l = 0; a > l; ++l) d = t[l], "(" === d ? (++c, s[c] || (t[l] = "(?:")) : "\\" === d.charAt(0) && (d = +d.substring(1)) && c >= d && (t[l] = "\\" + s[d]);

                    for (l = 0; a > l; ++l) "^" === t[l] && "^" !== t[l + 1] && (t[l] = "");

                    if (e.ignoreCase && o)

                        for (l = 0; a > l; ++l) d = t[l], e = d.charAt(0), d.length >= 2 && "[" === e ? t[l] = r(d) : "\\" !== e && (t[l] = d.replace(/[A-Za-z]/g, function (e) {

                            return e = e.charCodeAt(0), "[" + String.fromCharCode(-33 & e, 32 | e) + "]"

                        }));

                    return t.join("")

                }

                for (var i = 0, o = !1, s = !1, l = 0, c = e.length; c > l; ++l) {

                    var d = e[l];

                    if (d.ignoreCase) s = !0;

                    else if (/[a-z]/i.test(d.source.replace(/\\u[\da-f]{4}|\\x[\da-f]{2}|\\[^UXux]/gi, ""))) {

                        o = !0, s = !1;

                        break

                    }

                }

                for (var u = {

                    b: 8,

                    t: 9,

                    n: 10,

                    v: 11,

                    f: 12,

                    r: 13

                }, f = [], l = 0, c = e.length; c > l; ++l) {

                    if (d = e[l], d.global || d.multiline) throw Error("" + d);

                    f.push("(?:" + a(d) + ")")

                }

                return RegExp(f.join("|"), s ? "gi" : "g")

            }



            function n(e, t) {

                function n(e) {

                    var l = e.nodeType;

                    if (1 == l) {

                        if (!r.test(e.className)) {

                            for (l = e.firstChild; l; l = l.nextSibling) n(l);

                            l = e.nodeName.toLowerCase(), ("br" === l || "li" === l) && (a[s] = "\n", o[s << 1] = i++, o[1 | s++ << 1] = e)

                        }

                    } else(3 == l || 4 == l) && (l = e.nodeValue, l.length && (l = t ? l.replace(/\r\n?/g, "\n") : l.replace(/[\t\n\r ]+/g, " "), a[s] = l, o[s << 1] = i, i += l.length, o[1 | s++ << 1] = e))

                }

                var r = /(?:^|\s)nocode(?:\s|$)/,

                    a = [],

                    i = 0,

                    o = [],

                    s = 0;

                return n(e), {

                    a: a.join("").replace(/\n$/, ""),

                    d: o

                }

            }



            function r(e, t, n, r) {

                t && (e = {

                    a: t,

                    e: e

                }, n(e), r.push.apply(r, e.g))

            }



            function a(e) {

                for (var t = void 0, n = e.firstChild; n; n = n.nextSibling) var r = n.nodeType,

                    t = 1 === r ? t ? e : n : 3 === r ? A.test(n.nodeValue) ? e : t : t;

                return t === e ? void 0 : t

            }



            function i(n, a) {

                function i(e) {

                    for (var t = e.e, n = [t, "pln"], d = 0, u = e.a.match(o) || [], f = {}, p = 0, g = u.length; g > p; ++p) {

                        var h, m = u[p],

                            v = f[m],

                            w = void 0;

                        if ("string" == typeof v) h = !1;

                        else {

                            var y = s[m.charAt(0)];

                            if (y) w = m.match(y[1]), v = y[0];

                            else {

                                for (h = 0; l > h; ++h)

                                    if (y = a[h], w = m.match(y[1])) {

                                        v = y[0];

                                        break

                                    }

                                w || (v = "pln")

                            }!(h = v.length >= 5 && "lang-" === v.substring(0, 5)) || w && "string" == typeof w[1] || (h = !1, v = "src"), h || (f[m] = v)

                        } if (y = d, d += m.length, h) {

                            h = w[1];

                            var b = m.indexOf(h),

                                A = b + h.length;

                            w[2] && (A = m.length - w[2].length, b = A - h.length), v = v.substring(5), r(t + y, m.substring(0, b), i, n), r(t + y + b, h, c(v, h), n), r(t + y + A, m.substring(A), i, n)

                        } else n.push(t + y, v)

                    }

                    e.g = n

                }

                var o, s = {};

                ! function () {

                    for (var r = n.concat(a), i = [], l = {}, c = 0, d = r.length; d > c; ++c) {

                        var u = r[c],

                            f = u[3];

                        if (f)

                            for (var p = f.length; --p >= 0;) s[f.charAt(p)] = u;

                        u = u[1], f = "" + u, l.hasOwnProperty(f) || (i.push(u), l[f] = e)

                    }

                    i.push(/[\S\s]/), o = t(i)

                }();

                var l = a.length;

                return i

            }



            function o(t) {

                var n = [],

                    r = [];

                t.tripleQuotedStrings ? n.push(["str", /^(?:'''(?:[^'\\]|\\[\S\s]|''?(?=[^']))*(?:'''|$)|"""(?:[^"\\]|\\[\S\s]|""?(?=[^"]))*(?:"""|$)|'(?:[^'\\]|\\[\S\s])*(?:'|$)|"(?:[^"\\]|\\[\S\s])*(?:"|$))/, e, "'\""]) : t.multiLineStrings ? n.push(["str", /^(?:'(?:[^'\\]|\\[\S\s])*(?:'|$)|"(?:[^"\\]|\\[\S\s])*(?:"|$)|`(?:[^\\`]|\\[\S\s])*(?:`|$))/, e, "'\"`"]) : n.push(["str", /^(?:'(?:[^\n\r'\\]|\\.)*(?:'|$)|"(?:[^\n\r"\\]|\\.)*(?:"|$))/, e, "\"'"]), t.verbatimStrings && r.push(["str", /^@"(?:[^"]|"")*(?:"|$)/, e]);

                var a = t.hashComments;

                if (a && (t.cStyleComments ? (a > 1 ? n.push(["com", /^#(?:##(?:[^#]|#(?!##))*(?:###|$)|.*)/, e, "#"]) : n.push(["com", /^#(?:(?:define|e(?:l|nd)if|else|error|ifn?def|include|line|pragma|undef|warning)\b|[^\n\r]*)/, e, "#"]), r.push(["str", /^<(?:(?:(?:\.\.\/)*|\/?)(?:[\w-]+(?:\/[\w-]+)+)?[\w-]+\.h(?:h|pp|\+\+)?|[a-z]\w*)>/, e])) : n.push(["com", /^#[^\n\r]*/, e, "#"])), t.cStyleComments && (r.push(["com", /^\/\/[^\n\r]*/, e]), r.push(["com", /^\/\*[\S\s]*?(?:\*\/|$)/, e])), a = t.regexLiterals) {

                    var o = (a = a > 1 ? "" : "\n\r") ? "." : "[\\S\\s]";

                    r.push(["lang-regex", RegExp("^(?:^^\\.?|[+-]|[!=]=?=?|\\#|%=?|&&?=?|\\(|\\*=?|[+\\-]=|->|\\/=?|::?|<<?=?|>>?>?=?|,|;|\\?|@|\\[|~|{|\\^\\^?=?|\\|\\|?=?|break|case|continue|delete|do|else|finally|instanceof|return|throw|try|typeof)\\s*(" + ("/(?=[^/*" + a + "])(?:[^/\\x5B\\x5C" + a + "]|\\x5C" + o + "|\\x5B(?:[^\\x5C\\x5D" + a + "]|\\x5C" + o + ")*(?:\\x5D|$))+/") + ")")])

                }

                return (a = t.types) && r.push(["typ", a]), a = ("" + t.keywords).replace(/^ | $/g, ""), a.length && r.push(["kwd", RegExp("^(?:" + a.replace(/[\s,]+/g, "|") + ")\\b"), e]), n.push(["pln", /^\s+/, e, " \r\n	� "]), a = "^.[^\\s\\w.$@'\"`/\\\\]*", t.regexLiterals && (a += "(?!s*/)"), r.push(["lit", /^@[$_a-z][\w$@]*/i, e], ["typ", /^(?:[@_]?[A-Z]+[a-z][\w$@]*|\w+_t\b)/, e], ["pln", /^[$_a-z][\w$@]*/i, e], ["lit", /^(?:0x[\da-f]+|(?:\d(?:_\d+)*\d*(?:\.\d*)?|\.\d\+)(?:e[+-]?\d+)?)[a-z]*/i, e, "0123456789"], ["pln", /^\\[\S\s]?/, e], ["pun", RegExp(a), e]), i(n, r)

            }



            function s(e, t, n) {

                function r(e) {

                    var t = e.nodeType;

                    if (1 != t || i.test(e.className)) {

                        if ((3 == t || 4 == t) && n) {

                            var l = e.nodeValue,

                                c = l.match(o);

                            c && (t = l.substring(0, c.index), e.nodeValue = t, (l = l.substring(c.index + c[0].length)) && e.parentNode.insertBefore(s.createTextNode(l), e.nextSibling), a(e), t || e.parentNode.removeChild(e))

                        }

                    } else if ("br" === e.nodeName) a(e), e.parentNode && e.parentNode.removeChild(e);

                    else

                        for (e = e.firstChild; e; e = e.nextSibling) r(e)

                }



                function a(e) {

                    function t(e, n) {

                        var r = n ? e.cloneNode(!1) : e,

                            a = e.parentNode;

                        if (a) {

                            var a = t(a, 1),

                                i = e.nextSibling;

                            a.appendChild(r);

                            for (var o = i; o; o = i) i = o.nextSibling, a.appendChild(o)

                        }

                        return r

                    }

                    for (; !e.nextSibling;)

                        if (e = e.parentNode, !e) return;

                    for (var n, e = t(e.nextSibling, 0);

                        (n = e.parentNode) && 1 === n.nodeType;) e = n;

                    c.push(e)

                }

                for (var i = /(?:^|\s)nocode(?:\s|$)/, o = /\r\n?|\n/, s = e.ownerDocument, l = s.createElement("li"); e.firstChild;) l.appendChild(e.firstChild);

                for (var c = [l], d = 0; d < c.length; ++d) r(c[d]);

                t === (0 | t) && c[0].setAttribute("value", t);

                var u = s.createElement("ol");

                u.className = "linenums";

                for (var t = Math.max(0, 0 | t - 1) || 0, d = 0, f = c.length; f > d; ++d) l = c[d], l.className = "L" + (d + t) % 10, l.firstChild || l.appendChild(s.createTextNode("� ")), u.appendChild(l);

                e.appendChild(u)

            }



            function l(e, t) {

                for (var n = t.length; --n >= 0;) {

                    var r = t[n];

                    x.hasOwnProperty(r) ? u.console && console.warn("cannot override language handler %s", r) : x[r] = e

                }

            }



            function c(e, t) {

                return e && x.hasOwnProperty(e) || (e = /^\s*</.test(t) ? "default-markup" : "default-code"), x[e]

            }



            function d(e) {

                var t = e.h;

                try {

                    var r = n(e.c, e.i),

                        a = r.a;

                    e.a = a, e.d = r.d, e.e = 0, c(t, a)(e);

                    var i = /\bMSIE\s(\d+)/.exec(navigator.userAgent),

                        i = i && +i[1] <= 8,

                        t = /\n/g,

                        o = e.a,

                        s = o.length,

                        r = 0,

                        l = e.d,

                        d = l.length,

                        a = 0,

                        f = e.g,

                        p = f.length,

                        g = 0;

                    f[p] = s;

                    var h, m;

                    for (m = h = 0; p > m;) f[m] !== f[m + 2] ? (f[h++] = f[m++], f[h++] = f[m++]) : m += 2;

                    for (p = h, m = h = 0; p > m;) {

                        for (var v = f[m], w = f[m + 1], y = m + 2; p >= y + 2 && f[y + 1] === w;) y += 2;

                        f[h++] = v, f[h++] = w, m = y

                    }

                    f.length = h;

                    var b, A = e.c;

                    A && (b = A.style.display, A.style.display = "none");

                    try {

                        for (; d > a;) {

                            var N, x = l[a + 2] || s,

                                S = f[g + 2] || s,

                                y = Math.min(x, S),

                                C = l[a + 1];

                            if (1 !== C.nodeType && (N = o.substring(r, y))) {

                                i && (N = N.replace(t, "\r")), C.nodeValue = N;

                                var k = C.ownerDocument,

                                    E = k.createElement("span");

                                E.className = f[g + 1];

                                var _ = C.parentNode;

                                _.replaceChild(E, C), E.appendChild(C), x > r && (l[a + 1] = C = k.createTextNode(o.substring(y, x)), _.insertBefore(C, E.nextSibling))

                            }

                            r = y, r >= x && (a += 2), r >= S && (g += 2)

                        }

                    } finally {

                        A && (A.style.display = b)

                    }

                } catch ($) {

                    u.console && console.log($ && $.stack || $)

                }

            }

            var u = window,

                f = ["break,continue,do,else,for,if,return,while"],

                p = [

                    [f, "auto,case,char,const,default,double,enum,extern,float,goto,inline,int,long,register,short,signed,sizeof,static,struct,switch,typedef,union,unsigned,void,volatile"], "catch,class,delete,false,import,new,operator,private,protected,public,this,throw,true,try,typeof"

                ],

                g = [p, "alignof,align_union,asm,axiom,bool,concept,concept_map,const_cast,constexpr,decltype,delegate,dynamic_cast,explicit,export,friend,generic,late_check,mutable,namespace,nullptr,property,reinterpret_cast,static_assert,static_cast,template,typeid,typename,using,virtual,where"],

                h = [p, "abstract,assert,boolean,byte,extends,final,finally,implements,import,instanceof,interface,null,native,package,strictfp,super,synchronized,throws,transient"],

                m = [h, "as,base,by,checked,decimal,delegate,descending,dynamic,event,fixed,foreach,from,group,implicit,in,internal,into,is,let,lock,object,out,override,orderby,params,partial,readonly,ref,sbyte,sealed,stackalloc,string,select,uint,ulong,unchecked,unsafe,ushort,var,virtual,where"],

                p = [p, "debugger,eval,export,function,get,null,set,undefined,var,with,Infinity,NaN"],

                v = [f, "and,as,assert,class,def,del,elif,except,exec,finally,from,global,import,in,is,lambda,nonlocal,not,or,pass,print,raise,try,with,yield,False,True,None"],

                w = [f, "alias,and,begin,case,class,def,defined,elsif,end,ensure,false,in,module,next,nil,not,or,redo,rescue,retry,self,super,then,true,undef,unless,until,when,yield,BEGIN,END"],

                y = [f, "as,assert,const,copy,drop,enum,extern,fail,false,fn,impl,let,log,loop,match,mod,move,mut,priv,pub,pure,ref,self,static,struct,true,trait,type,unsafe,use"],

                f = [f, "case,done,elif,esac,eval,fi,function,in,local,set,then,until"],

                b = /^(DIR|FILE|vector|(de|priority_)?queue|list|stack|(const_)?iterator|(multi)?(set|map)|bitset|u?(int|float)\d*)\b/,

                A = /\S/,

                N = o({

                    keywords: [g, m, p, "caller,delete,die,do,dump,elsif,eval,exit,foreach,for,goto,if,import,last,local,my,next,no,our,print,package,redo,require,sub,undef,unless,until,use,wantarray,while,BEGIN,END", v, w, f],

                    hashComments: !0,

                    cStyleComments: !0,

                    multiLineStrings: !0,

                    regexLiterals: !0

                }),

                x = {};

            l(N, ["default-code"]), l(i([], [

                ["pln", /^[^<?]+/],

                ["dec", /^<!\w[^>]*(?:>|$)/],

                ["com", /^<\!--[\S\s]*?(?:--\>|$)/],

                ["lang-", /^<\?([\S\s]+?)(?:\?>|$)/],

                ["lang-", /^<%([\S\s]+?)(?:%>|$)/],

                ["pun", /^(?:<[%?]|[%?]>)/],

                ["lang-", /^<xmp\b[^>]*>([\S\s]+?)<\/xmp\b[^>]*>/i],

                ["lang-js", /^<script\b[^>]*>([\S\s]*?)(<\/script\b[^>]*>)/i],

                ["lang-css", /^<style\b[^>]*>([\S\s]*?)(<\/style\b[^>]*>)/i],

                ["lang-in.tag", /^(<\/?[a-z][^<>]*>)/i]

            ]), ["default-markup", "htm", "html", "mxml", "xhtml", "xml", "xsl"]), l(i([

                ["pln", /^\s+/, e, " 	\r\n"],

                ["atv", /^(?:"[^"]*"?|'[^']*'?)/, e, "\"'"]

            ], [

                ["tag", /^^<\/?[a-z](?:[\w-.:]*\w)?|\/?>$/i],

                ["atn", /^(?!style[\s=]|on)[a-z](?:[\w:-]*\w)?/i],

                ["lang-uq.val", /^=\s*([^\s"'>]*(?:[^\s"'/>]|\/(?=\s)))/],

                ["pun", /^[/<->]+/],

                ["lang-js", /^on\w+\s*=\s*"([^"]+)"/i],

                ["lang-js", /^on\w+\s*=\s*'([^']+)'/i],

                ["lang-js", /^on\w+\s*=\s*([^\s"'>]+)/i],

                ["lang-css", /^style\s*=\s*"([^"]+)"/i],

                ["lang-css", /^style\s*=\s*'([^']+)'/i],

                ["lang-css", /^style\s*=\s*([^\s"'>]+)/i]

            ]), ["in.tag"]), l(i([], [

                ["atv", /^[\S\s]+/]

            ]), ["uq.val"]), l(o({

                keywords: g,

                hashComments: !0,

                cStyleComments: !0,

                types: b

            }), ["c", "cc", "cpp", "cxx", "cyc", "m"]), l(o({

                keywords: "null,true,false"

            }), ["json"]), l(o({

                keywords: m,

                hashComments: !0,

                cStyleComments: !0,

                verbatimStrings: !0,

                types: b

            }), ["cs"]), l(o({

                keywords: h,

                cStyleComments: !0

            }), ["java"]), l(o({

                keywords: f,

                hashComments: !0,

                multiLineStrings: !0

            }), ["bash", "bsh", "csh", "sh"]), l(o({

                keywords: v,

                hashComments: !0,

                multiLineStrings: !0,

                tripleQuotedStrings: !0

            }), ["cv", "py", "python"]), l(o({

                keywords: "caller,delete,die,do,dump,elsif,eval,exit,foreach,for,goto,if,import,last,local,my,next,no,our,print,package,redo,require,sub,undef,unless,until,use,wantarray,while,BEGIN,END",

                hashComments: !0,

                multiLineStrings: !0,

                regexLiterals: 2

            }), ["perl", "pl", "pm"]), l(o({

                keywords: w,

                hashComments: !0,

                multiLineStrings: !0,

                regexLiterals: !0

            }), ["rb", "ruby"]), l(o({

                keywords: p,

                cStyleComments: !0,

                regexLiterals: !0

            }), ["javascript", "js"]), l(o({

                keywords: "all,and,by,catch,class,else,extends,false,finally,for,if,in,is,isnt,loop,new,no,not,null,of,off,on,or,return,super,then,throw,true,try,unless,until,when,while,yes",

                hashComments: 3,

                cStyleComments: !0,

                multilineStrings: !0,

                tripleQuotedStrings: !0,

                regexLiterals: !0

            }), ["coffee"]), l(o({

                keywords: y,

                cStyleComments: !0,

                multilineStrings: !0

            }), ["rc", "rs", "rust"]), l(i([], [

                ["str", /^[\S\s]+/]

            ]), ["regex"]);

            var S = u.PR = {

                createSimpleLexer: i,

                registerLangHandler: l,

                sourceDecorator: o,

                PR_ATTRIB_NAME: "atn",

                PR_ATTRIB_VALUE: "atv",

                PR_COMMENT: "com",

                PR_DECLARATION: "dec",

                PR_KEYWORD: "kwd",

                PR_LITERAL: "lit",

                PR_NOCODE: "nocode",

                PR_PLAIN: "pln",

                PR_PUNCTUATION: "pun",

                PR_SOURCE: "src",

                PR_STRING: "str",

                PR_TAG: "tag",

                PR_TYPE: "typ",

                prettyPrintOne: u.prettyPrintOne = function (e, t, n) {

                    var r = document.createElement("div");

                    return r.innerHTML = "<pre>" + e + "</pre>", r = r.firstChild, n && s(r, n, !0), d({

                        h: t,

                        j: n,

                        c: r,

                        i: 1

                    }), r.innerHTML

                },

                prettyPrint: u.prettyPrint = function (t, n) {

                    function r() {

                        for (var n = u.PR_SHOULD_USE_CONTINUATION ? g.now() + 250 : 1 / 0; m < l.length && g.now() < n; m++) {

                            for (var i = l[m], c = x, f = i; f = f.previousSibling;) {

                                var p = f.nodeType,

                                    S = (7 === p || 8 === p) && f.nodeValue;

                                if (S ? !/^\??prettify\b/.test(S) : 3 !== p || /\S/.test(f.nodeValue)) break;

                                if (S) {

                                    c = {}, S.replace(/\b(\w+)=([\w%+\-.:]+)/g, function (e, t, n) {

                                        c[t] = n

                                    });

                                    break

                                }

                            }

                            if (f = i.className, (c !== x || w.test(f)) && !y.test(f)) {

                                for (p = !1, S = i.parentNode; S; S = S.parentNode)

                                    if (N.test(S.tagName) && S.className && w.test(S.className)) {

                                        p = !0;

                                        break

                                    }

                                if (!p) {

                                    if (i.className += " prettyprinted", p = c.lang, !p) {

                                        var C, p = f.match(v);

                                        !p && (C = a(i)) && A.test(C.tagName) && (p = C.className.match(v)), p && (p = p[1])

                                    }

                                    if (b.test(i.tagName)) S = 1;

                                    else var S = i.currentStyle,

                                        k = o.defaultView,

                                        S = (S = S ? S.whiteSpace : k && k.getComputedStyle ? k.getComputedStyle(i, e).getPropertyValue("white-space") : 0) && "pre" === S.substring(0, 3);

                                    k = c.linenums, (k = "true" === k || +k) || (k = (k = f.match(/\blinenums\b(?::(\d+))?/)) ? k[1] && k[1].length ? +k[1] : !0 : !1), k && s(i, k, S), h = {

                                        h: p,

                                        c: i,

                                        j: k,

                                        i: S

                                    }, d(h)

                                }

                            }

                        }

                        m < l.length ? setTimeout(r, 250) : "function" == typeof t && t()

                    }

                    for (var i = n || document.body, o = i.ownerDocument || document, i = [i.getElementsByTagName("pre"), i.getElementsByTagName("code"), i.getElementsByTagName("xmp")], l = [], c = 0; c < i.length; ++c)

                        for (var f = 0, p = i[c].length; p > f; ++f) l.push(i[c][f]);

                    var i = e,

                        g = Date;

                    g.now || (g = {

                        now: function () {

                            return +new Date

                        }

                    });

                    var h, m = 0,

                        v = /\blang(?:uage)?-([\w.]+)(?!\S)/,

                        w = /\bprettyprint\b/,

                        y = /\bprettyprinted\b/,

                        b = /pre|xmp/i,

                        A = /^code$/i,

                        N = /^(?:pre|code|xmp)$/i,

                        x = {};

                    r()

                }

            };

            "function" == typeof define && define.amd && define("google-code-prettify", [], function () {

                return S

            })

        }()

}(),

/*!

 * Socialite v2.0

 * http://socialitejs.com

 * Copyright (c) 2011 David Bushell

 * Dual-licensed under the BSD or MIT licenses: http://socialitejs.com/license.txt

 */

window.Socialite = function (e, t, n) {

        "use strict";

        var r = 0,

            a = [],

            i = {},

            o = {},

            s = /^($|loaded|complete)/,

            l = e.encodeURIComponent,

            c = {

                settings: {},

                trim: function (e) {

                    return e.trim ? e.trim() : e.replace(/^\s+|\s+$/g, "")

                },

                hasClass: function (e, t) {

                    return -1 !== (" " + e.className + " ").indexOf(" " + t + " ")

                },

                addClass: function (e, t) {

                    c.hasClass(e, t) || (e.className = "" === e.className ? t : e.className + " " + t)

                },

                removeClass: function (e, t) {

                    e.className = c.trim(" " + e.className + " ".replace(" " + t + " ", " "))

                },

                extendObject: function (e, t, r) {

                    for (var a in t) {

                        var i = e[a] !== n;

                        i && "object" == typeof t[a] ? c.extendObject(e[a], t[a], r) : (r || !i) && (e[a] = t[a])

                    }

                },

                getElements: function (e, t) {

                    for (var n = 0, r = [], a = !!e.getElementsByClassName, i = a ? e.getElementsByClassName(t) : e.getElementsByTagName("*"); i.length > n; n++)(a || c.hasClass(i[n], t)) && r.push(i[n]);

                    return r

                },

                getDataAttributes: function (e, t, n) {

                    for (var r = 0, a = "", i = {}, o = e.attributes; o.length > r; r++) {

                        var s = o[r].name,

                            c = o[r].value;

                        c.length && 0 === s.indexOf("data-") && (t && (s = s.substring(5)), n ? i[s] = c : a += l(s) + "=" + l(c) + "&")

                    }

                    return n ? i : a

                },

                copyDataAttributes: function (e, t, n, r) {

                    var a = c.getDataAttributes(e, n, !0);

                    for (var i in a) t.setAttribute(r ? i.replace(/-/g, "_") : i, a[i])

                },

                createIframe: function (e, n) {

                    var r = t.createElement("iframe");

                    return r.style.cssText = "overflow: hidden; border: none;", c.extendObject(r, {

                        src: e,

                        allowtransparency: "true",

                        frameborder: "0",

                        scrolling: "no"

                    }, !0), n && (r.onload = r.onreadystatechange = function () {

                        s.test(r.readyState || "") && (r.onload = r.onreadystatechange = null, c.activateInstance(n))

                    }), r

                },

                networkReady: function (e) {

                    return i[e] ? i[e].loaded : n

                },

                appendNetwork: function (e) {

                    if (e && !e.appended) {

                        if ("function" == typeof e.append && e.append(e) === !1) return e.appended = e.loaded = !0, c.activateAll(e), n;

                        e.script && (e.el = t.createElement("script"), c.extendObject(e.el, e.script, !0), e.el.async = !0, e.el.onload = e.el.onreadystatechange = function () {

                            if (s.test(e.el.readyState || "")) {

                                if (e.el.onload = e.el.onreadystatechange = null, e.loaded = !0, "function" == typeof e.onload && e.onload(e) === !1) return;

                                c.activateAll(e)

                            }

                        }, t.body.appendChild(e.el)), e.appended = !0

                    }

                },

                removeNetwork: function (e) {

                    return c.networkReady(e.name) ? (e.el.parentNode && e.el.parentNode.removeChild(e.el), !(e.appended = e.loaded = !1)) : !1

                },

                reloadNetwork: function (e) {

                    var t = i[e];

                    t && c.removeNetwork(t) && c.appendNetwork(t)

                },

                createInstance: function (e, t) {

                    var i = !0,

                        o = {

                            el: e,

                            uid: r++,

                            widget: t

                        };

                    return a.push(o), t.process !== n && (i = "function" == typeof t.process ? t.process(o) : !1), i && c.processInstance(o), o.el.setAttribute("data-socialite", o.uid), o.el.className = "socialite " + t.name + " socialite-instance", o

                },

                processInstance: function (e) {

                    var n = e.el;

                    e.el = t.createElement("div"), e.el.className = n.className, c.copyDataAttributes(n, e.el), "a" !== n.nodeName.toLowerCase() || n.getAttribute("data-default-href") || e.el.setAttribute("data-default-href", n.getAttribute("href"));

                    var r = n.parentNode;

                    r.insertBefore(e.el, n), r.removeChild(n)

                },

                activateInstance: function (e) {

                    return e && !e.loaded ? (e.loaded = !0, "function" == typeof e.widget.activate && e.widget.activate(e), c.addClass(e.el, "socialite-loaded"), e.onload ? e.onload(e.el) : null) : n

                },

                activateAll: function (e) {

                    "string" == typeof e && (e = i[e]);

                    for (var t = 0; a.length > t; t++) {

                        var n = a[t];

                        n.init && n.widget.network === e && c.activateInstance(n)

                    }

                },

                load: function (e, r, i, s, l) {

                    if (e = e && "object" == typeof e && 1 === e.nodeType ? e : t, !r || "object" != typeof r) return c.load(e, c.getElements(e, "socialite"), i, s, l), n;

                    var d;

                    if (/Array/.test(Object.prototype.toString.call(r)))

                        for (d = 0; r.length > d; d++) c.load(e, r[d], i, s, l);

                    else if (1 === r.nodeType) {

                        if (!i || !o[i]) {

                            i = null;

                            var u = r.className.split(" ");

                            for (d = 0; u.length > d; d++)

                                if (o[u[d]]) {

                                    i = u[d];

                                    break

                                }

                            if (!i) return

                        }

                        var f, p = o[i],

                            g = parseInt(r.getAttribute("data-socialite"), 10);

                        if (isNaN(g)) f = c.createInstance(r, p);

                        else

                            for (d = 0; a.length > d; d++)

                                if (a[d].uid === g) {

                                    f = a[d];

                                    break

                                }!l && f && (f.init || (f.init = !0, f.onload = "function" == typeof s ? s : null, p.init(f)), p.network.appended ? c.networkReady(p.network.name) && c.activateInstance(f) : c.appendNetwork(p.network))

                    }

                },

                activate: function (t, n, r) {

                    e.Socialite.load(null, t, n, r)

                },

                process: function (t, n, r) {

                    e.Socialite.load(t, n, r, null, !0)

                },

                network: function (e, t) {

                    i[e] = {

                        name: e,

                        el: null,

                        appended: !1,

                        loaded: !1,

                        widgets: {}

                    }, t && c.extendObject(i[e], t)

                },

                widget: function (e, t, n) {

                    n.name = e + "-" + t, i[e] && !o[n.name] && (n.network = i[e], i[e].widgets[t] = o[n.name] = n)

                },

                setup: function (e) {

                    c.extendObject(c.settings, e, !0)

                }

            };

        return c

    }(window, window.document),

    function (e, n, r) {

        r.setup({

            facebook: {

                lang: "en_GB",

                appId: null

            },

            twitter: {

                lang: "en"

            },

            googleplus: {

                lang: "en-GB"

            }

        }), r.network("facebook", {

            script: {

                src: "//connect.facebook.net/{{language}}/all.js",

                id: "facebook-jssdk"

            },

            append: function (t) {

                var a = n.createElement("div"),

                    i = r.settings.facebook,

                    o = {

                        onlike: "edge.create",

                        onunlike: "edge.remove",

                        onsend: "message.send"

                    };

                a.id = "fb-root", n.body.appendChild(a), t.script.src = t.script.src.replace("{{language}}", i.lang), e.fbAsyncInit = function () {

                    e.FB.init({

                        appId: i.appId,

                        xfbml: !0

                    });

                    for (var t in o) "function" == typeof i[t] && e.FB.Event.subscribe(o[t], i[t])

                }

            }

        }), r.widget("facebook", "like", {

            init: function (t) {

                var a = n.createElement("div");

                a.className = "fb-like", r.copyDataAttributes(t.el, a), t.el.appendChild(a), e.FB && e.FB.XFBML && e.FB.XFBML.parse(t.el)

            }

        }), r.network("twitter", {

            script: {

                src: "//platform.twitter.com/widgets.js",

                id: "twitter-wjs",

                charset: "utf-8"

            },

            append: function () {

                var n = "object" != typeof e.twttr,

                    a = r.settings.twitter,

                    i = ["click", "tweet", "retweet", "favorite", "follow"];

                return n && (e.twttr = t = {

                    _e: [],

                    ready: function (e) {

                        t._e.push(e)

                    }

                }), e.twttr.ready(function (e) {

                    for (var t = 0; i.length > t; t++) {

                        var n = i[t];

                        "function" == typeof a["on" + n] && e.events.bind(n, a["on" + n])

                    }

                    r.activateAll("twitter")

                }), n

            }

        });

        var a = function (e) {

                var t = n.createElement("a");

                t.className = e.widget.name + "-button", r.copyDataAttributes(e.el, t), t.setAttribute("href", e.el.getAttribute("data-default-href")), t.setAttribute("data-lang", e.el.getAttribute("data-lang") || r.settings.twitter.lang), e.el.appendChild(t)

            },

            i = function () {

                e.twttr && "object" == typeof e.twttr.widgets && "function" == typeof e.twttr.widgets.load && e.twttr.widgets.load()

            };

        r.widget("twitter", "share", {

            init: a,

            activate: i

        }), r.widget("twitter", "follow", {

            init: a,

            activate: i

        }), r.widget("twitter", "hashtag", {

            init: a,

            activate: i

        }), r.widget("twitter", "mention", {

            init: a,

            activate: i

        }), r.widget("twitter", "embed", {

            process: function (e) {

                e.innerEl = e.el, e.innerEl.getAttribute("data-lang") || e.innerEl.setAttribute("data-lang", r.settings.twitter.lang), e.el = n.createElement("div"), e.el.className = e.innerEl.className, e.innerEl.className = "", e.innerEl.parentNode.insertBefore(e.el, e.innerEl), e.el.appendChild(e.innerEl)

            },

            init: function (e) {

                e.innerEl.className = "twitter-tweet"

            },

            activate: i

        }), r.network("googleplus", {

            script: {

                src: "//apis.google.com/js/plusone.js"

            },

            append: function () {

                return e.gapi ? !1 : (e.___gcfg = {

                    lang: r.settings.googleplus.lang,

                    parsetags: "explicit"

                }, void 0)

            }

        });

        var o = function (e) {

                var t = n.createElement("div");

                t.className = "g-" + e.widget.gtype, r.copyDataAttributes(e.el, t), e.el.appendChild(t), e.gplusEl = t

            },

            s = function (e, t) {

                return "function" != typeof t ? null : function (n) {

                    t(e.el, n)

                }

            },

            l = function (t) {

                var n = t.widget.gtype;

                if (e.gapi && e.gapi[n]) {

                    for (var a = r.settings.googleplus, i = r.getDataAttributes(t.el, !0, !0), o = ["onstartinteraction", "onendinteraction", "callback"], l = 0; o.length > l; l++) i[o[l]] = s(t, a[o[l]]);

                    e.gapi[n].render(t.gplusEl, i)

                }

            };

        r.widget("googleplus", "one", {

            init: o,

            activate: l,

            gtype: "plusone"

        }), r.widget("googleplus", "share", {

            init: o,

            activate: l,

            gtype: "plus"

        }), r.widget("googleplus", "badge", {

            init: o,

            activate: l,

            gtype: "plus"

        }), r.network("linkedin", {

            script: {

                src: "//platform.linkedin.com/in.js"

            }

        });

        var c = function (t) {

            var a = n.createElement("script");

            a.type = "IN/" + t.widget.intype, r.copyDataAttributes(t.el, a), t.el.appendChild(a), "object" == typeof e.IN && "function" == typeof e.IN.parse && (e.IN.parse(t.el), r.activateInstance(t))

        };

        r.widget("linkedin", "share", {

            init: c,

            intype: "Share"

        }), r.widget("linkedin", "recommend", {

            init: c,

            intype: "RecommendProduct"

        })

    }(window, window.document, window.Socialite),

    function () {

        var e = window._socialite;

        if (/Array/.test(Object.prototype.toString.call(e)))

            for (var t = 0, n = e.length; n > t; t++) "function" == typeof e[t] && e[t]()

    }(), $(function () {

        $("pre").not(".notpretty").addClass("prettyprint"), prettyPrint(), $(window).one("scroll resize", function () {

            Socialite.load()

        }), $("#enable_disqus").on("click", function () {

            $(this).hide(), $("#pastie").fadeIn("fast");

            var e = "appelsiini";

            ! function () {

                var t = document.createElement("script");

                t.type = "text/javascript", t.async = !0, t.src = "//" + e + ".disqus.com/embed.js", (document.getElementsByTagName("head")[0] || document.getElementsByTagName("body")[0]).appendChild(t)

            }()

        }), $("a.track").on("click", function () {

            var e = $(this).data("label"),

                t = $(this).data("action"),

                n = $(this).attr("target"),

                r = $(this).attr("href");

            try {

                _gaq.push(["_trackEvent", "Link clicked", t, e])

            } catch (a) {}

            return n ? window.open(r, n) : setTimeout(function () {

                window.location = r

            }, 100), !1

        })

    }), $(function () {

        $(".container img").lazyload()

    });