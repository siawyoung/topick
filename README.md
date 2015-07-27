# Topick

One trick pony NLP library for extracting keywords from HTML documents. It uses `htmlparser2` for HTML parsing, `nlp_compromise` for NLP and `text-miner` for text cleaning and removing stop words.

Here is Topick in action, being used in a Telegram bot to autosuggest tags for links mentioned in a conversation:

<img src="http://siawyoung.com/coding/2015-07-28-topick/mure-sneak-peek-1.jpg" width="250">
<img src="http://siawyoung.com/coding/2015-07-28-topick/mure-sneak-peek-2.jpg" width="250">

## Installation

`npm install topick`

Topick is intended primarily for server-side use because of cross-domain issues, although I'm working on making the codebase isomorphic so that browser use is possible as well (with an appropriate module loader such as webpack).

## Usage

The simplest way to use Topick:

```js
import Topick from 'topick'

Topick.getKeywords('http://example.com/').then((keywords) => {
  console.log(keywords); // ['most relevant keyword', 'very relevant keyword', 'somewhat relevant keyword']
  // do something with your keywords
})
```

The keywords are arranged in order of decreasing relevance.

### `getKeywords(uri[,opts,cb])`

#### Options

`getKeywords` takes either a valid `HTTP` URI, or a HTML string, and returns a promise that can be resolved appropriately. `getKeywords` also accepts an optional options object:

```js
Topick.getKeywords('http://example.com/', {
  htmlTags: ['p'],
  ngram: {
    min_count: 4,
    max_size: 2
  }
}).then((keywords) => {
  console.log(keywords);
})
```

Currently available options are:

##### `htmlTags`

Default: `['p', 'b', 'em', 'title']`

An array of HTML tags that should be parsed.

#### `method`

Default: `combined`

Topick includes three methods for generating keywords. 

`ngram`

Generates n-grams from the content string and ranks them in terms of frequency.

`namedentities`

Uses `nlp_compromise`'s `spot` method to identify [named entities](https://en.wikipedia.org/wiki/Named-entity_recognition) before generating n-grams based on these named entities.

`combined`

Runs both `ngram` and `namedentities` methods, then combines their ranking.

##### `useDefaultStopWords`

Default: `true`

If true, uses Topick's internal stop words dictionary to remove stop words. If false, no stop word removal will be performed unless you supply your own stop word array (see `customStopWords`).

Topick's dictionary is a set union of all six English collections found [here](https://code.google.com/p/stop-words/).

##### `customStopWords`

Default: `[]`

An array of strings that should be used as stop words. This has no bearing on `useDefaultStopWords`, although it should be populated with your own stop word array if `useDefaultStopWords` is set to `false`, else Topick will generate a lot of irrelevant keywords.

##### `maxNumberOfKeywords`

Default: 10

Maximum number of keywords to generate.

##### `minKeywordLength`

Default: 3

Minimum length of generated keywords.

##### `ngram`

Default:

```
{ min_count: 3, max_size: 1 }
```

Defines options for n-gram generation. 

`min_count` is the minimum number of times a particular n-gram should appear in the document before being considered. There should be no need to change this number.

`max_size` is the maximum size of n-grams that should be generated (defaults to generating unigrams).

##### `progressiveGeneration`

Default: `true`

If set to true, `progressiveGeneration` will progressively generate n-grams with weaker settings until the specified number of keywords set in `maxNumberOfKeywords` is hit.

For example: for a `min_count` of 3 and `maxNumberOfKeywords` of 10, Topick only generates 5 keywords, then `progressiveGeneration` will decrease the `min_count` to 2, and then to 1, until 10 keywords can be generated.

`progressiveGeneration` does not guarantee that `maxNumberOfKeywords` keywords will be generated (like if even at `min_count` of 1, your specified `maxNumberOfKeywords` still cannot be reached).

#### Callback

In case you're not familar with promises or are unable to use them, `getKeywords` also accepts a callback function as its **last** argument:

```js
topick.getKeywords("http://example.com", {
  customStopWords: []
}, (keywords) => {
  console.log("This is the callback function");
  console.log(keywords);
})
.then((keywords) => {
  console.log("This is the promise");
  console.log(keywords)
})

// "This is the callback function"
// ["cool keyword", "another cool keyword"]
// "This is the promise"
// ["cool keyword", "another cool keyword"]
```

Notice that regardless of whether a callback function is specified, `getKeywords` continues to return a Promise.

### `getKeywordsSync(uri[, opts])`

There are no plans to support a synchronous version of `getKeywords`.

### `getDomain(uri)`

Example:

```js
Topick.getDomain('http://example.com')
```

Given `http://example.com`, returns `example`. Removes URI scheme, port number, and TLD.

## Contributing

Contributions are welcome!

Topick is written in ES6 wherever possible. The development workflow is centered primarily around webpack, so be sure to check out `webpack.config.js`.