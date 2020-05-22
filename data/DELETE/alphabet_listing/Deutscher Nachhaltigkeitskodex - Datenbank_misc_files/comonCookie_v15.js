// @ts-check

/*!
 * jQuery plugin
 * Zuständig für die Steuerung der Funktionaltät von Webtracking.
 * Dawid Czarnecki Com&On 7.5.2018
 */

var _paq = _paq || [];
var cookie_policypage_path;
var cookie_message;
var cookie_link_title;
var cookie_link_text;
var cookie_button_text1;
var cookie_button_text2;
var cookie_piwik_accepted;
var cookie_piwik_not_accepted;
var cookie_google_analytics_accepted;
var cookie_google_analytics_not_accepted;
var cookie_webtrends_accepted;
var cookie_webtrends_not_accepted;
var cookie_oracle_accepted;
var cookie_oracle_not_accepted;
var oracle_plugin_path;


var piwik_on;
var webtrends_on;
var oracle_on;
var google_analytics_on;

var piwik_id;
var ga_settings
var log_on;

var cAsking;
var cAllowed;
var strCurrentDomain;

(function ($) {


	$.fn.comonCookie = function (opts) {

		// default configuration
		var config = $.extend({}, {
			piwik_on: 1,
			webtrends_on: 0,
			oracle_on: 0,
			google_analytics_on:0,
			oracle_plugin_path: null,
			piwik_id: 145,
			ga_settings:null,
			log_on: 0,
			cookie_policypage_path: "/Special-Pages/Cookie-Policy",
			cookie_message: 'Diese Seite verwendet Cookies, um Ihnen die beste Nutzungserfahrung auf unserer Website zu bieten. Wenn Sie mehr dazu wissen, oder Ihre Cookie-Einstellungen ändern möchten,',
			cookie_link_title: 'Cookie Information',
			cookie_link_text: 'klicken Sie bitte hier.',
			cookie_button_text1: 'Cookies akzeptieren',
			cookie_button_text2: 'Cookies nicht akzeptieren',
			cookie_piwik_accepted: '*Piwik-Cookie akzeptiert',
			cookie_piwik_not_accepted: 'Piwik-Cookie nicht akzeptiert',
			cookie_webtrends_accepted: '*Webtrends-Cookie akzeptiert',
			cookie_webtrends_not_accepted: 'Webtrends-Cookie nicht akzeptiert',
			cookie_oracle_accepted: '*Oracle Infinity Cookie akzeptiert',
			cookie_oracle_not_accepted: 'Oracle Infinity Cookie nicht akzeptiert',
			cookie_google_analytics_accepted: '*Google-Analytics akzeptiert',
			cookie_google_analytics_not_accepted: '*Google-Analytics-Cookie nicht akzeptiert'
		}, opts);




		// main function
		// get all settings
		function bakecomonCookie(e) {

			// Get parameters.
			piwik_on = e.data("piwik_on") == undefined ? config["piwik_on"] : e.data("piwik_on");
			webtrends_on = e.data("webtrends_on") == undefined ? config["webtrends_on"] : e.data("webtrends_on");
			google_analytics_on = e.data("google_analytics_on") == undefined ? config["google_analytics_on"] : e.data("google_analytics_on");
			oracle_on = e.data("oracle_on") == undefined ? config["oracle_on"] : e.data("oracle_on");
			oracle_plugin_path = e.data("oracle_plugin_path") == undefined ? config["oracle_plugin_path"] : e.data("oracle_plugin_path");
			piwik_id = e.data("piwik_id") == undefined ? config["piwik_id"] : e.data("piwik_id");
			log_on = e.data("log_on") == undefined ? config["log_on"] : e.data("log_on");
			ga_settings = e.data("ga_settings") == undefined ? config["ga_settings"] : e.data("ga_settings");


			cookie_policypage_path = e.data("cookie_policypage_path") == undefined ? config["cookie_policypage_path"] : e.data("cookie_policypage_path");
			cookie_message = e.data("cookie_message") == undefined ? config["cookie_message"] : e.data("cookie_message");
			cookie_link_title = e.data("cookie_link_title") == undefined ? config["cookie_link_title"] : e.data("cookie_link_title");
			cookie_link_text = e.data("cookie_link_text") == undefined ? config["cookie_link_text"] : e.data("cookie_link_text");
			cookie_button_text1 = e.data("cookie_button_text1") == undefined ? config["cookie_button_text1"] : e.data("cookie_button_text1");
			cookie_button_text2 = e.data("cookie_button_text2") == undefined ? config["cookie_button_text2"] : e.data("cookie_button_text2");
			cookie_piwik_accepted = e.data("cookie_piwik_accepted") == undefined ? config["cookie_piwik_accepted"] : e.data("cookie_piwik_accepted");
			cookie_piwik_not_accepted = e.data("cookie_piwik_not_accepted") == undefined ? config["cookie_piwik_not_accepted"] : e.data("cookie_piwik_not_accepted");
			cookie_webtrends_accepted = e.data("cookie_webtrends_accepted") == undefined ? config["cookie_webtrends_accepted"] : e.data("cookie_webtrends_accepted");
			cookie_webtrends_not_accepted = e.data("cookie_webtrends_not_accepted") == undefined ? config["cookie_webtrends_not_accepted"] : e.data("cookie_webtrends_not_accepted");
			cookie_oracle_accepted = e.data("cookie_oracle_accepted") == undefined ? config["cookie_oracle_accepted"] : e.data("cookie_oracle_accepted");
			cookie_oracle_not_accepted = e.data("cookie_oracle_not_accepted") == undefined ? config["cookie_oracle_not_accepted"] : e.data("cookie_oracle_not_accepted");
			cookie_google_analytics_accepted = e.data("cookie_google_analytics_accepted") == undefined ? config["cookie_google_analytics_accepted"] : e.data("cookie_google_analytics_accepted");
			cookie_google_analytics_not_accepted = e.data("cookie_google_analytics_not_accepted") == undefined ? config["cookie_google_analytics_not_accepted"] : e.data("cookie_google_analytics_not_accepted");

			// Prepare parameters.
			if (piwik_id == null) {
				piwik_on = 0;
			}

			if (google_analytics_on == null) {
				google_analytics_on = 0;
			}

			if (oracle_plugin_path == null) {
				oracle_on = 0;
			}

			// Load cookie helper.
			loadCookie(log_on, piwik_on, webtrends_on, oracle_on, oracle_plugin_path,google_analytics_on);

			// Load piwik.
			if (piwik_on == 1) {
				loadPiwik(log_on, piwik_id);
			}

			// Load Google Analytics.
			if (google_analytics_on == 1) {
				loadGoogleAnalytics(log_on, ga_settings);
			}
		}



		// initialize every element
		this.each(function () {
			bakecomonCookie($(this));
		});

		return this;
	};



	function loadCookie(log_on, piwik_on, webtrends_on, oracle_on, oracle_plugin_path, google_analytics_on) {
		cAsking = shouldWeAskForCookies();
		askForCookies(cookie_policypage_path);

		setSettingCookie();
		cAllowed = areCookiesAllowed();

		strCurrentDomain = window.location.hostname;

		loadWebtrends(log_on, webtrends_on, oracle_on, oracle_plugin_path);


		if (log_on == 1) { console.log("> Asking for cookies: " + cAsking) };
		if (log_on == 1) { console.log("> Cookies allowed: " + cAllowed) };

		if (cAllowed) {
			if (log_on == 1) { console.log("Cookies accepted!") };

			if (piwik_on == 1) {
				$("input#cookieSwitch").prop('checked', isPiwikAllowed());
				$("#spanCookieState").empty().append(cookie_piwik_accepted);
			}
			if (webtrends_on == 1) {
				$("input#webtrends_cookieSwitch").prop('checked', isWebtrandsAllowed());
				$("#WebtrendsCookieState").empty().append(cookie_webtrends_accepted);
			}
			if (oracle_on == 1) {
				$("input#oracle_cookieSwitch").prop('checked', isOracleAllowed());
				$("#oracleCookieState").empty().append(cookie_oracle_accepted);
			}
			if (google_analytics_on == 1) {
				$("input#google_analytics_cookieSwitch").prop('checked', isGoogleAnalyticsAllowed());
				$("#google_analyticsCookieState").empty().append(cookie_google_analytics_accepted);
			}
		}
		else {
			if (log_on == 1) { console.log("Cookies NOT accepted!") };

			if (piwik_on == 1) {
				$("input#cookieSwitch").prop('checked', false);
				$("#spanCookieState").empty().append(cookie_piwik_not_accepted);
				updateCookie("cookieSettings", JSON.stringify({ piwikAllowed: 'False' }), 30)
			}

			if (webtrends_on == 1) {
				$("input#webtrends_cookieSwitch").prop('checked', false);
				$("#WebtrendsCookieState").empty().append(cookie_webtrends_not_accepted);
				updateCookie("cookieSettings", JSON.stringify({ webtrendsAllowed: 'False' }), 30)
			}

			if (oracle_on == 1) {
				$("input#oracle_cookieSwitch").prop('checked', false);
				$("#oracleCookieState").empty().append(cookie_oracle_not_accepted);
				updateCookie("cookieSettings", JSON.stringify({ oracleAllowed: 'False' }), 30)
			}
			if (google_analytics_on == 1) {
				$("input#google_analytics_cookieSwitch").prop('checked', false);
				$("#google_analyticsCookieState").empty().append(cookie_google_analytics_not_accepted);
				updateCookie("cookieSettings", JSON.stringify({ googleanalyticsAllowed: 'False' }), 30)
			}
		}





		if (piwik_on == 1) {
			$("input#cookieSwitch").on("click", function (e) {
				var check = $(this).prop('checked');
				if (check) {
					updateCookie("cookieSettings", JSON.stringify({ piwikAllowed: 'True' }), 30)

					$("#spanCookieState").empty().append(cookie_piwik_accepted);

					acceptTrackingTools(true, false, false);
				} else {
					updateCookie("cookieSettings", JSON.stringify({ piwikAllowed: 'False' }), 30)
					$("#spanCookieState").empty().append(cookie_piwik_not_accepted);
					delCookie("_pk_id");
					delCookie("_pk_ses");

					refuseTrackingTools(true, false, false);
				}
			});
		}

		if (webtrends_on == 1) {
			$("input#webtrends_cookieSwitch").on("click", function (e) {
				var check = $(this).prop('checked');
				if (check) {
					updateCookie("cookieSettings", JSON.stringify({ webtrendsAllowed: 'True' }), 30)

					$("#WebtrendsCookieState").empty().append(cookie_webtrends_accepted);

					acceptTrackingTools(false, true, false,false);
				} else {
					updateCookie("cookieSettings", JSON.stringify({ webtrendsAllowed: 'False' }), 30)

					$("#WebtrendsCookieState").empty().append(cookie_webtrends_not_accepted);
					refuseTrackingTools(false, true, true,false);

					clickOnUncheckedInput("input#oracle_cookieSwitch", true);

				}
			});
		}

		if (oracle_on == 1) {
			$("input#oracle_cookieSwitch").on("click", function (e) {
				var check = $(this).prop('checked');
				if (check) {
					updateCookie("cookieSettings", JSON.stringify({ oracleAllowed: 'True' }), 30);
					$("#oracleCookieState").empty().append(cookie_oracle_accepted);
					acceptTrackingTools(false, false, true,false);
					clickOnUncheckedInput("input#webtrends_cookieSwitch", false);
				}
				else {
					updateCookie("cookieSettings", JSON.stringify({ oracleAllowed: 'False' }), 30);
					$("#oracleCookieState").empty().append(cookie_oracle_not_accepted);
					refuseTrackingTools(false, false, true,false);
					delCookieOracle("ORA_FPC", "/", "." + strCurrentDomain);
				}
			});
		}

		if (google_analytics_on == 1) {
			$("input#google_analytics_cookieSwitch").on("click", function (e) {
				var check = $(this).prop('checked');
				if (check) {
					updateCookie("cookieSettings", JSON.stringify({ googleanalytics: 'True' }), 30)

					$("#google_analyticsCookieState").empty().append(cookie_google_analytics_accepted);

					acceptTrackingTools(false, false, false, true);
				} else {
					updateCookie("cookieSettings", JSON.stringify({ googleanalytics: 'False' }), 30)
					$("#google_analyticsCookieState").empty().append(cookie_google_analytics_not_accepted);
					delCookie("_ga");
					delCookie("_gat");
					delCookie("_gid");

					refuseTrackingTools(false, false, false, true);
				}
			});
		}
	}





	function clickOnUncheckedInput(elemSelector, hasToBe) {
		if ($(elemSelector).is(":checked") == hasToBe) {
			$(elemSelector).click();
		}
	}

	function shouldWeAskForCookies() {
		var ask = (getValueFrom("cookieSettings", "askForCookies") == "False") ? false : true;
		return ask;
	}

	function areCookiesAllowed() {

		if (isPiwikAllowed()) {
			return true;
		}
		if (isWebtrandsAllowed()) {
			return true;
		}
		if (isOracleAllowed()) {
			return true;
		}
		if (isGoogleAnalyticsAllowed()) {
			return true;
		}

		return false;
	}

	function setSettingCookie() {
		if (getCookie("cookieSettings") == "") {
			setCookie("cookieSettings", JSON.stringify({ askForCookies: 'True', piwikAllowed: 'False', webtrendsAllowed: 'False', oracleAllowed: 'False', googleanalyticsAllowed: 'False' }), 30);
		}
	}

	function isPiwikAllowed() {
		var allowed = (getValueFrom("cookieSettings", "piwikAllowed") == "True") ? true : false;
		return allowed;
	}

	function isWebtrandsAllowed() {
		var allowed = (getValueFrom("cookieSettings", "webtrendsAllowed") == "True") ? true : false;
		return allowed;
	}

	function isOracleAllowed() {
		var allowed = (getValueFrom("cookieSettings", "oracleAllowed") == "True") ? true : false;
		return allowed;
	}

	function isGoogleAnalyticsAllowed() {
		var allowed = (getValueFrom("cookieSettings", "googleanalyticsAllowed") == "True") ? true : false;
		return allowed;
	}

	function askForCookies(linkTo) {
		if (cAsking) {
			if (log_on == 1) { console.log("> ...asking successfull!") };

			$.cookieBar({
				message: cookie_message + ' <a href="' + linkTo + '" title="' + cookie_link_title + '">' + cookie_link_text + '</a>',
				acceptButton: true,
				acceptText: cookie_button_text1,
				acceptFunction: acceptCookies,
				fixed: true,
				declineButton: true,
				declineText: cookie_button_text2,
				declineFunction: refuseCookies,
				forceShow: true,
				effect: 'slide',
				zindex: '11111',
				renewOnVisit: false,
				append: true,
				bottom: false
			});
		}
	}

	function setCookieState(box) {
		updateCookie("cookieSettings", JSON.stringify({ askForCookies: 'False' }), 30)

		if (box.checked) {
			updateCookie("cookieSettings", JSON.stringify({ piwikAllowed: 'True', webtrendsAllowed: 'True', oracleAllowed: 'True', googleanalyticsAllowed: 'True' }), 30)
		}
		else {
			updateCookie("cookieSettings", JSON.stringify({ piwikAllowed: 'False', webtrendsAllowed: 'False', oracleAllowed: 'False', googleanalyticsAllowed: 'False' }), 30)
		}


		return false;
	}

	function acceptTrackingTools(piwik, webtrends, oracle, googleAnalytics) {
		if (piwik) {
			updateCookie("cookieSettings", JSON.stringify({ piwikAllowed: 'True' }), 30)
		}
		if (webtrends) {
			updateCookie("cookieSettings", JSON.stringify({ webtrendsAllowed: 'True' }), 30)
		}
		if (oracle) {
			updateCookie("cookieSettings", JSON.stringify({ oracleAllowed: 'True' }), 30)
		}
		if (googleAnalytics) {
			updateCookie("cookieSettings", JSON.stringify({ googleanalyticsAllowed: 'True' }), 30)
		}
	}

	function refuseTrackingTools(piwik, webtrends, oracle, googleAnalytics) {
		if (piwik) {
			updateCookie("cookieSettings", JSON.stringify({ piwikAllowed: 'False' }), 30)
		}
		if (webtrends) {
			updateCookie("cookieSettings", JSON.stringify({ webtrendsAllowed: 'False' }), 30)
		}
		if (oracle) {
			updateCookie("cookieSettings", JSON.stringify({ oracleAllowed: 'False' }), 30)
		}
		if (googleAnalytics) {
			updateCookie("cookieSettings", JSON.stringify({ googleanalyticsAllowed: 'False' }), 30)
		}
	}

	function acceptCookies(e) {
		if (log_on == 1) { console.log("> Cookies accepted by user!") };

		cAsking = false;
		cAllowed = true;

		var piwik_bool = (piwik_on == 1) ? 'True' : 'False';
		var webtrends_bool = (webtrends_on == 1) ? 'True' : 'False';
		var oracle_bool = (oracle_on == 1) ? 'True' : 'False';
		var googleanalytics_bool = (google_analytics_on == 1) ? 'True' : 'False';


		updateCookie("cookieSettings", JSON.stringify({ askForCookies: 'False', piwikAllowed: piwik_bool, webtrendsAllowed: webtrends_bool, oracleAllowed: oracle_bool, googleanalyticsAllowed: googleanalytics_bool }), 30)

		return false;
	}

	function refuseCookies(e) {
		if (log_on == 1) { console.log("> Cookies refused by user!") };

		cAsking = false;
		cAllowed = false;

		updateCookie("cookieSettings", JSON.stringify({ askForCookies: 'False', piwikAllowed: 'False', webtrendsAllowed: 'False', oracleAllowed: 'False', googleanalyticsAllowed:'False' }), 30)

		return false;
	}


	function updateCookie(cname, cvalue, exdays) {

		// Get new json keys.
		var newObject = JSON.parse(cvalue)
		var keys = [];
		for (var k in newObject) keys.push(k);

		// Try get old cookie.
		var oldCookieValue = getCookie(cname);
		if (oldCookieValue == '') {
			// Set new cookie
			setCookie(cname, JSON.stringify({ askForCookies: 'True', piwikAllowed: 'False', webtrendsAllowed: 'False', oracleAllowed: 'False', googleanalyticsAllowed: 'False' }), exdays);
		}
		else {
			// Get the values from cookie.
			var valuesObject = JSON.parse(oldCookieValue);
			// Set new cookie.
			for (var key in keys) {
				var keyString = keys[key];
				valuesObject[keyString] = newObject[keyString];
			}
			setCookie(cname, JSON.stringify(valuesObject), exdays);
		}
	}

	function getValueFrom(cname, pname) {
		// Try get cookie first
		var oldCookieValue = getCookie(cname);
		if (oldCookieValue == "") {
			// cookie is not there.
			return "";
		}
		else {
			// cookie is there.
			var valuesObject = JSON.parse(oldCookieValue);
			for (var k in valuesObject) {
				if (k == pname) {
					return valuesObject[k];
				}
			}
		}
	}

	function delCookie(cname) {
		var ca = document.cookie.split(';');
		for (var i = 0; i < ca.length; i++) {
			var c = ca[i].trim();
			var cSub = c.substring(0, cname.length);
			if (cSub == cname) {
				setCookie(c, "", -3650);
			}
		}
	}

	function delCookieOracle(name, path, domain) {

		var cDelete = name + "=";
		cDelete += "; expires=expires=Thu, 01 Jan 1970 00:00:01 GMT";
		cDelete += "; path=" + path;
		cDelete += (domain) ? ";domain=" + domain : "";
		document.cookie = cDelete;
	}



	function setCookie(cname, cvalue, exdays) {
		var d = new Date();
		d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
		var expires = "expires=" + d.toUTCString();
		document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
	}

	function getCookie(cname) {
		var name = cname + "=";
		var ca = document.cookie.split(';');
		for (var i = 0; i < ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0) == ' ') {
				c = c.substring(1);
			}
			if (c.indexOf(name) == 0) {
				return c.substring(name.length, c.length);
			}
		}
		return "";
	}


	function callGoogleAnalyticsParameters(settings) {
		for (var i = 1; i < settings.length; i++) {
			var parameters = settings[i].split(",");
			if (parameters.length == 2) {
				ga(parameters[0], parameters[1]);
			}
			if (parameters.length == 3) {
				ga(parameters[0], parameters[1], parameters[2]);
			}
		}
	}

	function loadGoogleAnalytics(log_on, cookie_ga_settings) {

		(function (i, s, o, g, r, a, m) {
			i['GoogleAnalyticsObject'] = r; i[r] = i[r] || function () {
				(i[r].q = i[r].q || []).push(arguments)
			}, i[r].l = 1 * new Date(); a = s.createElement(o),
				m = s.getElementsByTagName(o)[0]; a.async = 1; a.src = g; m.parentNode.insertBefore(a, m)
		})(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');



		var settings = cookie_ga_settings.split(";");

		var gaid = settings[0].split(",")[1];
		if (getValueFrom('cookieSettings', 'googleanalyticsAllowed') == 'True') {

			//Der Settings-string wird zuerst mit Semikolon gesplitted
			//dann mit Komma um and die Parameter zu kommen.
			//Die Parameter werden in einer schleife gesetzt.
			//Der String ist abhänging von der Reihenfolge.
			ga('create', gaid, 'auto');
			callGoogleAnalyticsParameters(settings);
		}
	}


	function loadPiwik(log_on, piwik_id) {

		// Disable cookies
		if (getValueFrom('cookieSettings', 'piwikAllowed') != 'True') {
			_paq.push(['disableCookies']);
			_paq.push(['trackPageView']);
		}

		_paq.push(['trackPageView']);
		_paq.push(['enableLinkTracking']);

		var u = 'https://piwik.com-online.com/';
		_paq.push(['setTrackerUrl', u + 'piwik.php']);
		_paq.push(['setSiteId', piwik_id]);
		var d = document, g = d.createElement('script'), s = d.getElementsByTagName('script')[0];
		g.type = 'text/javascript'; g.async = true; g.defer = true; g.src = u + 'piwik.js'; s.parentNode.insertBefore(g, s);

		$("body").append("<noscript><p><img src='https://piwik.com-online.com/piwik.php?idsite='" + piwik_id + " style='border:0;' alt='' /></p></noscript><!-- End Piwik Code -->");

	}

	// Start initialize webtrends script.
	function loadWebtrends(log_on, webtrends_on, oracle_on, oracle_plugin_path) {
		if (webtrends_on == 1) {

			$("body").append("<!--START OF SmartSource Data Collector TAG v10.4.23 -- ><!--Copyright(c) 2016 Webtrends Inc.All rights reserved. --><script>");

			var cookieTypes = 'none';
			var strCurrentDomain = window.location.hostname;

			var pluginsContainer = {
				hm: { src: "//s.webtrends.com/js/webtrends.hm.js" }
			}

			if (getValueFrom('cookieSettings', 'webtrendsAllowed') == 'True') {
				cookieTypes = 'all';

				if (oracle_on == 1) {
					if (getValueFrom('cookieSettings', 'oracleAllowed') == 'True') {
						if (log_on == 1) { console.log("> webtrends with oracle") };

						pluginsContainer = {
							hm: { src: "//s.webtrends.com/js/webtrends.hm.js" },
							omp: {
								src: oracle_plugin_path,
								destinations: [{
									accountGuid: "9gj0e36cnk",
									server: "dc.oracleinfinity.io"
								}],
								'waitForCallback': true,
								Qb: true
							}
						}
					}
				}
			}


			window.webtrendsAsyncInit = function () {
				var dcs = new Webtrends.dcs().init({
					dcsid: "dcs222ydo2zfjjf2rxjcj0x7y_9u8c",
					domain: "statse.webtrendslive.com",
					timezone: "1",
					FPCConfig: { enabled: true },
					TPCConfig: { enabled: true, cfgType: "1" },
					i18n: true,
					download: true,
					downloadtypes: "xls,doc,pdf,txt,csv,zip,docx,xlsx,rar,gzip,jpg,jpeg",
					cookieTypes: cookieTypes,
					fpcdom: strCurrentDomain,
					onsitedoms: strCurrentDomain,
					plugins: pluginsContainer
				});
				dcs.track({

					transform: function (dcsObject, multiTrackObject) {
						dcsObject.DCS.dcsipa = 1;
					}
				});
			};
			(function () {
				var s = document.createElement("script"); s.async = true; s.src = "//s.webtrends.com/js/webtrends.min.js";
				var s2 = document.getElementsByTagName("script")[0]; s2.parentNode.insertBefore(s, s2);
			}());


			$("body").append("</script><noscript><img alt='dcsimg' id='dcsimg' width='1' height='1' src='//statse.webtrendslive.com/dcs222ydo2zfjjf2rxjcj0x7y_9u8c/njs.gif?dcsuri=/nojavascript&amp;WT.js=No&amp;WT.tv=10.4.23&amp;dcssip=www.contitech.de;dcsipa=1'/></noscript><!-- END OF SmartSource Data Collector TAG v10.4.23 -->");
		}

	}

	// start
	$(function () {
		$(".comonCookie").comonCookie();
	});

})(jQuery);