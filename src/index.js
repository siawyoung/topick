import Utils from './utils'
import startProcess from './methods'
import Config from './config'

export default class Topick {

  static getKeywords(uri,opts) {
    const config = Config(opts)
    return Utils.httpGet(uri)
    .then((res) => {
      return startProcess(res.text,config)
    })
    .catch(() => {
      return startProcess(uri,config)
    })
  }

  static getKeywordsSync(uri,opts) {
    const config = Config(opts)
    return startProcess(Utils.httpGetSync(uri),config)
  }

  static getDomain(uri) {
    return Utils.getDomainString(uri)
  }

}