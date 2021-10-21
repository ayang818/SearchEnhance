add_append_event()
var i = "10"
function add_append_event() {
    text_filter_element = document.getElementById('add_filter')
    text_filter_element.addEventListener('click', function () {
        filter_lines = document.getElementById('filter_lines')
        line = document.createElement('div')
        line.className = "flexd"
        i += "1"
        line.innerHTML = 
        `
            <input class="select-box" type="checkbox">
            <input type="text">
            <div class="circle delete-filter" style="background-color: red;" id="${i}">
                <div class="circle-text">×</div>
            </div>
        `
        filter_lines.appendChild(line)
        // 每次append 都要为所有的 delete btn 绑定上删除事件
        add_delete_event_for_btn()
    })
}

add_delete_event_for_btn()
function add_delete_event_for_btn() {
    console.log("start add delete event")
    // 获取所有删除的btn
    delete_filter_element = document.getElementsByClassName('delete-filter')
    for (var i = 0; i < delete_filter_element.length; i++) {
        var delete_btn = delete_filter_element[i]
        delete_btn.removeEventListener('click', remove_ele(delete_btn))
        // TODO 为什么我点击一次会触发 len(list) - idx - 1 次 remove_ele 事件
        delete_btn.addEventListener('click', remove_ele(delete_btn))
    }
}

function remove_ele(delete_btn) {
    return function(e) {
        console.log(e)
        console.log(delete_btn.parentNode)
        delete_btn.parentNode.remove()
    } 
}