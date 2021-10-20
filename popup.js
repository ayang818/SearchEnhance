add_append_event()
function add_append_event() {
    text_filter_element = document.getElementById('add_filter')
    text_filter_element.addEventListener('click', function () {
        filter_lines = document.getElementById('filter_lines')
        new_filter_line = document.createElement('div')
        // append 出一行 filter
        new_filter_line.innerHTML = `<div class="flexd">
                    <input class="select-box" type="checkbox">
                    <input type="text">
                    <div class="circle delete-filter" style="background-color: red;">
                        <div class="circle-text">×</div>
                    </div>
                </div>`
        filter_lines.appendChild(new_filter_line)
        // 每次append 都要为所有的 delete btn 绑定上删除事件
        add_delete_event()
    })
}

add_delete_event()
function add_delete_event() {
    // 获取所有删除的btn
    delete_filter_element = document.getElementsByClassName('delete-filter')
    for (var i = 0; i < delete_filter_element.length; i++) {
        var delete_btn = delete_filter_element[i]
        delete_btn.addEventListener('click', function() {
            var parNode = delete_btn.parentNode;
            // 删除一行 filter 记录
            parNode.remove()
        })
    }
}