add_append_event()
function add_append_event() {
    text_filter_element = document.getElementById('add_filter')
    text_filter_element.addEventListener('click', function () {
        filter_lines = document.getElementById('filter_lines')
        line = document.createElement('div')
        line.className = "flexd"
        line.innerHTML = 
        `
            <input class="select-box" type="checkbox">
            <input type="text">
            <div class="circle delete-filter" style="background-color: red;">
                <div class="circle-text">×</div>
            </div>
        `
        filter_lines.appendChild(line)
        // 每次append 都要为所有的 delete btn 绑定上删除事件
        add_delete_event()
    })
}

add_delete_event()
function add_delete_event() {
    console.log("start add delete event")
    // 获取所有删除的btn
    delete_filter_element = document.getElementsByClassName('delete-filter')
    for (var i = 0; i < delete_filter_element.length; i++) {
        var delete_btn = delete_filter_element[i]
        delete_btn.addEventListener('click', function(e) {
            console.log(e)
            console.log(i, delete_btn.parentNode)
            delete_btn.parentNode.remove()
        })
    }
}