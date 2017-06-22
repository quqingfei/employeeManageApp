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
        history.back();
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
function getDate(time){
    var date = new Date(time);
    var year = date.getFullYear(),
        month = date.getMonth()+1,
        day = date.getDate();
    return year+"-"+month+"-"+day;
}
 
var vm = new Vue({
    el: '#complete',
    data: {
        courseName: '',
        courseImage: '',
        date: '',
        courseType: '',
        orderCount: '',
        courseState: '',
        type:getUrlParam('type'),
        todos: []
    },
    methods: {
        init: function () {
            setTimeout(function(){                
                vm.$root.view();
            },10);
        }(),
        view: function(){
            $.ajax({
                type: 'post',
                data: {tableId:getUrlParam('id')},
                url: '../fatburn/EmployeesPathAction!getEndCourse.zk',
                dataType: 'json',
                success: function(data){
                    var url = '../file/FileCenter!showImage2.zk?name=';
                    if(data.rows){
                        if(data.rows.courseInfo.length<=0){$('#complete').hide();$('#nulls').text('本课程没有信息').show();}
                        else if(data.rows.studentInfo.length<=0){$('#nulls').text('无数据').show();}
                        var des = data.rows.courseInfo[0];
                        vm.$data.courseName = des.courseName;
                        vm.$data.courseState = des.courseState;
                        vm.$data.courseImage = url+des.courseImage;
                        vm.$data.date = des.date;
                        vm.$data.courseType = des.courseType==0?"小团体课":"私教课";
                        vm.$data.orderCount = des.orderCount;
                        $.each(data.rows.studentInfo, function(index,item){                            vm.$data.todos.push({imageurl:url+item.studentIcon,name:item.studentName,age:item.studentAge,member:item.isMembers,restCount:item.restCount,sex:item.studentSex,creattime:getDate(item.createTime)})
                        })
                    }else{
                        console.log('error')
                    }
                },
                error: function(err){
                    console.log(err);
                }
            })
        },
        toAllHtml: function(){
            window.location.href = 'all.html?id='+getUrlParam('id');
        },
        postcourse: function(){
            $.ajax({
                type: 'post',
                data: {tableId:getUrlParam('id')},
                url: '../fatburn/employees/GymGroupCourseAction!finish.zk',
                dataType: 'json',
                success: function(res){
                    if(res.STATUS){
                        window.location.reload();                    
                    }else{
                        alert(res.INFO)
                    }
                }
            })
        }
  }
})
})