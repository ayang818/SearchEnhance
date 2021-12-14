// Backgound.js 相当于是扩展的灵魂，可以理解为这里是最核心的部分。你应该在这里注册一系列监听函数，来对用户的操作做相应的处理。同时如果你要发请求到自己的服务器，这里也是合适的位置之一，因为在 content.js 里面的话，会有跨域的限制

// https://www.baidu.com/s?ie=UTF-8&wd=js%20string%20contains
const BAIDU = "baidu-se"
const GOOGLE = "google-se"
const UNKNOWN = 0

class EhcEvent {
    enhance_search_filter = null
}

var engine = UNKNOWN
var ehcEvent = new EhcEvent()

function initBaiduFunc(ehcEvent) {
    engine = BAIDU
    // 返回一个 kw=123 形式的字符串
    ehcEvent.enhance_search_filter = enhanceBaiduSearchFilter
}

function initGoogleFunc(ehcEvent) {
    engine = GOOGLE
    // 返回一个 kw=123 形式的字符串
    ehcEvent.enhance_search_filter = enhanceGoogleSearchFilter
}

function isBlocked(id) {
    let active_data = JSON.parse(localStorage.getItem("se_active_status"))
    if (!active_data) return true
    se_data = active_data[id]
    if (se_data != null) {
        // 如果选择了，就不阻塞
        return !se_data["checked"]
    }
    console.error(`Fatal: checked your id name`)
    return true
}

function enhanceBaiduSearchFilter(key, val) {
    if (key != "wd") return 
    return getSearchFilter(key, val)
}

function enhanceGoogleSearchFilter(key, val) {
    if (key != "q") return
    return getSearchFilter(key, val)
}

function getSearchFilter(key, val) {
    let result = key + "=" + val
    let filter_lines = JSON.parse(localStorage.getItem("filter_key"))
    if (!filter_lines) return result
    for (let i = 0; i < filter_lines.length; i++) {
        let filter_line = filter_lines[i]
        if (String(val).indexOf(String(filter_line.val)) != -1) continue
        if (filter_line.active) {
            result += ("%20-" + filter_line.val)
        }
    }
    return result ? result : ""
}

chrome.webRequest.onBeforeRequest.addListener(
    function (details) {
        // 当前页面的url
        let pageUrl = details.url;
        let newPageUrl = ""
        let params = String(pageUrl).split("?")
        newPageUrl += (params[0] + "?")
        if (!params || params.length <= 1) {
            return
        }
        // 如果在某个搜索引擎上可用，就初始化事件组
        if (params[0].indexOf("baidu") != -1) {
            if (isBlocked(BAIDU)) {
                return 
            }
            // 根据域名判断在哪个搜索引擎
            initBaiduFunc(ehcEvent)
            console.log('init Baidu event list')
        } else if (params[0].indexOf("google") != -1) {
            if (isBlocked(GOOGLE)) {
                return
            }
            initGoogleFunc(ehcEvent)
            console.log('init Google event list')
        }
        let shouldRedirect = true
        method_get_params = String(params[1]).split("&")
        for (let idx = 0; idx < method_get_params.length; idx += 1) {
            let pair = String(method_get_params[idx])
            if (String(pair).trim() === '') continue
            let underIdx = String(pair).indexOf("=")
            if (underIdx === -1) {
                return
            }
            // 只取第一个 =
            let key = pair.slice(0, underIdx)
            let val = pair.slice(underIdx + 1, pair.length)
            let newPair = ehcEvent.enhance_search_filter(key, val)
            if (newPair) {
                if (newPair === pair) shouldRedirect = false
                newPageUrl += (newPair + "&")
            } else {
                // 如果没有命中规则或和之前一样，原样拼回去
                newPageUrl += (pair + "&")
            }
        }
        console.log("new url=",newPageUrl)
        if (!shouldRedirect) {
            // 不进行无限重定向
            console.log('reject infinite redirect')
            return 
        }
        // redirect 的时候又会来一次
        return {
            redirectUrl: newPageUrl
        }
    }, {
        urls: ["*://www.baidu.com/s?*", "*://www.google.com/search?*"]
    }, //监听页面请求,你也可以通过*来匹配。
    ["blocking"]
)
