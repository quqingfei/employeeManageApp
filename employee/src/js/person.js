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
        userName: '',
        userIcon: '',
        date: '',
        courseType: '',
        orderCount: '',
        lastDate: '',
        totalCount: '',
        useCount: '',
        bmi: null,
        courseState: '',
        todos: [],
        type: getUrlParam('type')
    },
    methods: {
        init: function () {
            setTimeout(function(){                
                vm.$root.view();
            },10)
        }(),
        view: function(){
            $.ajax({
                type: 'post',
                data: {tableId:getUrlParam('id')},
                url: '../fatburn/EmployeesPathAction!getEndPrivateCourse.zk',
                dataType: 'json',
                success: function(data){
                    var url = '../file/FileCenter!showImage2.zk?name=';
                    if(data.rows){
                        if(data.rows.data1.length<=0){$('#complete').hide();$('#nulls').text('本课程没有信息').show();return false;}
                        else if(data.rows.data1.length<=0){$('#nulls').text('无数据').show();}
                        var des = data.rows.data1[0];
                        var des2 = data.rows.data2[0];
                        var mi = null;
                            if(des.userBmi<18.4){
                                mi=1;
                            }else if(des.userBmi<=23.9){
                                mi=2;
                            }else{
                                mi=3;
                            }
                        vm.$data.userName = des.userName;
                        vm.$data.courseState = des.courseState;
                        vm.$data.bmi = mi;
                        vm.$data.userIcon = url+des.userIcon;
                        vm.$data.date = des.date+" "+des.hour;
                        vm.$data.courseType = des.courseType==0?"小团体课":"私教课";
                        vm.$data.orderCount = des.orderCount;
                        vm.$data.lastDate = des2.lastDate;
                        vm.$data.totalCount = des2.totalCount;
                        vm.$data.useCount = des2.useCount;
                        
                    }else{
                        console.log('error');
                    }
                },
                error: function(err){
                    console.log(err);
                }
            })
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
        },
        toAllHtml: function(){
            window.location.href = 'all.html?id='+getUrlParam('id');
        }
        
  }
})
})