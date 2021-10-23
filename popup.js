// ================================ global variables
const filter_key = "filter_key"
filter_line_id_prefix = "filter_line_"
id_start = 1
// ================================ global variables



// ================================  util
class cache {}

cache.result = null

cache.prepare = function (key) {
    chrome.storage.sync.get(key, function (val) {
        cache.set_data(val, key)
    })
}

cache.get = function () {
    let resp = cache.result
    cache.result = null
    return resp
}

cache.set_data = function (val, key) {
    cache.result = val[key]
}

cache.set = function (key, val) {
    var item = {}
    item[key] = val
    chrome.storage.sync.set(item, function () {})
}

class localcache {}

localcache.get = function (key) {
    return JSON.parse(localStorage.getItem(key))
}

localcache.set = function (key, val) {
    localStorage.setItem(key, JSON.stringify(val))
    console.log(`set suc. key=${key} val=${localStorage.getItem(key)}`)
}

function get_id() {
    id_start += 1
    return filter_line_id_prefix + id_start
}
// ================================  util




// =================================  event_controller; 
// 初始化 filter_lines dom
init_filter_lines()
init_triggers()

function init_filter_lines() {
    filter_lines = document.getElementById("filter_lines")
    filter_list = get_filters()
    if (filter_list.length > 0) {
        let last_id = filter_list[filter_list.length - 1].id
        cur_last_id = String(last_id).split(filter_line_id_prefix)[1]
        if (cur_last_id) {
            id_start = Number()
            console.log(`get last id ${get_id()}`)
        }
    }
    for (let i = 0; i < filter_list.length; i++) {
        const ele = filter_list[i];
        append_filter_line_dom(null, ele['active'], ele['val'], get_id())
    }
    add_btn_append_filter_line_trigger()
}


function add_btn_append_filter_line_trigger() {
    text_filter_element = document.getElementById('add_filter')
    text_filter_element.addEventListener('click', append_filter_line_dom)
}

// init all events
function init_triggers() {
    // 每次append 都要为所有的 delete btn 绑定上删除事件
    common_add_element_event_trigger("delete-filter", callback_btn_remove_ele, false, 'click')
    // 为 input text 绑定 onblur 事件
    common_add_element_event_trigger("filter-text-input", callback_input_on_blur, true, "onblur")
    common_add_element_event_trigger("select-box", callback_checkbox_checked, false, "click")
}

// common event creator
function common_add_element_event_trigger(klass_name, callback, is_attr, event_type) {
    console.log(`start add ${event_type} event for ${klass_name}`)
    elements = document.getElementsByClassName(klass_name)
    for (let i = 0; i < elements.length; i++) {
        let element = elements[i]
        if (element.getAttribute("added")) {
            continue
        }
        // element.removeEventListener('click', remove_ele(delete_btn))
        // TODO 为什么我点击一次会触发 len(list) - idx - 1 次 remove_ele 事件; 因为每次new 出来的 function 都不是同一个，所以删除失败
        if (is_attr) {
            element[event_type] = callback(element)
        } else {
            element.addEventListener(event_type, callback(element))
        }
        element.setAttribute('added', "true")
    }
}

// add a filter text line dom
function append_filter_line_dom(event, checked, text, id) {
    filter_lines = document.getElementById('filter_lines')
    line = document.createElement('div')
    line.id = id ? id : get_id()
    line.className = "flexd"
    line.innerHTML =
        `
        <input class="select-box" type="checkbox">
        <input class="filter-text-input" type="text">
        <div class="circle delete-filter" style="background-color: red;">
            <div class="circle-text">×</div>
        </div>
    `
    line.children[0].checked = checked != null ? checked : true
    line.children[1].value = text ? text : ""
    filter_lines.appendChild(line)
    init_triggers()
}

// callback 命名规则 callback+object+event
// callback function: onblur event trigger by filter text input
function callback_input_on_blur(element) {
    return function () {
        // get select box active status
        let select_box = element.parentElement.children[0]
        update_filter_line(element.value, select_box.checked, element.parentElement.id)
    }
}

// callback function: remove element
function callback_btn_remove_ele(ele) {
    return function () {
        // TODO 删除 cache 中对应的数据
        delete_filter_line(ele.parentElement.id)
        ele.parentNode.remove()
    }
}

// callback function: update select status
function callback_checkbox_checked(ele) {
    return function () {
        // 首先如果同一 filter_line 中的 input 中为空，那么忽略
        let val = String(ele.parentElement.children[1].value).trim()
        let checked = ele.checked
        if (String(ele.parentElement.children[1].value).trim() == "") {
            console.log("nil value, ignore")
            return
        }
        update_filter_line(val, checked, ele.parentElement.id)
    }
}
// =================================  event_controller






// ================================  filter_line_manager

// { 'filter_key': [{active: true, val: 'csdn'}, {}]}
// write filter word to chrome sync storage
function update_filter_line(kw, is_active, id) {
    let filter_data = localcache.get(filter_key)
    if (filter_data == null) filter_data = []
    let idx = check_filter_line_exist(filter_data, id)
    // 已存在，则update
    if (idx != -1) {
        filter_data[idx]['active'] = is_active
        filter_data[idx]['val'] = kw
        localcache.set(filter_key, filter_data)
        console.log(`${kw} already exists, update`)
        return true
    }
    filter_data.push({
        "active": is_active,
        "val": kw,
        "id": id
    })
    localcache.set(filter_key, filter_data)
    return true
}

// remove a filter line
function delete_filter_line(id) {
    let filter_data = localcache.get(filter_key)
    let idx = check_filter_line_exist(filter_data, id)
    if (idx == -1) {
        console.log(`id ${id} do not exist`)
        return
    }
    filter_data.pop(idx)
    localcache.set(filter_key, filter_data)
}

// get filter list
function get_filters() {
    let filter_data = localcache.get(filter_key)
    if (filter_data == null) return []
    return filter_data
}

// check a filter if already exist
function check_filter_line_exist(list, id) {
    for (let i = 0; i < list.length; i++) {
        let item = list[i]
        if (String(item.id) === String(id)) {
            return i;
        }
    }
    return -1
}
// ================================  filter_line_manager