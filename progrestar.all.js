var Feedback = function(params){

    var self = this;

    this.RESET_TIMEOUT_INTERVAL = 3 * 60 * 1000;
    this.resetTimeoutActive = false;

    this.zendeskUrl = '../feedback/zendesk/index.php?request=';

    this.init(params);

    this.defaultLanguage = 'ru';

    this.defaultArticles = [
	{
	    id    : -2,
	    tags  : 'обнова, акция, абнава, когда, кагда, конкурс, результат конкурса, акцыя, акциа',
	    title : '<b>Когда обновление, акция и т.д.?</b>',
	    body  : 'Уважаемые игроки, обо всех акциях, обновлениях, конкурсах и других мероприятиях, которые проводятся в официальной группе приложения - вы можете узнать в официальной группе приложения. Следите за новостями! '
	},
	{
	    id    : -1,
	    tags  : 'черный, бан, блокировка, групп, блакировка, чорный, списак, список, когда разбанят, разбан, на сколько, срок блокировки',
	    title : '<b>Черный список, блокировка в группе</b>',
	    body  : 'Вы были занесены в черный список группы за нарушение Правил группы.<br/>Разблокировка происходит автоматически, по истечению срока блокировки.<br/>Преждевременная разблокировка не производится.<br/>Срок действующей блокировки указан в группе, в которой Вы занесены в черный список.'
	}
    ];

    this.trailerOpened = false;
    this.feedbackOpened = false;

    this.messages = {
	en : {
	    messageSent : 'Message sent<br/>You\'ll get an answer by email.',
	    error : 'Send error<br/>Retry later, please.',
	    errorDescription : 'Description too short.',
	    errorEmail : 'Invalid email.',
	    errorWait : 'Send interval must be at least 3 minutes',
	    noSearchResults : '<p>No matches found for «{pattern}»</p>'+
			   '<br/><br/><p>Please try the following:</p>'+
			   '<ul><li class="not-found">Check spelling</li><li class="not-found">Use more generic terms</li></ul>' +
			   '<br/><br/><p>Still have not found an answer?</p>'+
			   '<ul><li class="not-found form-search-ask">Submit your question!</li></ul>'
	},
	ru : {
	    messageSent : 'Сообщение отправлено.<br/>В ближайшее время вы получите ответ<br/>на указанный электронный адрес почты.',
	    error : 'Во время отправки возникла ошибка<br/>Попробуйте повторить позже.',
	    errorDescription : 'Опишите проблему подробней.',
	    errorEmail : 'Проверьте введенный email.',
	    errorWait : 'Интервал между отправкой сообщений не может быть меньше трех минут!',
	    noSearchResults : '<p>Поиск по запросу «{pattern}» не дал результатов.</p>'+
			   '<br/><br/><p>Попробуйте поискать вот так:</p>'+
			   '<ul><li class="not-found">Проверьте, правильно ли написаны все слова</li><li class="not-found">Попробуйте использовать более общие термины</li></ul>' +
			   '<br/><br/><p>Все еще не нашли ответ?</p>'+
			   '<ul><li class="not-found form-search-ask">Отправьте вопрос в тех. поддержку</li></ul>'
	},
	get : function(type, placeholders){

		var tmp = null;

		if (this[self.language] && this[self.language][type]) tmp = this[self.language][type];
		else if (this[self.defaultLanguage] && this[self.defaultLanguage][type]) tmp = this[self.defaultLanguage][type];

		if (!tmp) return type;

		if (placeholders) {
		    for (var i in placeholders) {
			tmp = tmp.replace('{'+ placeholders[i].key +'}', placeholders[i].value);
		    }
		}

		return tmp;
	    }
    };
};


Feedback.prototype.appByName = function(name){
    return window.document[name] || window[name] || document.embeds[name];
};

Feedback.prototype.flashvars = function(flashvar){

    var result = {},
	flashvarsString = this.flashApp.querySelector('param[name="flashvars"]').value;

    decodeURIComponent(flashvarsString).split('&').forEach(function(item){
	var tmp = item.split('=');
	result[ tmp[0] ] = tmp[1];
    });

    return flashvar ? result[flashvar] : result;
};


Feedback.prototype.formShow = function(){

    this.feedbackOpened = true;

    var form = document.getElementById('zd_form'),
	game = form.querySelector('input[name="fields[21727158]"]').value,
	li = form.querySelectorAll('.form-feedback-selectbox li');

    for (var i = 0, l = li.length; i < l; i++){

	var disabledIn = li[i].getAttribute('data-disabled-in'),
	    enabledIn = li[i].getAttribute('data-enabled-in');

	if (!disabledIn && !enabledIn) continue;

	var hide = !((enabledIn === game && disabledIn !== game) || (disabledIn !== game && !enabledIn));

	li[i].classList.toggle('disable', hide);
    }

    var itemsCount = form.querySelectorAll('.form-feedback-selectbox li:not(.disable)').length;

    form.querySelector('.form-feedback-selectbox').style.maxHeight = (34 * (itemsCount + 1)) - 4 + 'px';

    this.search('', '.overview');

    form.querySelector('.form-search-field').value = '';
    form.querySelector('.form-search-clear').classList.add('element-hide');

    form.style.display = 'block';

    var title = form.querySelector('.form-title');

    title.textContent = title.getAttribute('data-form-search');

    form.querySelector('.form-search').style.display = this.articlesStatus === 'disabled' ? 'none' : 'block';
    form.querySelector('.form-feedback').style.display = this.articlesStatus === 'disabled' ? 'block' : 'none';

    this.hideApp();

    if (this.scrollbar) { this.scrollbar.tinyscrollbar_update(); }
    else { this.scrollbar = $('.form .content').tinyscrollbar(); }
};

Feedback.prototype.formHide = function(){

    this.feedbackOpened = false;

    document.getElementById('zd_form').style.display = 'none';
    
    this.showApp();
};


Feedback.prototype.trailerShow = function(){

    this.trailerOpened = true;

    var iframe = document.getElementById('trailer'),
	src = iframe.getAttribute('data-' + (this.language === 'ru' ? 'ru-src' : 'en-src'));

    iframe.setAttribute('src', src);

    document.querySelector('.trailer-wrapper').style.display = 'block';

    this.hideApp();
};

Feedback.prototype.trailerHide = function(){

    this.trailerOpened = false;

    document.querySelector('.trailer-wrapper').style.display = 'none';

    this.showApp();
};


Feedback.prototype.createTicket = function(){

    var self = this;
    var error = null;

    var MIN_TEXT_LENGTH = 10;
    var EMAIL_VALIDATION_REGEX = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;

    if (this.resetTimeoutActive === false || this.resetTimeoutActive < (new Date).getTime()) {

	this.resetTimeoutActive = false;

	var form = document.getElementById('zd_form');
	var text = form.querySelector('textarea[name="description"]').value;

	if (text.length > MIN_TEXT_LENGTH) {

	    var email = form.querySelector('input[name="email"]').value;

	    if (EMAIL_VALIDATION_REGEX.test(email.toLowerCase())) {

		var subject = form.querySelector('input[name="subject"]').value,
		    name = form.querySelector('input[name="name"]').value,
		    field21707382 = form.querySelector('input[name="fields[21707382]"]').value,
		    field21727158 = form.querySelector('input[name="fields[21727158]"]').value,
		    field21727488 = form.querySelector('.form-feedback-selectbox-value').getAttribute('data-value'),
		    field24852608 = form.querySelector('input[name="fields[24852608]"]').value;

		var flashPlayer = (function(){

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
		})();

		var browser = (function(){

		    var ua= navigator.userAgent,
			tem,
			M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*([\d\.]+)/i) || [];

		    if(/trident/i.test(M[1])){
			tem=  /\brv[ :]+(\d+(\.\d+)?)/g.exec(ua) || [];
			return 'IE '+(tem[1] || '');
		    }

		    M= M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
		    
		    if (typeof window.opera !== 'undefined') 
			return 'Opera ' + window.opera.version();
		    else 
			return M.join(' ');

		})();

		/**
		 * flashvars
		 */
		var f = this.flashvars();

		$.post( this.zendeskUrl + '/tickets/create', {
		    ssl : window.location.protocol,
		    browser : browser,
		    localtime : (new Date).toString(),
		    subject : subject,
		    name : name,
		    email : email,
		    description : text,
		    flashplayer : flashPlayer,
		    params : {
			network : f.network,
			rpc_url : f.rpc_url,
			user_id : f.uid,
			app_id : f.api_id || f.application_key || f.app_id
		    },
		    fields : {
			21707382 : field21707382,
			21727158 : field21727158,
			21727488 : field21727488
		    }
		}, function(){

		    self.resetTimeoutActive = (new Date).getTime() + self.RESET_TIMEOUT_INTERVAL;

		    document.querySelector('#zd_submit').removeAttribute('disabled');

		    self.showMessage({ type : 'success', message : 'messageSent', autoHide : true });

		}, 'json');
	    } else error = 'errorEmail';
	} else error = 'errorDescription';
    } else error = 'errorWait';

    if (error) {
	document.querySelector('#zd_submit').removeAttribute('disabled');
	this.showMessage({ type : 'error', message : error, autoHide : false });
    }
};

Feedback.prototype.showMessage = function(params){

    var MESSAGE_HIDE_DELAY = 3 * 1000;

    var type = params.type || 'info';
    var message = this.messages.get(params.message || '');
    var autoHide = typeof params.autoHide !== 'undefined' ? params.autoHide : true;

    var messageHTML = document.createElement('div');
    var messageText = document.createElement('p');

    messageText.innerHTML = message;

    messageHTML.appendChild(messageText);
    messageHTML.setAttribute('id', 'message');
    messageHTML.classList.add(type);

    var body = document.getElementsByTagName('body')[0],
	firstChild = body.firstChild;

    body.insertBefore(messageHTML, firstChild);

    var timeout = setTimeout(function(){

	clearTimeout(timeout);

	var msg = document.getElementById('message');
	msg.parentNode.removeChild(msg);

    }, MESSAGE_HIDE_DELAY);

    messageHTML.addEventListener('click', function(){

	clearTimeout(timeout);
	var msg = document.getElementById('message');
	msg.parentNode.removeChild(msg);

    }, false);

    if (autoHide) this.formHide();
};

Feedback.prototype.search = function(pattern, container) {

    var searchPattern = pattern.trim(),
	overview = document.querySelector(container),
	overviewFirstChild = overview.firstChild;

    overview.innerHTML = '';

    document.querySelector('.form-search-clear').classList.toggle('element-hide', !searchPattern.length); //tmp.length > 0

    var articles = this.articles || this.defaultArticles;

    for (var i in articles) {

	if (articles.hasOwnProperty(i)) {

	    var li = document.createElement('li');

	    li.setAttribute('data-url', articles[i].url);
	    li.setAttribute('data-id', articles[i].id);
	    li.innerHTML = articles[i].title;
	    li.classList.add('matched');

	    if (searchPattern === '') {

		//if (articles[i].id === -1)
		    overview.appendChild(li);
		//else
		//    overview.appendChild(li);

	    } else {

		var r = new RegExp(searchPattern, "gim");
		if (r.test(articles[i].title)) overview.appendChild(li);

	    }
	}
    }

    if (!overview.hasChildNodes()) overview.innerHTML = this.messages.get('noSearchResults', [ { key : 'pattern', value : searchPattern } ]);

    if (this.scrollbar) { this.scrollbar.tinyscrollbar_update(); }
    else { this.scrollbar = $('.form .content').tinyscrollbar(); }
};

Feedback.prototype.subscribe = function(){

    var self = this;

    var searchField = document.querySelector('.form-search-field'),
	searchFieldClearButton = document.querySelector('.form-search-clear'),
	formCloseButton = document.querySelector('.form-cross'),
	formSubmitButton = document.querySelector('#zd_submit');


    searchField.addEventListener('focus', function(){
	document.querySelector('.form-search-clear').classList.add('element-add-border');
//	document.querySelector('.form-search-arrow').classList.add('element-add-border');
    }, false);

    searchField.addEventListener('blur', function(){
	document.querySelector('.form-search-clear').classList.remove('element-add-border');
//	document.querySelector('.form-search-arrow').classList.remove('element-add-border');
    }, false);

    searchFieldClearButton.addEventListener('click', function(){

	var searchField = document.querySelector('.form-search-field');

	searchField.value = '';
	self.search('', '.overview');
//	if (self.scrollbar) self.scrollbar.tinyscrollbar_update();

	this.classList.add('element-hide');

    }, false);


    formCloseButton.addEventListener('click', function(){

	self.formHide();

    }, false);

    formSubmitButton.addEventListener('click', function(){

	var button = this;

	button.setAttribute('disabled', 'disabled');

	self.createTicket();

    }, false);


    document.addEventListener('mouseup', function(e){

	var container = document.querySelector('.form-feedback-selectbox'),
	    formButton = document.querySelector('.form-search-ask');

	if (container !== e.target && e.target.parentNode !== container) container.classList.remove('form-feedback-selectbox-expanded');
	else container.classList.toggle('form-feedback-selectbox-expanded', !container.classList.contains('form-feedback-selectbox-expanded'));

	if (formButton === e.target) {

	    var title = document.querySelector('.form-title');

	    title.classList.remove('faq');
	    title.textContent = title.getAttribute('data-form-feedback');

	    if (self.articlesStatus !== 'disabled') {
		document.querySelector('.form-feedback').style.display = 'none';
		document.querySelector('.form-search').style.display = 'block';
		document.querySelector('.form-arrow').style.visibility = 'visible';
	    } else {
		document.querySelector('.form-feedback').style.display = 'block';
		document.querySelector('.form-search').style.display = 'none';
		document.querySelector('.form-arrow').style.visibility = 'hidden';
	    }

	    return;
	}

	if (typeof e.target.classList !== 'undefined' && (e.target.classList.contains('matched') || e.target.parentNode.classList.contains('matched'))) {

	    var matchedElement = e.target.classList.contains('matched') ? e.target : e.target.parentNode,
		articleId = matchedElement.getAttribute('data-id'),
		overview = document.querySelector('.overview'),
		article = self.articles.filter(function(element){ return element.id.toString() === articleId; });

	    if (article[0].body) {

		overview.innerHTML = article[0].body;

	    } else {

		overview.innerHTML = '<p style="text-align: center"><span id="ajax-loader"></span></p>';

		$.get(self.zendeskUrl + '/article', { article : article[0].id }, function(response){

		    if (response) {

			overview.innerHTML = response;

			$(overview).find('img').on('load', function(){
			    if (!self.scrollbar) { self.scrollbar = $('.form .content').tinyscrollbar(); }
			    else { self.scrollbar.tinyscrollbar_update(); }
			});

			if (self.scrollbar) self.scrollbar.tinyscrollbar_update();
		    }
		});
	    }

	    document.querySelector('.form-search-field').value = matchedElement.textContent.replace(/(\<b\>|\<\/b\>)/ig, '');
	    document.querySelector('.form-search-clear').classList.remove('element-hide');

	    if (self.scrollbar) self.scrollbar.tinyscrollbar_update();

	    return;
	}

	if (e.target.parentNode && e.target.parentNode.parentNode && e.target.parentNode.parentNode === container) {

	    var selectBox = document.querySelector('.form-feedback-selectbox-value');
	    selectBox.textContent = e.target.textContent;
	    selectBox.setAttribute('data-value', e.target.getAttribute('data-value'));

	    return;
	}

    }, false);

    document.querySelector('.form-arrow').addEventListener('click', function(){

	document.querySelector('.form-search').style.display = 'block';
	document.querySelector('.form-feedback').style.display = 'none';

	this.style.visibility = 'hidden';

	var title = document.querySelector('.form-title');

	title.textContent = title.getAttribute('data-form-search');
	title.classList.add('faq');

    }, false);

    document.getElementById('button_q').addEventListener('click', function(e){
	e.preventDefault();
	self.formShow();
    }, false);


    ['keyup', 'change'].forEach(function(event){

	searchField.addEventListener(event, function(){

	    self.search(this.value, '.overview');

	    if (this.scrollbar) { this.scrollbar.tinyscrollbar_update(); }
	    else { this.scrollbar = $('.form .content').tinyscrollbar(); }

	}, false);

    });
};


Feedback.prototype.hideApp = function(){
    
    if (this.hideFlashCallback) {

	this.hideFlashCallback();

    } else if (!this.isOpaque) {

	this.flashApp.parentNode.style.top = '-10000px';

    }

};

Feedback.prototype.showApp = function(){

    if (this.showFlashCallback) {

	this.showFlashCallback();

    } else if (!this.isOpaque && !this.feedbackOpened && !this.trailerOpened) {
	
	this.flashApp.parentNode.style.top = '0';

    }

};


Feedback.prototype.init = function(params){

    var self = this;

    this.categoryId = params.categoryId || null;
    this.subscribe();

    if (params.zendeskUrl) this.zendeskUrl = params.zendeskUrl;

    if (this.categoryId) {

	var articlesCache = localStorage.getItem('nexters.articles.' + this.categoryId);

	if (!articlesCache) {

	    this.articlesStatus = 'loading';

	    $.get(this.zendeskUrl + '/articles', {
		category : this.categoryId
	    }, function(response){

		if (response) {

		    self.articles = self.defaultArticles.concat(response);
		    localStorage.setItem('nexters.articles.' + self.categoryId, JSON.stringify(self.articles));
		    self.search('', '.overview');

		    self.articlesStatus = 'ready';
		}
	    });

	} else {
	    self.articles = JSON.parse(articlesCache);
	    self.search('', '.overview');
	    self.articlesStatus = 'ready';
	}

    } else {
	this.articlesStatus = 'disabled';
    }

    this.flashApp = this.appByName(params.flashApp || 'flash-app');

    this.isOpaque = (this.flashApp.querySelector('param[name="wmode"]').value === 'opaque');
    this.language = this.flashvars('interface_lang');

    this.hideFlashCallback = params.hideFlashCallback || null;
    this.showFlashCallback = params.showFlashCallback || null;
};



$(document).ready(function(){

    /**
     * «privacy policy» page + terms of service
     */
    $('body').on('click', '#link_policy, #link_terms', function(e){

	e.preventDefault();
	
	if (feedback && feedback.settings && feedback.settings.version === 2) {
		return false;
	}

	var policy = $(this).attr('id') === 'link_policy',
	    container = $( policy ? '.policy' : '.terms' ),
	    endPoint = '../../feedback/' + ( policy ? 'privacypolicy.php' : 'termsofservice.php' ),
	    appTitle = $('meta[property="og:title"]').attr('content');

	$('.content', container).load(endPoint, function(){

	    feedback.hideApp();
	    container.html( container.html().replace(/{project}/gi, appTitle) ).fadeIn();

	});

    });


    /**
     * close page button
     */
    $('body').on('click', '.link_close', function(e){
	
	if (feedback && feedback.settings && feedback.settings.version === 2) {
		return false;
	}

	feedback.showApp();

	e.preventDefault();
	e.target.parentNode.style.display = 'none';
    });


	// $('.trailer-watch').on('click', function(e){
	// 	e.preventDefault();
	// 	feedback.trailerShow();
	// });
	// $('.trailer-close').on('click', function(e){
	// 	e.preventDefault();
	// 	feedback.trailerHide();
	// });
    
    /**
     * запрещаем клик правой клавишей
     */
    $(document).on('onContextMenu', function(e){
	e.preventDefault();
	return false;
    });

});window.progrestar = {}

var progrestar = window.progrestar

progrestar.modules = {}
progrestar.flashMovie = null

progrestar.getModule = function(name) {
	if(!progrestar.modules[name])
		throw 'Module ' + name + ' not found'

	return progrestar.modules[name]
}

progrestar.registerModule = function(name, object) {
	progrestar.modules[name] = object
}

progrestar.flashGate = {
	handlers: {}
}

progrestar.flashGate.on = function(module, event, handlerCb) {
	if(!progrestar.flashGate.handlers[module])
		progrestar.flashGate.handlers[module] = {}

	if(!progrestar.flashGate.handlers[module][event])
		progrestar.flashGate.handlers[module][event] = []

//	console.log('Add event handler on', module, event, handlerCb)

	progrestar.flashGate.handlers[module][event].push(handlerCb)
}

progrestar.flashGate.emit = function(module, event, params) {
//	console.log('flashEmit(', module, ', ', event, ', ', params, ')')

//	console.log(module, event, params, progrestar.flashGate.handlers)

	if(!progrestar.flashGate.handlers[module]) {
//		console.log('Empty progrestar.flashGate.handlers[module]')
		return
	}

	if(!progrestar.flashGate.handlers[module][event]) {
//		console.log('Empty progrestar.flashGate.handlers[module][event]')
		return
	}

	var handlers = progrestar.flashGate.handlers[module][event]

	setTimeout(function() {
		for(var i=0; i<handlers.length; i++) {
//			console.log(event, params)
			handlers[i](params)
		}
	}, 1)
}

/**
 * Метод дёргает флешка чтобы сказать что она проинитилась и способна принимать
 * эвенты.
 * @var string module
 * @var object handlers массив строк с именами методов, которые дёргает
 *      js в ответ на события
 */
progrestar.flashGate.started = function(module, handlers) {
//	console.log("FLASH started. Module", module, handlers)

	try {
		if(handlers) {
			for(var event in handlers) {
				(function(module, event, handler) {
					progrestar.flashGate.on(
						module,
						event,
						function(params) {
//							console.log('Pre-call', params)

							var movie = progrestar.flashMovie
							if(movie && movie[handler]) {
								movie[handler](event, params, module)
							}
						}
					)
				})(module, event, handlers[event])
			}
		}

		var m = progrestar.getModule(module)
		m.flashStarted()
	} catch(e) {
//		console.error('Exception: ' + e)
	}

	return {success: true}
}

progrestar.setFlashMovie = function(movie) {
	this.flashMovie = movie
}
if (!window.progrestar)
	window.progrestar = {};

var progrestar = window.progrestar;

progrestar.ErrordClient = function(networkIdent, applicationId, userId, gateUrl) {
	var networkIds = {
		vkontakte: 1,
		mail: 2,
		odnoklassniki: 3,
		facebook: 4,
		mg: 2
	};

	this.gateUrl = gateUrl;
	this.queue = new progrestar.JsonpRequestsAgent(this.gateUrl, null, null, 'POST');

	this.networkIdent = networkIdent;
	this.networkId = networkIds[networkIdent];
	this.applicationId = applicationId;
	this.userId = userId;

};

progrestar.ErrordClient.flashStarted = function() {

};

progrestar.ErrordClient.prototype.send = function(error) {

	error.network_id = this.networkId;
	error.app_id = this.applicationId;
	error.user_id = this.userId;

	return this.queue.send(error);

};
if (!window.progrestar)
	window.progrestar = {};

var progrestar = window.progrestar;

progrestar.JsonpRequestsAgent = function(gateUrl, maxQueueSize, serverTimeout, method) {
	this.gateUrl = gateUrl;
	this.serverTimeout = serverTimeout || 10000;
	this.maxQueueSize = maxQueueSize || 1000;
	
	this.method = method || 'GET';

	this.queue = [];
	this.isStopped = true;
};

progrestar.JsonpRequestsAgent.prototype.send = function(item) {
	//очередь переполнена
	if (this.queue.length > this.maxQueueSize)
		return false;

	if (item === undefined)
		return false;

	this.queue.push(item);
	//запускаем очередь, если та была остановлена.
	if (this.isStopped === true)
		this._continue();

	return true;
}

progrestar.JsonpRequestsAgent.prototype._continue = function() {

	//останавливаем очередь, если нечего отправлять
	if (!this.queue.length) {
		this.isStopped = true;
	} else {
		this.isStopped = false;
		this._sendItem();
	}
}
progrestar.JsonpRequestsAgent.prototype._sendItem = function() {
	var item = this.queue.shift();
	var self = this;
	$.ajax({
		type: this.method,
		url: this.gateUrl,
		dataType: 'jsonp',
		timeout: this.serverTimeout,
		data: item,
		success: function(json) {
			//ошибка сервера
			if (json.error !== undefined)
				self.send(item);
			self._continue();
		},
		error: function() {
			self.send(item);
			self._continue();
		}
	 });
}


window.progrestar.Math = {}

window.progrestar.Math.shuffle = function(array) {
	for(var i=0; i<array.length - 1; i++) {
		var offset = (Math.random() * (array.length - i) + i) ^ 0

		var t = array[offset]
		array[offset] = array[i]
		array[i] = t
	}
}


var progrestar = window.progrestar

progrestar.PushdClient = function(servers, networkIdent, applicationId, userId, authToken) {
	this.connected = false
	this.sock = null

	this.handlers = {}

	this.messagesHistory = []

	this.servers = servers
	this.networkIdent = networkIdent
	this.applicationId = applicationId
	this.userId = userId

	this.authToken = authToken
}

progrestar.PushdClient.prototype.connect = function() {
	var self = this

	this._selectSocketIoServer(
		this.servers,
		function(serverUrl) {
			self._realConnectSocketIo(serverUrl)
		},
		function() {
			self.connected = false
			self.flashEmit('disconnect')
		}
	)
}

progrestar.PushdClient.prototype._selectSocketIoServer = function(serversList, successCb, errorCb) {
	var list = serversList.slice()
	progrestar.Math.shuffle(list)

	var tryNext = function(tryOffset) {
		var url = list[tryOffset]
		if(!url) {
//			console.log('checkAvailability() completely failed')
//			errorCb()
			setTimeout(function() {
				tryNext(0)
			}, 10000)
			return
		}

		setTimeout(function() {
			successCb(url);
		}, 1);
	}

	tryNext(0)
}

progrestar.PushdClient.prototype._realConnectSocketIo = function(serverUrl) {
	var self = this
	var tryNumber = 1;

	serverUrl = serverUrl
		+ '?networkIdent=' + encodeURIComponent(this.networkIdent)
		+ '&applicationId=' + encodeURIComponent(this.applicationId)
		+ '&userId=' + encodeURIComponent(this.userId)
		+ '&authToken=' + encodeURIComponent(this.authToken)

	var maxReconnectionsCount = 4

	try {
		this.sock = io.connect(
			serverUrl,
			{
				'force new connection': true,
				'max reconnection attempts': maxReconnectionsCount,
				'reconnection delay': Math.floor(Math.random() * 3500) + 500
			}
		)
	} catch(e) {
//		console.error(e)
		return false
	}

//console.log(this.sock)
	var _reconnectFailedTimeout = null

	this.sock.on('connect', function() {
		if(_reconnectFailedTimeout)
			clearTimeout(_reconnectFailedTimeout);

		self.emit('connect')
		self.flashEmit('connect')
		self.connected = true
		tryNumber = 1;

		console.log('io.connect')
	})

	this.sock.on('disconnect', function() {
		self.emit('disconnect')
		self.flashEmit('disconnect')
		self.connected = false

		console.log('io.disconnect')
	})

	this.sock.on('connect_failed', function() {
		console.log('io.connect_failed')

		self.emit('disconnect')
		self.flashEmit('disconnect')
		self.connected = false

		if(_reconnectFailedTimeout)
			clearTimeout(_reconnectFailedTimeout);

		_reconnectFailedTimeout = setTimeout(onReconnectFailed, 1000)
	})

	var onReconnectFailed = function() {
		self.sock.disconnect()

		var reconnectDelay = Math.floor(Math.random() * 5000) + 1500 * tryNumber
		tryNumber++;

		setTimeout(function() {
			self.connect()
		}, reconnectDelay)
	}

	this.sock.on('reconnecting', function(interval, tryNumber) {
		console.log('io.reconnecting', interval, tryNumber)

		if(tryNumber >= maxReconnectionsCount) {
			if(_reconnectFailedTimeout)
				clearTimeout(_reconnectFailedTimeout);

			_reconnectFailedTimeout = setTimeout(onReconnectFailed, interval + 1000)
		}
	})

	this.sock.on('reconnect_failed', function() {
		console.log('io.reconnect_failed')
	})

	this.sock.on('error', function() {
		console.log('io.error', self.connected)
		if(!self.connected) {
			self.emit('disconnect')
			self.flashEmit('disconnect')

			self.connected = false
		} else {
//			console.log('error')
		}
	})

	var antidup = [];
	var antidupMaxLength = 100;

	this.sock.on('msg', function(data) {
		var id = '' + data.type + ':' + data.date + ':' + (data.body ? data.body.id : '');
		if(antidup.indexOf(id) !== -1) {
			console.log('message duplicate', data);
			return;
		}

		antidup.push(id);
		if(antidup.length > antidupMaxLength)
			antidup.shift();

		self.emit('message', data)
		self.flashEmit('message', data)

		if(self.messagesHistory !== null && self.messagesHistory.length < 1000)
			self.messagesHistory.push(data)

		console.log('msg', data)
	})
}

progrestar.PushdClient.prototype.flashEmit = function(event, parameters) {
	progrestar.flashGate.emit('pushd', event, parameters)
}

progrestar.PushdClient.prototype.flashStarted = function() {
	if(this.messagesHistory) {
		this.flashEmit('connect')

		for(var i=0; i<this.messagesHistory.length; i++) {
			this.flashEmit('message', this.messagesHistory[i])
		}

		this.messagesHistory = null

		if(this.connected === false)
			this.flashEmit('disconnect')
	} else {
		if(this.connected === true)
			this.flashEmit('connect')
		else if(this.connected === false)
			this.flashEmit('disconnect')
	}
}

progrestar.PushdClient.prototype.emit = function(event, data) {
	if(!this.handlers[event])
		return

	for(var i=0; i<this.handlers[event].length; i++) {
		try {
			this.handlers[event][i](data)
		} catch(e) {}
	}
}

progrestar.PushdClient.prototype.on = function(event, cb) {
	if(!this.handlers[event])
		this.handlers[event] = []

	this.handlers[event].push(cb)
}
if (!window.progrestar)
	window.progrestar = {};

var progrestar = window.progrestar;

progrestar.StatClient = function(networkIdent, applicationId, userId, sessionId, secretKey, gateUrl) {
	this.gateUrl = gateUrl;
	this.networkIdent = networkIdent;
	this.applicationId = applicationId;
	this.userId = userId;
	this.sessionId = sessionId;
	this.secretKey = secretKey;
	this.queue = new progrestar.JsonpRequestsAgent(this.gateUrl);
};

progrestar.StatClient.flashStarted = function() {

};

progrestar.StatClient.prototype.send = function(event, object, value, segment) {
	var ts = Math.floor(new Date().getTime() / 1000);
	var item = {
		data: JSON.stringify(
			{
				secret: this.secretKey,
				date: ts,
				data: [
					{
						event: event,
						object: object,
						value: value,
						date: ts,
						segment: segment || []
					}
				],
				network_app_id: this.applicationId,
				network_id: this.networkIdent,
				sessionId: this.sessionId,
				userId: this.userId
			}
		)

	};

	//return this.queue.send(item);
	return true;
};

var progrestar = window.progrestar

    progrestar.friendsOnline = function(params) {
        for (var param in params) this[param] = params[param];
        if (!this.debug) console.log('[o] debug off');
        self = this;
    }

    progrestar.friendsOnline.prototype.generateId = function() {
        return Math.floor(Math.random() * (this.maxId - this.minId) + this.minId);
    }

    progrestar.friendsOnline.prototype.run = function() {
        this.batchExec(true);
        setInterval(function(){ self.batchExec(); }, self.interval);
    }

    progrestar.friendsOnline.prototype.filterFriends = function(friends) {
        if (this.debug) var srcCount = friends.length;
        var result = [];
        friends.forEach(function(item){ if (item.online && !item.online_mobile) result.push(item.uid); });
        if (this.debug) console.log('[f] filtered: ' + (srcCount - result.length));
        return result;
    }

    progrestar.friendsOnline.prototype.processResponse = function(response) {
        if (response && response.error) console.log(response.error);
    }

    progrestar.friendsOnline.prototype.sendToFlash = function(friends) {
        var data = {
            method          : 'POST',
            body            : JSON.stringify({ online: friends, aid : this.aid, myId : this.uid }),
            bodyCompression : 'deflate',
            onSuccess       : 'progrestar.friendsOnline.prototype.processResponse',
            onError         : 'progrestar.friendsOnline.prototype.processResponse'
        }

        if (thisMovie('flash-helper') && thisMovie('flash-helper').sendURLRequest) {
        	thisMovie('flash-helper').sendURLRequest(this.url, data);
        }
        if (this.debug) console.log(data);
    }

    progrestar.friendsOnline.prototype.batchExec = function(first) {

        var requestString = [];
        var resultArr = [];

        if (first) resultArr.push(this.uid);

        for (var i = 0; i < this.count; i++) {
            var tmpid = first ? this.uid : this.generateId();
            first = false;
            requestString.push('"' + tmpid + '": API.friends.get({ fields: "uid, online", uid : ' + tmpid + '}) ');
        }

        VK.api('execute', {
            code : 'return {' + requestString.join() + '};'
        }, function(response){

            for (var item in response.response) {
                if (response.response[item]) {
                    var result = self.filterFriends(response.response[item]);
                    resultArr = resultArr.concat(result);
                }
            }

            self.sendToFlash(resultArr);
        });
    }
    
    