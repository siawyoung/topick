import DefaultConfig from './default_config'

export default function Config(opts) {
  
  return Object.assign(DefaultConfig, opts || {})

}