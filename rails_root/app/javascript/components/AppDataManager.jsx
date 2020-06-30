// @flow
//import assert from 'assert'
import queryString from 'query-string'
import Cookies from 'js-cookie'
import $ from 'jquery'

type Config = {
  isLocal: boolean,
  localBaseRequestUrl: string,
  remoteBaseRequestUrl: string,
}

function handleErrors(response) {
  if (!response.ok) {
    return response.json()
      .catch(() => {
        const error = new Error(response.statusText);
        (error: any).response = response
        throw error
      }).then((json) => {
        const error = new Error(json.message || json.status);
        (error: any).response = response;
        (error: any).status = json.status;
        (error: any).json = json
        throw error
      })
  }
  return response
}

function prepareJson(response) {
  return response.json()
    .then(json => {
      if (json.status !== 'ok') {
        const error = new Error(json.message || json.status);
        (error: any).response = response;
        (error: any).status = json.status;
        (error: any).json = json
        throw error
      }
      return json
    })
}

export default class AppDataManager {
  static _instance: Object
  _config: Object

  static get instance() {
    if (this._instance == null) {
      this._instance = new AppDataManager()
    }
    return this._instance
  }

  static api(...args) {
    return this.instance.api(...args)
  }
  static abortableApi(...args) {
    return this.instance.abortableApi(...args)
  }

  get config(): Config { return this._config }
  set config(value: Config) {
    if (this._config !== value) {
      this._config = value
    }
    return this._config
  }

  appBaseRequestURL() {
    if (this.config.isLocal) {
      return this.config.localBaseRequestUrl
    } else {
      return this.config.remoteBaseRequestUrl
    }
  }

  api(path: string, {method = 'GET', parameters}: {method: string, parameters?: { [string]: any }} = {}) {
    return this._api(path, {method, parameters})
  }

  abortableApi(path: string, {method = 'GET', parameters}: {method: string, parameters?: { [string]: any }} = {}) {
    return this._api(path, {method, parameters, abortable: true})
  }

  _api(path: string, {method = 'GET', parameters, abortable}: {method: string, parameters?: { [string]: any }, abortable?: boolean} = {}) {
    let jqxhr
    const ready = new Promise((resolve, reject) => {
      const token = parameters && parameters.token

      let headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      }
      if (token) {
        headers = {
          ...headers,
          'Authorization' : `Token ${token}`,
        }
      }
      if (!(method === 'GET' || method === 'HEAD')) {
				const csrfToken = document.querySelector('[name=csrf-token]').content
        headers = {
          ...headers,
          'X-CSRF-Token' : csrfToken,
        }
      }

      let params = { ...parameters }
      delete params.token

      const requestURL = this.appBaseRequestURL() + '/api/v1' + path

      const queryInsteadOfBody = method === 'GET' || method === 'HEAD'
      let queryPart
      let body
      if (queryInsteadOfBody) {
        queryPart = `?${queryString.stringify(params)}`
        body = undefined
      } else {
        queryPart = ''
        body = JSON.stringify(params)
      }

      if (abortable) {
        jqxhr = $.ajax({
          url: requestURL + queryPart,
          type: method,
          contentType: 'application/json',
          dataType: 'json',
          headers,
          data: body,
          success: (data, textStatus) => {
            console.log(data, textStatus)
            const json = data
            if (json.status !== 'ok') {
              const error = new Error(json.message || json.status)
              ;(error: any).jqxhr = jqxhr
              ;(error: any).status = json.status
              ;(error: any).json = json

              reject(error)
              return
            }
            resolve(data)
          },
          error: (xhr, textStatus, errorThrown) => {
            console.log('error: ', xhr.responseJSON, textStatus)
            const json = xhr.responseJSON

            if (!json) {
              const error = new Error(textStatus)
              ;(error: any).jqxhr = jqxhr
              reject(error)
              return
            }

            const error = new Error(json.message || json.status)
            ;(error: any).jqxhr = jqxhr
            ;(error: any).status = json.status
            ;(error: any).json = json

            reject(error)
          },
        })
      }
      else {
        fetch(requestURL + queryPart, {
          credentials: 'same-origin',
          method,
          headers: headers,
          body: body,
        })
          .then(handleErrors)
          .then(prepareJson)
          .then(responseJson => resolve(responseJson))
          .catch(reject)
      }
    })

    if (abortable) {
      return {
        abort: () => {jqxhr.abort()},
        ready: ready,
      }
    }
    return ready
  }
}

AppDataManager.instance.config = {
  isLocal: false,
  localBaseRequestUrl: 'http://localhost:3000',
  remoteBaseRequestUrl: '',
}
