import nlp from 'nlp_compromise'
import request from 'superagent-bluebird-promise'
import htmlparser from 'htmlparser2'
import tm from 'text-miner'
import { stop_words } from './stop_words.js'

export default class Topick {

  static getKeywords(uri) {
    return Utils.httpGet(uri)
    .then((res) => {
      return Utils.spotKeywords(Utils.stripPunc(Utils.parseHtml(res.text)))
    })
  }

}

class Utils {

  static httpGet(uri) {
    return request.get(uri)
  }

  // We only want to get the text in the document's title and body
  // TODO: look for meta tags as well
  static parseHtml(rawHtml) {
    let outputString = ""
    let writeFlag = false
    let parser = new htmlparser.Parser({

      onopentag: (name, attribs) => {
        if(name === "title" || name === "p" || name === "b" || name === "em") {
          writeFlag = true
        }
      },
      ontext: (text) =>  {
        if (writeFlag) {
          // console.log(text);  
          outputString += ` ${text}`
        }
      },
      onclosetag: (tagname) => {
        writeFlag = false
      }
    }, {decodeEntities: true})

    parser.write(rawHtml)
    parser.end()
    return outputString
  }

  static compareNGramByCount(a,b) {
    if (a.count < b.count) { return -1 }
    else if (a.count > b.count) { return 1 }
    else { return 0 }
  }

  static spotKeywords(text) {
    let output = []
    // let thing = nlp.ngram(text, {min_count: 3, max_size: 2})
    let thing = nlp.ngram(text, {min_count: 3, max_size: 2}).reduce((init,curr) => {
      return init.concat(curr)
    }).sort(this.compareNGramByCount).reverse()
    // thing.forEach((kw) => {
    //   output.push(kw.word)
    //   if (output.length > 9) { console.log(new Set(output)); return new Set(output) }
    // })
    for (var i = thing.length; i > 0; i--) {
      output.push(thing[i-1].word);
      console.log(thing[i-1].word);
      if (output.length > 9) { console.log(new Set(output)); return output }
    }
    // console.log(new Set(output));
    return output

    // thing.forEach((kw_set) => {

    //   kw_set.forEach((kw) => {

    //     output.push(kw.word)
    //   })
    // })
    //     console.log(kw.word);
    //     console.log(nlp.spot(kw.word));
    //     let spottedKw = nlp.spot(kw.word)
    //     if (spottedKw.length > 0) {
    //       output.push(spottedKw[0].text)  
    //     }
        
    //   })
    //   // console.log(kw);
    //   // console.log(nlp.noun(kw.word))
    //   // if (kw.word.length > 2) {
        
    //   // }
    // })
    // nlp.spot(text).forEach((kw) => {
      // let ngram = nlp.ngram(kw.text, {min_count: 1, max_size: 2}).reduce((init,curr) => {
      //   return init.concat(curr)
      // })
      // ngram.forEach((kw) => {
      //   output.push(kw.word)  
      // })

    // output.push(kw.text)
      
    // })
    // console.log(new Set(output))

    // return nlp.spot(text)
  }

  static stripPunc(text) {
    // console.log(text.match(/[^_\W]+/g).join(' '));
    // return text.match(/[^_\W]+/g).join(' ')

    var c = new tm.Corpus([tm.utils.expandContractions(text)])
    // console.log(c.removeInterpunctuation().clean().removeWords(tm.STOPWORDS.EN).documents[0]);
    // console.log(c.removeInterpunctuation().clean().documents[0]);
    // debugger
    return c.removeInterpunctuation().clean().removeWords(stop_words).documents[0];
  }

  

/*
 * String method to remove stop words
 * Written by GeekLad http://geeklad.com
 * Stop words obtained from http://www.lextek.com/manuals/onix/stopwords1.html
 *   Usage: string_variable.removeStopWords();
 *   Output: The original String with stop words removed
 */
  // static removeStopWords(text) {
  //     var x;
  //     var y;
  //     var word;
  //     var stop_word;
  //     var regex_str;
  //     var regex;
  //     var cleansed_string = text
           
  //     // Split out all the individual words in the phrase
  //     var words = cleansed_string.match(/[^\s]+|\s+[^\s+]$/g)
   
  //     // Review all the words
  //     for(x=0; x < words.length; x++) {
  //         // For each word, check all the stop words
  //         for(y=0; y < stop_words.length; y++) {
  //             // Get the current word
  //             word = words[x].replace(/\s+|[^a-z]+/ig, "");   // Trim the word and remove non-alpha
               
  //             // Get the stop word
  //             stop_word = stop_words[y];
               
  //             // If the word matches the stop word, remove it from the keywords
  //             if(word.toLowerCase() == stop_word) {
  //                 // Build the regex
  //                 regex_str = "^\\s*"+stop_word+"\\s*$";      // Only word
  //                 regex_str += "|^\\s*"+stop_word+"\\s+";     // First word
  //                 regex_str += "|\\s+"+stop_word+"\\s*$";     // Last word
  //                 regex_str += "|\\s+"+stop_word+"\\s+";      // Word somewhere in the middle
  //                 regex = new RegExp(regex_str, "ig");
               
  //                 // Remove the word from the keywords
  //                 cleansed_string = cleansed_string.replace(regex, " ");
  //             }
  //         }
  //     }
  //     return cleansed_string.replace(/^\s+|\s+$/g, "");
  // }

}


