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
        if (delete_btn.getAttribute("added")) {
            continue
        }
        delete_btn.removeEventListener('click', remove_ele(delete_btn))
        // TODO 为什么我点击一次会触发 len(list) - idx - 1 次 remove_ele 事件; 因为每次new 出来的 function 都不是同一个，所以删除失败
        delete_btn.addEventListener('click', remove_ele(delete_btn))
        delete_btn.setAttribute('added', "true")
    }
}

function remove_ele(delete_btn) {
    return function(e) {
        delete_btn.parentNode.remove()
    } 
}


// 这里的级联删除其实是闭包的坑，循环中的闭包，最终传进去的是循环的最后一个值
// A 1 2 3
// B 2 3
// C 3
// add_delete_event_for_btn()
// function add_delete_event_for_btn() {
//     console.log("start add delete event")
//     // 获取所有删除的btn
//     delete_filter_element = document.getElementsByClassName('delete-filter')
//     for (var i = 0; i < delete_filter_element.length; i++) {
//         var delete_btn = delete_filter_element[i]
//         var func = function(e) {
//             console.log(e)
//             console.log(delete_btn.parentNode)
//             // 这里的 delete_btn 其实是列表最后一个值了
//             delete_btn.parentNode.remove()
//         }
//         delete_btn.removeEventListener('click', func)
//         // TODO 为什么我点击一次会触发 len(list) - idx - 1 次 remove_ele 事件; 控制台用 getEventListner 获取这个 dom 上绑定的事件，发现 remove 没有生效
//         delete_btn.addEventListener('click', func)
//     }
// }