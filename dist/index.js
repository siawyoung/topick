module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var _utils = __webpack_require__(2);

	var _utils2 = _interopRequireDefault(_utils);

	var _methods = __webpack_require__(8);

	var _methods2 = _interopRequireDefault(_methods);

	var _config = __webpack_require__(9);

	var _config2 = _interopRequireDefault(_config);

	var Topick = (function () {
	  function Topick() {
	    _classCallCheck(this, Topick);
	  }

	  _createClass(Topick, null, [{
	    key: 'getKeywords',
	    value: function getKeywords(uri, opts) {
	      var config = (0, _config2['default'])(opts);
	      var cb = typeof arguments[arguments.length - 1] === "function" ? arguments[arguments.length - 1] : undefined;
	      return _utils2['default'].httpGet(uri).then(function (res) {
	        var result = (0, _methods2['default'])(res.text, config);
	        if (cb) {
	          cb(result);
	        }
	        return result;
	      })['catch'](function () {
	        var result = (0, _methods2['default'])(uri, config);
	        if (cb) {
	          cb(result);
	        }
	        return result;
	      });
	    }
	  }, {
	    key: 'getDomain',
	    value: function getDomain(uri) {
	      return _utils2['default'].getDomainString(uri);
	    }
	  }]);

	  return Topick;
	})();

	exports['default'] = Topick;
	module.exports = exports['default'];

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var _nlp_compromise = __webpack_require__(3);

	var _nlp_compromise2 = _interopRequireDefault(_nlp_compromise);

	var _superagentBluebirdPromise = __webpack_require__(4);

	var _superagentBluebirdPromise2 = _interopRequireDefault(_superagentBluebirdPromise);

	var _htmlparser2 = __webpack_require__(5);

	var _htmlparser22 = _interopRequireDefault(_htmlparser2);

	var _textMiner = __webpack_require__(6);

	var _textMiner2 = _interopRequireDefault(_textMiner);

	var Utils = (function () {
	  function Utils() {
	    _classCallCheck(this, Utils);
	  }

	  _createClass(Utils, null, [{
	    key: 'httpGet',

	    // returns a get request wrapped in a promise
	    value: function httpGet(uri) {
	      return _superagentBluebirdPromise2['default'].get(uri);
	    }
	  }, {
	    key: 'httpGetSync',
	    value: function httpGetSync(uri) {
	      var req = new XMLHttpRequest();
	      req.open('GET', uri, false);
	      req.send(null);
	      return req.status === 200 ? req.responseText : uri;
	    }

	    // parses and extracts text from the html tags supplied in opts
	  }, {
	    key: 'parseHtml',
	    value: function parseHtml(rawHtml, opts) {
	      var outputString = "";
	      var writeFlag = false;
	      var tags = opts.htmlTags;
	      var parser = new _htmlparser22['default'].Parser({

	        onopentag: function onopentag(name, attribs) {
	          if (tags.includes(name)) {
	            writeFlag = true;
	          }
	        },
	        ontext: function ontext(text) {
	          if (writeFlag) {
	            outputString += ' ' + text;
	          }
	        },
	        onclosetag: function onclosetag(tagname) {
	          writeFlag = false;
	        }
	      }, { decodeEntities: true });

	      parser.write(rawHtml);
	      parser.end();
	      return outputString;
	    }

	    // custom compare function for comparing ngram objects by their count property:
	    // [{ word: 'asd', count: 3 }, { word: 'asdf', count: 2 }]
	  }, {
	    key: 'compareNGramByCount',
	    value: function compareNGramByCount(a, b) {
	      if (a.count < b.count) {
	        return -1;
	      } else if (a.count > b.count) {
	        return 1;
	      } else {
	        return 0;
	      }
	    }

	    // this does two things
	    // first sort by count
	    // then it retrieves the actual word from each ngram object
	    // accepts array of NGram objects: [{word: 'adsf', count: 1}, ...]
	    // returns array of strings: ['asdf', ...]
	  }, {
	    key: 'sortNGrams',
	    value: function sortNGrams(ngrams) {
	      return ngrams.sort(this.compareNGramByCount).map(function (ngram) {
	        return ngram.word;
	      });
	    }

	    // while taking the first n items, ignores duplicates
	    // accepts and returns array of strings
	  }, {
	    key: 'filterWords',
	    value: function filterWords(wordArray, opts) {
	      var output = [];
	      for (var i = wordArray.length - 1; i >= 0; i--) {
	        var currWord = wordArray[i];
	        if (output.length >= opts.maxNumberOfKeywords) {
	          return output;
	        }
	        if (output.includes(currWord)) {
	          continue;
	        }
	        if (currWord.length <= opts.minKeywordLength) {
	          continue;
	        }
	        output.push(currWord);
	      }
	      return output;
	    }

	    // generates ngrams with settings specified by opts
	  }, {
	    key: 'generateNGrams',
	    value: function generateNGrams(text, opts) {
	      var ngrams = _nlp_compromise2['default'].ngram(text, opts.ngram).reduce(function (init, curr) {
	        return init.concat(curr);
	      });
	      if (ngrams.length <= opts.maxNumberOfKeywords && opts.progressiveGeneration && opts.ngram.min_count >= 1) {
	        opts.ngram.min_count -= 1;
	        ngrams = this.generateNGrams(text, opts);
	      }
	      return ngrams;
	    }

	    // identifies named entities using nlp_compromise's spot function
	    // returns a single string concatenating all the named entities for further processing using ngrams
	  }, {
	    key: 'generateNamedEntitiesString',
	    value: function generateNamedEntitiesString(text) {
	      return _nlp_compromise2['default'].spot(text).map(function (kw) {
	        return kw.text;
	      }).join(" ");
	    }

	    // this function performs cleaning on the document by:
	    // expanding contractions (from i'll to I will)
	    // removing inter punctuations (such as ? and !)
	    // removing whitespace between words
	    // removing stop words using the default stop word dictionary
	    // removing custom stop words specified in the user supplied opts
	  }, {
	    key: 'clean',
	    value: function clean(text, opts) {
	      var c = new _textMiner2['default'].Corpus([_textMiner2['default'].utils.expandContractions(text)]).removeInterpunctuation().clean();
	      if (opts.useDefaultStopWords === true) {
	        var stop_words = __webpack_require__(7).stop_words;
	        c = c.removeWords(stop_words, 'gi');
	      }
	      var custom_stop_words = opts.customStopWords;
	      if (custom_stop_words) {
	        c = c.removeWords(custom_stop_words);
	      }
	      return c.documents[0];
	    }

	    // given a uri string http://google.com
	    // return 'google'
	  }, {
	    key: 'getDomainString',
	    value: function getDomainString(uri) {
	      var domain = undefined;
	      // find & remove protocol (http, ftp, etc.) and get domain
	      if (url.indexOf("://") > -1) {
	        domain = url.split('/')[2];
	      } else {
	        domain = url.split('/')[0];
	      }
	      // find & remove port number
	      // find and remove TLD
	      return domain.split(":")[0].split(".")[0];
	    }
	  }]);

	  return Utils;
	})();

	exports['default'] = Utils;
	module.exports = exports['default'];

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = require("nlp_compromise");

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = require("superagent-bluebird-promise");

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = require("htmlparser2");

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = require("text-miner");

/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var stop_words = ["﻿able", "about", "above", "abroad", "according", "accordingly", "across", "actually", "adj", "after", "afterwards", "again", "against", "ago", "ahead", "ain't", "all", "allow", "allows", "almost", "alone", "along", "alongside", "already", "also", "although", "always", "am", "amid", "amidst", "among", "amongst", "an", "and", "another", "any", "anybody", "anyhow", "anyone", "anything", "anyway", "anyways", "anywhere", "apart", "appear", "appreciate", "appropriate", "are", "aren't", "around", "as", "a's", "aside", "ask", "asking", "associated", "at", "available", "away", "awfully", "back", "backward", "backwards", "be", "became", "because", "become", "becomes", "becoming", "been", "before", "beforehand", "begin", "behind", "being", "believe", "below", "beside", "besides", "best", "better", "between", "beyond", "both", "brief", "but", "by", "came", "can", "cannot", "cant", "can't", "caption", "cause", "causes", "certain", "certainly", "changes", "clearly", "c'mon", "co", "co.", "com", "come", "comes", "concerning", "consequently", "consider", "considering", "contain", "containing", "contains", "corresponding", "could", "couldn't", "course", "c's", "currently", "dare", "daren't", "definitely", "described", "despite", "did", "didn't", "different", "directly", "do", "does", "doesn't", "doing", "done", "don't", "down", "downwards", "during", "each", "edu", "eg", "eight", "eighty", "either", "else", "elsewhere", "end", "ending", "enough", "entirely", "especially", "et", "etc", "even", "ever", "evermore", "every", "everybody", "everyone", "everything", "everywhere", "ex", "exactly", "example", "except", "fairly", "far", "farther", "few", "fewer", "fifth", "first", "five", "followed", "following", "follows", "for", "forever", "former", "formerly", "forth", "forward", "found", "four", "from", "further", "furthermore", "get", "gets", "getting", "given", "gives", "go", "goes", "going", "gone", "got", "gotten", "greetings", "had", "hadn't", "half", "happens", "hardly", "has", "hasn't", "have", "haven't", "having", "he", "he'd", "he'll", "hello", "help", "hence", "her", "here", "hereafter", "hereby", "herein", "here's", "hereupon", "hers", "herself", "he's", "hi", "him", "himself", "his", "hither", "hopefully", "how", "howbeit", "however", "hundred", "i'd", "ie", "if", "ignored", "i'll", "i'm", "immediate", "in", "inasmuch", "inc", "inc.", "indeed", "indicate", "indicated", "indicates", "inner", "inside", "insofar", "instead", "into", "inward", "is", "isn't", "it", "it'd", "it'll", "its", "it's", "itself", "i've", "just", "k", "keep", "keeps", "kept", "know", "known", "knows", "last", "lately", "later", "latter", "latterly", "least", "less", "lest", "let", "let's", "like", "liked", "likely", "likewise", "little", "look", "looking", "looks", "low", "lower", "ltd", "made", "mainly", "make", "makes", "many", "may", "maybe", "mayn't", "me", "mean", "meantime", "meanwhile", "merely", "might", "mightn't", "mine", "minus", "miss", "more", "moreover", "most", "mostly", "mr", "mrs", "much", "must", "mustn't", "my", "myself", "name", "namely", "nd", "near", "nearly", "necessary", "need", "needn't", "needs", "neither", "never", "neverf", "neverless", "nevertheless", "new", "next", "nine", "ninety", "no", "nobody", "non", "none", "nonetheless", "noone", "no-one", "nor", "normally", "not", "nothing", "notwithstanding", "novel", "now", "nowhere", "obviously", "of", "off", "often", "oh", "ok", "okay", "old", "on", "once", "one", "ones", "one's", "only", "onto", "opposite", "or", "other", "others", "otherwise", "ought", "oughtn't", "our", "ours", "ourselves", "out", "outside", "over", "overall", "own", "particular", "particularly", "past", "per", "perhaps", "placed", "please", "plus", "possible", "presumably", "probably", "provided", "provides", "que", "quite", "qv", "rather", "rd", "re", "really", "reasonably", "recent", "recently", "regarding", "regardless", "regards", "relatively", "respectively", "right", "round", "said", "same", "saw", "say", "saying", "says", "second", "secondly", "see", "seeing", "seem", "seemed", "seeming", "seems", "seen", "self", "selves", "sensible", "sent", "serious", "seriously", "seven", "several", "shall", "shan't", "she", "she'd", "she'll", "she's", "should", "shouldn't", "since", "six", "so", "some", "somebody", "someday", "somehow", "someone", "something", "sometime", "sometimes", "somewhat", "somewhere", "soon", "sorry", "specified", "specify", "specifying", "still", "sub", "such", "sup", "sure", "take", "taken", "taking", "tell", "tends", "th", "than", "thank", "thanks", "thanx", "that", "that'll", "thats", "that's", "that've", "the", "their", "theirs", "them", "themselves", "then", "thence", "there", "thereafter", "thereby", "there'd", "therefore", "therein", "there'll", "there're", "theres", "there's", "thereupon", "there've", "these", "they", "they'd", "they'll", "they're", "they've", "thing", "things", "think", "third", "thirty", "this", "thorough", "thoroughly", "those", "though", "three", "through", "throughout", "thru", "thus", "till", "to", "together", "too", "took", "toward", "towards", "tried", "tries", "truly", "try", "trying", "t's", "twice", "two", "un", "under", "underneath", "undoing", "unfortunately", "unless", "unlike", "unlikely", "until", "unto", "up", "upon", "upwards", "us", "use", "used", "useful", "uses", "using", "usually", "v", "value", "various", "versus", "very", "via", "viz", "vs", "want", "wants", "was", "wasn't", "way", "we", "we'd", "welcome", "well", "we'll", "went", "were", "we're", "weren't", "we've", "what", "whatever", "what'll", "what's", "what've", "when", "whence", "whenever", "where", "whereafter", "whereas", "whereby", "wherein", "where's", "whereupon", "wherever", "whether", "which", "whichever", "while", "whilst", "whither", "who", "who'd", "whoever", "whole", "who'll", "whom", "whomever", "who's", "whose", "why", "will", "willing", "wish", "with", "within", "without", "wonder", "won't", "would", "wouldn't", "yes", "yet", "you", "you'd", "you'll", "your", "you're", "yours", "yourself", "yourselves", "you've", "zero", "﻿a", "how's", "i", "ours ", "when's", "why's", "a", "able", "b", "c", "d", "e", "f", "g", "h", "j", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "uucp", "w", "x", "y", "z", "zero", "﻿I", "www", "amoungst", "amount", "bill", "bottom", "call", "computer", "con", "couldnt", "cry", "de", "describe", "detail", "due", "eleven", "empty", "fifteen", "fify", "fill", "find", "fire", "forty", "front", "full", "give", "hasnt", "herse”", "himse”", "interest", "itse”", "mill", "move", "myse”", "part", "put", "show", "side", "sincere", "sixty", "system", "ten", "thick", "thin", "top", "twelve", "twenty", "abst", "accordance", "act", "added", "adopted", "affected", "affecting", "affects", "ah", "announce", "anymore", "apparently", "approximately", "aren", "arent", "arise", "auth", "beginning", "beginnings", "begins", "biol", "briefly", "ca", "date", "ed", "effect", "et-al", "ff", "fix", "gave", "giving", "hed", "heres", "hes", "hid", "home", "id", "im", "immediately", "importance", "important", "index", "information", "invention", "itd", "keys", "kg", "km", "largely", "lets", "line", "'ll", "means", "mg", "million", "ml", "mug", "na", "nay", "necessarily", "nos", "noted", "obtain", "obtained", "omitted", "ord", "owing", "page", "pages", "poorly", "possibly", "potentially", "pp", "predominantly", "present", "previously", "primarily", "promptly", "proud", "quickly", "ran", "readily", "ref", "refs", "related", "research", "resulted", "resulting", "results", "run", "sec", "section", "shed", "shes", "showed", "shown", "showns", "shows", "significant", "significantly", "similar", "similarly", "slightly", "somethan", "specifically", "state", "states", "stop", "strongly", "substantially", "successfully", "sufficiently", "suggest", "thered", "thereof", "therere", "thereto", "theyd", "theyre", "thou", "thoughh", "thousand", "throug", "til", "tip", "ts", "ups", "usefully", "usefulness", "'ve", "vol", "vols", "wed", "whats", "wheres", "whim", "whod", "whos", "widely", "words", "world", "youd", "youre"];
	exports.stop_words = stop_words;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var _utils = __webpack_require__(2);

	var _utils2 = _interopRequireDefault(_utils);

	exports["default"] = function (text, opts) {

	  var method = opts.method;
	  var cleanedText = _utils2["default"].clean(_utils2["default"].parseHtml(text, opts), opts);

	  switch (method) {

	    case "combined":
	      return Methods.combineNGramsAndNamedEntities(cleanedText, opts);
	    case "ngram":
	      return Methods.useNGrams(cleanedText, opts);
	    case "namedentites":
	      return Methods.useNamedEntities(cleanedText, ops);
	    default:
	      return Methods.combineNGramsAndNamedEntities(cleanedText, opts);

	  }
	};

	var Methods = (function () {
	  function Methods() {
	    _classCallCheck(this, Methods);
	  }

	  _createClass(Methods, null, [{
	    key: "useNGrams",
	    value: function useNGrams(text, opts) {
	      return _utils2["default"].filterWords(_utils2["default"].sortNGrams(_utils2["default"].generateNGrams(text, opts)), opts);
	    }
	  }, {
	    key: "useNamedEntities",
	    value: function useNamedEntities(text, opts) {
	      return _utils2["default"].useNGrams(_utils2["default"].generateNamedEntitiesString(text), opts);
	    }
	  }, {
	    key: "combineNGramsAndNamedEntities",
	    value: function combineNGramsAndNamedEntities(text, opts) {
	      return _utils2["default"].filterWords(_utils2["default"].sortNGrams(_utils2["default"].generateNGrams(text, opts).concat(_utils2["default"].generateNGrams(_utils2["default"].generateNamedEntitiesString(text), opts))), opts);
	    }
	  }]);

	  return Methods;
	})();

	module.exports = exports["default"];

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports['default'] = Config;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _default_config = __webpack_require__(10);

	var _default_config2 = _interopRequireDefault(_default_config);

	function Config(opts) {

	  return Object.assign(_default_config2['default'], opts || {});
	}

	module.exports = exports['default'];

/***/ },
/* 10 */
/***/ function(module, exports) {

	'use strict';

	module.exports = {

	  htmlTags: ['p', 'b', 'em', 'title'],
	  method: 'combined',
	  useDefaultStopWords: true,
	  maxNumberOfKeywords: 10,
	  minKeywordLength: 3,
	  ngram: {
	    min_count: 3,
	    max_size: 1
	  },
	  progressiveGeneration: true
	};

/***/ }
/******/ ]);