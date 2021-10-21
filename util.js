function input_on_blur(value) {
    console.log('loss focus event trigger')
    
}


class cache {
}

cache.result = null

cache.prepare = function (key) {
    chrome.storage.sync.get(key, _set_ref(key))
    return this
}

cache.get = function () {
    let resp = result
    result = null
    return resp
}

cache._set_ref = function (key) {
    return function(res) {
        result = res[key]
    }
}

cache.set = function (key, val) {
    var item = {}
    item[key] = val
    chrome.storage.sync.set(item, function() {})
}
