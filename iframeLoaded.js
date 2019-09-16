/**
 * @param {String} requestUrl         RPC url
 * @param {Object} externalOptions    custom options
 */
function iframeLoaded(requestUrl, externalOptions){

	function getBrowser(){

		var ua = window.navigator.userAgent;

		var browserName  = navigator.appName;
		var fullVersion  = '' + parseFloat(navigator.appVersion);
		var nameOffset, verOffset, ix;

		//opera 15+
		if ((verOffset=ua.indexOf('OPR/'))!==-1) {
			browserName = 'Opera';
			fullVersion = ua.substring(verOffset + 4);
		}

		//old opera
		else if ((verOffset=ua.indexOf('Opera'))!==-1) {
			browserName = 'Opera';
			fullVersion = ua.substring(verOffset+6);
			if ((verOffset=ua.indexOf('Version'))!==-1)
				fullVersion = ua.substring(verOffset+8);
		}

		//ie
		else if ((verOffset=ua.indexOf('MSIE'))!==-1) {
			browserName = 'Microsoft Internet Explorer';
			fullVersion = ua.substring(verOffset+5);
		}

		//chrome
		else if ((verOffset=ua.indexOf('Chrome'))!==-1) {
			browserName = 'Chrome';
			fullVersion = ua.substring(verOffset+7);
		}

		//safari
		else if ((verOffset=ua.indexOf('Safari'))!==-1) {
			browserName = 'Safari';
			fullVersion = ua.substring(verOffset+7);
			if ((verOffset=ua.indexOf('Version'))!==-1)
			    fullVersion = ua.substring(verOffset+8);
		}

		//ff
		else if ((verOffset=ua.indexOf('Firefox'))!==-1) {
			browserName = 'Firefox';
			fullVersion = ua.substring(verOffset+8);
		}

		//other
		else if ((nameOffset=ua.lastIndexOf(' ')+1) < (verOffset=ua.lastIndexOf('/'))) {
			browserName = ua.substring(nameOffset,verOffset);
			fullVersion = ua.substring(verOffset+1);
			if (browserName.toLowerCase()==browserName.toUpperCase()) {
				browserName = navigator.appName;
			}
		}

		// trim the fullVersion string at semicolon/space if present
		if ((ix=fullVersion.indexOf(';'))!==-1) fullVersion=fullVersion.substring(0,ix);
		if ((ix=fullVersion.indexOf(' '))!==-1) fullVersion=fullVersion.substring(0,ix);

		return { version : fullVersion, name: browserName };
	};

	function getOS(){

		var osName = 'Unknown';

		if (navigator.appVersion.indexOf('Win')!==-1) osName = 'Windows';
		else if (navigator.appVersion.indexOf('Mac')!==-1) osName = 'MacOS';
		else if (navigator.appVersion.indexOf('X11')!==-1) osName = 'Unix';
		else if (navigator.appVersion.indexOf('Linux')!==-1) osName = 'Linux';

		return osName;
	};

	function getViewport(){
		var vpWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
		var vpHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
		return { width : vpWidth, height : vpHeight };
	};

	function getFlashversion(){

		try {
			if(window.ActiveXObject) {
				var control = null;
				control = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
				if (control) return 'Shockwave Flash ' + control.GetVariable('$version');
			} else {
				for(var i in navigator.plugins) {
					var plugin = navigator.plugins[i];
					if (plugin.name.match(/flash/i)) return plugin.description;
				}
			}
		} catch(e) {};

		return undefined;
	};

	function extend(){

		var objectsCount = arguments.length;

		for (var i = 1; i < objectsCount; i++){
			for (var key in arguments[i]) {
				if (arguments[i].hasOwnProperty(key)) {
					arguments[0][key] = arguments[i][key];
				}
			}
		}
		
		return arguments[0];
	};

	try {

		var img = new Image();

		var browser = getBrowser();
		var viewport = getViewport();
		var flash = getFlashversion();
		var os = getOS();

		var options = {
//			userId: options.user_id,
//			referrer: options.referrer,
//			networkIdent: options.networkIdent,
//			countryCode: options.countryCode || '',
			rnd: (+new Date),
			os: os,
			browser: browser.name,
			browserVersion: browser.version,
			resolution: window.screen.availWidth + 'x' + window.screen.availHeight,
			viewport: viewport.width + 'x' + viewport.height,
			flashVersion: flash || ''
		};

		extend(options, externalOptions);		

		var url = requestUrl + 'iframeLoaded.php?';
		var parameters = [];

		for (var key in options) {
			if (options.hasOwnProperty(key)) {
				parameters.push(key + '=' + encodeURIComponent(options[key]));
			}
		}

		img.src = url + parameters.join('&');

	} catch(e){}
};