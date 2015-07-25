import nlp from 'nlp_compromise'
import request from 'superagent-bluebird-promise'
import htmlparser from 'htmlparser2'
import tm from 'text-miner'

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
      if (output.length > 9) { console.log(new Set(output)); return new Set(output) }
    }
    // console.log(new Set(output));
    return (new Set(output))

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
    return this.removeStopWords(c.removeInterpunctuation().clean().removeWords(tm.STOPWORDS.EN).documents[0]);
  }

  

/*
 * String method to remove stop words
 * Written by GeekLad http://geeklad.com
 * Stop words obtained from http://www.lextek.com/manuals/onix/stopwords1.html
 *   Usage: string_variable.removeStopWords();
 *   Output: The original String with stop words removed
 */
static removeStopWords(text) {
    var x;
    var y;
    var word;
    var stop_word;
    var regex_str;
    var regex;
    var cleansed_string = text
    var stop_words = ["﻿able","about","above","abroad","according","accordingly","across","actually","adj","after","afterwards","again","against","ago","ahead","ain't","all","allow","allows","almost","alone","along","alongside","already","also","although","always","am","amid","amidst","among","amongst","an","and","another","any","anybody","anyhow","anyone","anything","anyway","anyways","anywhere","apart","appear","appreciate","appropriate","are","aren't","around","as","a's","aside","ask","asking","associated","at","available","away","awfully","back","backward","backwards","be","became","because","become","becomes","becoming","been","before","beforehand","begin","behind","being","believe","below","beside","besides","best","better","between","beyond","both","brief","but","by","came","can","cannot","cant","can't","caption","cause","causes","certain","certainly","changes","clearly","c'mon","co","co.","com","come","comes","concerning","consequently","consider","considering","contain","containing","contains","corresponding","could","couldn't","course","c's","currently","dare","daren't","definitely","described","despite","did","didn't","different","directly","do","does","doesn't","doing","done","don't","down","downwards","during","each","edu","eg","eight","eighty","either","else","elsewhere","end","ending","enough","entirely","especially","et","etc","even","ever","evermore","every","everybody","everyone","everything","everywhere","ex","exactly","example","except","fairly","far","farther","few","fewer","fifth","first","five","followed","following","follows","for","forever","former","formerly","forth","forward","found","four","from","further","furthermore","get","gets","getting","given","gives","go","goes","going","gone","got","gotten","greetings","had","hadn't","half","happens","hardly","has","hasn't","have","haven't","having","he","he'd","he'll","hello","help","hence","her","here","hereafter","hereby","herein","here's","hereupon","hers","herself","he's","hi","him","himself","his","hither","hopefully","how","howbeit","however","hundred","i'd","ie","if","ignored","i'll","i'm","immediate","in","inasmuch","inc","inc.","indeed","indicate","indicated","indicates","inner","inside","insofar","instead","into","inward","is","isn't","it","it'd","it'll","its","it's","itself","i've","just","k","keep","keeps","kept","know","known","knows","last","lately","later","latter","latterly","least","less","lest","let","let's","like","liked","likely","likewise","little","look","looking","looks","low","lower","ltd","made","mainly","make","makes","many","may","maybe","mayn't","me","mean","meantime","meanwhile","merely","might","mightn't","mine","minus","miss","more","moreover","most","mostly","mr","mrs","much","must","mustn't","my","myself","name","namely","nd","near","nearly","necessary","need","needn't","needs","neither","never","neverf","neverless","nevertheless","new","next","nine","ninety","no","nobody","non","none","nonetheless","noone","no-one","nor","normally","not","nothing","notwithstanding","novel","now","nowhere","obviously","of","off","often","oh","ok","okay","old","on","once","one","ones","one's","only","onto","opposite","or","other","others","otherwise","ought","oughtn't","our","ours","ourselves","out","outside","over","overall","own","particular","particularly","past","per","perhaps","placed","please","plus","possible","presumably","probably","provided","provides","que","quite","qv","rather","rd","re","really","reasonably","recent","recently","regarding","regardless","regards","relatively","respectively","right","round","said","same","saw","say","saying","says","second","secondly","see","seeing","seem","seemed","seeming","seems","seen","self","selves","sensible","sent","serious","seriously","seven","several","shall","shan't","she","she'd","she'll","she's","should","shouldn't","since","six","so","some","somebody","someday","somehow","someone","something","sometime","sometimes","somewhat","somewhere","soon","sorry","specified","specify","specifying","still","sub","such","sup","sure","take","taken","taking","tell","tends","th","than","thank","thanks","thanx","that","that'll","thats","that's","that've","the","their","theirs","them","themselves","then","thence","there","thereafter","thereby","there'd","therefore","therein","there'll","there're","theres","there's","thereupon","there've","these","they","they'd","they'll","they're","they've","thing","things","think","third","thirty","this","thorough","thoroughly","those","though","three","through","throughout","thru","thus","till","to","together","too","took","toward","towards","tried","tries","truly","try","trying","t's","twice","two","un","under","underneath","undoing","unfortunately","unless","unlike","unlikely","until","unto","up","upon","upwards","us","use","used","useful","uses","using","usually","v","value","various","versus","very","via","viz","vs","want","wants","was","wasn't","way","we","we'd","welcome","well","we'll","went","were","we're","weren't","we've","what","whatever","what'll","what's","what've","when","whence","whenever","where","whereafter","whereas","whereby","wherein","where's","whereupon","wherever","whether","which","whichever","while","whilst","whither","who","who'd","whoever","whole","who'll","whom","whomever","who's","whose","why","will","willing","wish","with","within","without","wonder","won't","would","wouldn't","yes","yet","you","you'd","you'll","your","you're","yours","yourself","yourselves","you've","zero","﻿a","how's","i","ours ","when's","why's","a","able","b","c","d","e","f","g","h","j","l","m","n","o","p","q","r","s","t","u","uucp","w","x","y","z","zero","﻿I","www","amoungst","amount","bill","bottom","call","computer","con","couldnt","cry","de","describe","detail","due","eleven","empty","fifteen","fify","fill","find","fire","forty","front","full","give","hasnt","herse”","himse”","interest","itse”","mill","move","myse”","part","put","show","side","sincere","sixty","system","ten","thick","thin","top","twelve","twenty","abst","accordance","act","added","adopted","affected","affecting","affects","ah","announce","anymore","apparently","approximately","aren","arent","arise","auth","beginning","beginnings","begins","biol","briefly","ca","date","ed","effect","et-al","ff","fix","gave","giving","hed","heres","hes","hid","home","id","im","immediately","importance","important","index","information","invention","itd","keys","kg","km","largely","lets","line","'ll","means","mg","million","ml","mug","na","nay","necessarily","nos","noted","obtain","obtained","omitted","ord","owing","page","pages","poorly","possibly","potentially","pp","predominantly","present","previously","primarily","promptly","proud","quickly","ran","readily","ref","refs","related","research","resulted","resulting","results","run","sec","section","shed","shes","showed","shown","showns","shows","significant","significantly","similar","similarly","slightly","somethan","specifically","state","states","stop","strongly","substantially","successfully","sufficiently","suggest","thered","thereof","therere","thereto","theyd","theyre","thou","thoughh","thousand","throug","til","tip","ts","ups","usefully","usefulness","'ve","vol","vols","wed","whats","wheres","whim","whod","whos","widely","words","world","youd","youre"]
         
    // Split out all the individual words in the phrase
    var words = cleansed_string.match(/[^\s]+|\s+[^\s+]$/g)
 
    // Review all the words
    for(x=0; x < words.length; x++) {
        // For each word, check all the stop words
        for(y=0; y < stop_words.length; y++) {
            // Get the current word
            word = words[x].replace(/\s+|[^a-z]+/ig, "");   // Trim the word and remove non-alpha
             
            // Get the stop word
            stop_word = stop_words[y];
             
            // If the word matches the stop word, remove it from the keywords
            if(word.toLowerCase() == stop_word) {
                // Build the regex
                regex_str = "^\\s*"+stop_word+"\\s*$";      // Only word
                regex_str += "|^\\s*"+stop_word+"\\s+";     // First word
                regex_str += "|\\s+"+stop_word+"\\s*$";     // Last word
                regex_str += "|\\s+"+stop_word+"\\s+";      // Word somewhere in the middle
                regex = new RegExp(regex_str, "ig");
             
                // Remove the word from the keywords
                cleansed_string = cleansed_string.replace(regex, " ");
            }
        }
    }
    return cleansed_string.replace(/^\s+|\s+$/g, "");
}

}


