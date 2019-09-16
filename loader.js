/*global window,mailru:true*/
/*jslint sloppy:true*/
if (typeof mailru !== 'object') {
    mailru = {};
}

(function (window, undefined) {
    var loader,
        document = window.document,
        readyModules = [],
        onReadyCallbacks = [],
        protocol,
        hosts;

    function detectBrowser () {
        var ua = window.navigator.userAgent,
            tem = ua.match(/(OPR|Edge|Amigo)\/(\d+)/),
            result = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];

        if(/trident/i.test(result[1])){
            tem =  /\brv[ :]+(\d+)/g.exec(ua) || [];
            result = ['MSIE', tem[1]];
        } else if (result[1]=== 'Chrome' && tem !== null) {
            if (tem[1] === 'OPR') {
                result = ['Opera', tem[2]];
            } else {
                result = [tem[1], tem[2]];
            }
        } else {
            if (result[2]) {
                result = [result[1], result[2]]
            } else {
                result = [navigator.appName, navigator.appVersion]
            }

            tem = ua.match(/version\/(\d+)/i);
            if (tem !== null) {
                result.splice(1, 1, tem[1]);
            }
        }

        return {
            name: result[0].toLowerCase(),
            version: result[1].toLowerCase()
        };
    }

    function extend(dst, src) {
        var p;

        for (p in src) {
            if (src.hasOwnProperty(p) && p != 0) {
                if (dst.hasOwnProperty(p)) {
                    extend(dst[p], src[p]);
                } else {
                    dst[p] = src[p];
                }
            }
        }
    }

    if (window.location.protocol === 'https:') {
        protocol = 'https://';
    } else {
        protocol = 'http://';
    }

    hosts = {
        appsmail: protocol + 'www.appsmail.ru/',
        connect: protocol + 'connect.mail.ru/',
        imgsmail: protocol + 'my2.imgsmail.ru/',
        mymail: protocol + 'my.mail.ru/'
    };

    mailru.browser = detectBrowser();

    if (mailru.browser.name === 'opera' && mailru.browser.version < 15) {
        mailru.isOpera = true;
    } else if (mailru.browser.name === 'msie') {
        mailru.isIE = true;
    }

    (new Image()).src = protocol + 'my.mail.ru/grstat?name=my.api.browsers.total:my.api.browsers.' + mailru.browser.name + '.' + mailru.browser.version + '&r=' + Math.random();

    loader = {
        modules: {
            receiver: 2,
            proxy: 1,
            api: 16,
            xdm: 1
        },
        require: function (module, onready, deferLoad) {
            var moduleName,
                moduleVersion,
                scriptTag,
                src = this.getHost('imgsmail') + 'mail/ru/images/js/connect/';

            if (module.name) {
                moduleName = module.name;
                if (module.version) {
                    moduleVersion = module.version;
                } else {
                    moduleVersion = 'latest';
                }
            } else {
                moduleName = module;
            }

            if (readyModules[moduleName]) {
                onready();
            } else {
                src += moduleName  + '/';
                if (moduleVersion) {
                    src += moduleVersion + '/';
                }
                src += moduleName;

                if (!module.dev) {
                    src += '_min';
                }

                if (!onReadyCallbacks[moduleName]) {
                    if (onReadyCallbacks[moduleName] === undefined) {
                        onReadyCallbacks[moduleName] = [];
                    }
                    onReadyCallbacks[moduleName].push(onready);

                    scriptTag = document.createElement('script');

                    scriptTag.type = 'text/javascript';
                    scriptTag.src = src + '.js?' + this.modules[moduleName];

                    if (deferLoad) {
                        scriptTag.defer = "defer";
                    }

                    document.getElementsByTagName('head')[0].appendChild(scriptTag);

                } else {
                    onReadyCallbacks[moduleName].push(onready);
                }
            }
        },
        onready: function (module) {
            var i,
                callbacks = onReadyCallbacks[module],
                throwingMatch = location.href.match(/throwing=1/i),
                throwExceptions = (throwingMatch && throwingMatch.length > 0);

            if (callbacks) {
                readyModules[module] = true;

                if (callbacks.length) {
                    for (i = 0; i < callbacks.length; i += 1) {
                        if (!throwExceptions) {
                            try{
                                callbacks[i]();
                            } catch (e) {
                                // РўСѓС‚ РєР°Рє Р±С‹ С‡С‚Рѕ-С‚Рѕ РЅСѓР¶РЅРѕ СЃРґРµР»Р°С‚СЊ
                            }
                        } else {
                            callbacks[i]();
                        }
                    }
                }
            }
        },
        getHost: function (hostname) {
            return hosts[hostname];
        },
        getEnv: function () {
            var isHttps = window.location.protocol === 'https:',
                prerelease = window.location.href.match(/__prerelease/i) !== null,
                branchMatch = window.location.href.match(/__branch=([a-z0-9\-]*)/i),
                branch = (branchMatch && branchMatch.length > 0) ? branchMatch[1] : '';

            return { 'branch': branch, 'isHttps': isHttps, 'prerelease': prerelease };
        },
        getMode: function (moduleEnv) {
            //default mode is always http-live
            var mode = 'http-live';

            // if current protocol is HTTPS and the branch is set, all content will be served from alphas via https,
            // branch parameter will be persisted in all consequent URLs
            if (moduleEnv.branch !== '' && moduleEnv.isHttps) {
                mode = 'https-alpha';
            } else if (moduleEnv.branch !== '') {
                // if current protocol is not https but branch is set, content will be served from alphas with branch
                // via http, branch will be persisted in all consequent URLs
                mode = 'http-alpha';
            } else if (moduleEnv.prerelease) {
                mode = 'http-prerelease'; // myalpha6
            } else if (moduleEnv.isHttps) {
                // if current protocol is https and no branch is set, then it's a live site with
                // https, all content should be served from live https
                mode = 'https-live';
            }

            // if no conditions apply, it's just a live site served via http
            return mode;
        }
    };

    // mailru.loader can be either not initialised completely or can be initialised only partly
    if (mailru.loader) {
        // initialised, but only partly
        if (!mailru.loader.onready) {
            extend(mailru.loader, loader);
        }
    } else {
        // wasn't initialised completely
        mailru.loader = loader;
    }

    mailru.isApp = window.name.indexOf('mailruapp') !== -1;

    if (window.postMessage) {
        mailru.intercomType = 'event';
    } else {
        mailru.intercomType = 'hash';
    }

    mailru.init = function (onready, private_key, DOMFlashId) {
        mailru.loader.require('api', function () {
            var el;

            try {
                mailru.app.init(private_key);
            } catch(e) {

            }

            if (DOMFlashId && (el = document.getElementById(DOMFlashId))) {
                window.setTimeout(onready, 1);
                mailru.events.listen('event', function (name, data) {
                    document.getElementById(DOMFlashId).mailruEvent(name, data);
                });
            }
        });
    };

    mailru.autoInit = (function () {
        if (!mailru.disableAutoInit) {
            var a = document.getElementsByTagName('a'),
                al = a.length,
                i;

            for(i = 0; i < al; i += 1) {
                if (typeof a[i] !== 'undefined' && a[i].className.indexOf('mrc__plugin') != -1) {
                    mailru.loader.require('api', function(){
                        mailru.plugin.init();
                    });
                    break;
                }
            }
        }
    })();

}(window));