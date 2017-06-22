$(document).ready(function(){
function getSignData(){
        if (!window.WebViewJavascriptBridge) {
            return false;
        }
        window.WebViewJavascriptBridge.callHandler('getSign', {},
            function(responseData) {
                deviceData = responseData;
            });
            return deviceData;
}   
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
        month = date.getMonth()+1>10?date.getMonth()+1:'0'+(date.getMonth()+1),
        day = date.getDate()>10?date.getDate():'0'+date.getDate();
    return year+"-"+month+"-"+day;
}    
var vm = new Vue({
    el: '#complete',
    data: {
        total: 0,
        url: '../file/FileCenter!showImage2.zk?name=',
        todos: []
    },
    methods: {
        init: function () {
            var sis = setInterval(function(){
                    sign = getSignData();
                    // sign = 'OKveW0u2NSvwXsjetkD5caoGvbnscQBpxNUgJ20yy5R5mtzlbhlkvB3OYL5SPq+MNU13TU5Hppy2Wc1UDIHo9Q==';
//                    18696014388
                    if(sign){
                        clearInterval(sis);
                        setTimeout(function(){
                        vm.$root.teseloae(sign);
                            vm.$root.view();
                        },10);
                    }
                },1000);
        }(),
        view: function(){
            $.ajax({
                type: 'post',
                data: {tableId:getUrlParam('id')},
                url: '../fatburn/EmployeesPathAction!getCourseEvaluate.zk',
                dataType: 'json',
                success: function(data){
                    var url = '../file/FileCenter!showImage2.zk?name=';
                    if(data.rows.length>0){
                        vm.$data.total = data.total;
                        $.each(data.rows, function(index,item){                            
                           vm.$data.todos.push({
                               userName:item.userName,
                               userIcon:url+item.userIcon,
                               userSex:item.userSex,
                               commentTime:getDate(item.commentTime),
                               member:item.isMembers,
                               majorEvaluate:item.majorEvaluate?parseInt(item.majorEvaluate):0,
                               evaluate:item.majorEvaluate?item.majorEvaluate.toFixed(0):0,
                               serviceEvaluate:item.serviceEvaluate?parseInt(item.serviceEvaluate):0,
                               serevaer:item.serviceEvaluate?item.serviceEvaluate.toFixed(0):0,
                               userComment:item.userComment,
                               anonymous:item.anonymous,
                               images:item.images?eval('(' + item.images + ')'):null
                           })
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
        teseloae:function(singel){
            $.ajax({
                type: 'post',
                data: {sign:encodeURI(singel)},
                url: '../fatburn/ScoreAction!checkSign.zk',
                dataType: 'json',
                success: function(data){
                    if(data.STATUS){
                        vm.$root.viewdetial(vm.$data.toyear,vm.$data.tomonth);
                        vm.$root.viewmysource("",vm.$data.index);
                        vm.$root.viewemplee('','','',1);
                        vm.$root.getResourceList(null,null,null,vm.$data.type);
                        
                    }
                }
            })
        },
        bigImg: function(url){
            $('#bigimg img').attr('src',url);
            $('.bigimg img').load(function(){
                $(this).css('marginTop',($(window).height()-$(this).height())/2+"px");
            })
            $('#bigimg').fadeIn(200);
        },
        colseImg: function(){
            $('#bigimg').fadeOut(200);
        }
  }
})
})