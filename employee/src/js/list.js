$(document).ready(function(){ 
function connectWebViewJavascriptBridge(callback) {
    if (window.WebViewJavascriptBridge) {
        callback(WebViewJavascriptBridge);
    } else {
        document.addEventListener('WebViewJavascriptBridgeReady', function() {
            callback(WebViewJavascriptBridge);
        }, false);
    }
}
connectWebViewJavascriptBridge(function(bridge) {
    // 初始化
    bridge.init(function(message, responseCallback) {
        var data = {
            'Javascript Responds': 'backBefore'
        };
        responseCallback(data);
    });
    // oc调用js方法
    bridge.registerHandler('zkBackEvent',function(data, responseCallback) {
        history.go(-1);
        var responseData = 'success';
        responseCallback(responseData);
    }); 
    bridge.registerHandler('readyBack',function(data, responseCallback) {
        readyBack();
        var responseData = {
            'Javascript Says': 'readBack!'
        };
        responseCallback(responseData);
    });    

});
     // 获取url中的参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); // 构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg); // 匹配目标参数
    if (r != null)
        return unescape(r[2]);
    return null; // 返回参数值
}
var vm = new Vue({
    el: '#once',
    data:{
        todos:[]        
    },
    methods:{
        view:function(){
            $.ajax({
                type: 'post',
                data: {userId:getUrlParam('id')},
                dataType: 'json',
                url:'../fatburn/employees/GymMemberAction!courseRecord.zk',
                beforeSend: function(){
                    $('#nullsd').text('数据加载中').show();
                },
                success: function(data){
                    if(data.groupCourseTableUsers){
                        $('#nullsd').hide();
                        if(data.groupCourseTableUsers.length<=0){
                            $('#nullsd').text('没有数据').show();
                        }
                        $.each(data.groupCourseTableUsers,function(index,item){
                            vm.$data.todos.push({
                                courseMore:item.courseMore,
                                courseName:item.courseName.length>=7?item.courseName.substring(0,6)+"...":item.courseName,
                                date:item.date,
                                time:item.time
                            })
                        })
                    }                  
                }
            })
        }()
    }
})
})