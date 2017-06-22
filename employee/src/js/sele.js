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
function ztime(time,type){
    var times = new Date(Number(time));
    var year = times.getFullYear();
    var month = times.getMonth()+1;
    var day = times.getDate();
    var hour = times.getHours();
    var minu = times.getMinutes();
    if(type==1){        
        return year+"/"+month+"/"+day;
    }else{
        return year+"/"+month+"/"+day+" "+hour+":"+minu;
    }
}
var vm = new Vue({
    el: '#once',
    data:{
        todos:[],
        courses: []
    },
    methods:{
        init: function(){
            setTimeout(function(){
                vm.$root.view('course');
                vm.$root.view('card');
            },10)
        }(),
        view:function(type){
            $.ajax({
                type: 'post',
                data: {userId:getUrlParam('id'),type:type},
                dataType: 'json',
                url:'../fatburn/employees/GymMemberAction!getPayInfo.zk',
                success: function(data){
                    if(data.orders){
                        
                        if(type=="card"){
                            if(data.orders.length>0){
                                $.each(data.orders, function(index, item){                     
                                    vm.$data.todos.push({cardName: item.cardName,time: ztime(item.gmtStart,1)+"~"+ztime(item.gmtEnd,1),totleTime:item.totleTime,useTime:item.useTime,gmtModify:ztime(item.gmtModify),useTime:item.useTime,cardType:item.cardType})
                                })
                            }else{
                                $('#nullsd').text('暂无数据').show();
                            }
                        }else{
                            if(data.orders.length>0){
                                $.each(data.orders, function(index, item){
                                    vm.$data.courses.push({courseName: item.courseName,courseType:item.courseType==0?"小组课":"私教课",time: ztime(item.gmtStart,1)+"~"+ztime(item.gmtEnd,1),courseTotalCount:item.courseTotalCount,courseUseCount:item.courseTotalCount-item.courseUseCount,gmtModify:ztime(item.gmtModify)})
                                })
                            }else{
                                $('#nullwqe').text('暂无数据').show();
                            }
                        }
                       
                    }                              
                }
            })
        }
    }
})
})