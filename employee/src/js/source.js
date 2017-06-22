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
    function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); // 构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg); // 匹配目标参数
        if (r != null)
            return unescape(r[2]);
        return null; // 返回参数值
    }
    var vm = new Vue({
        el: '#shource',
        data: {
            year: getUrlParam('year'),
            month: getUrlParam('month'),
            type: getUrlParam('type'),
            opcards: [],
            sources: [],
            others: []
        },
        methods: {
            init: function(){
                setTimeout(function(){
                    vm.$root.viewlist(vm.$data.year,vm.$data.month,1);
                    vm.$root.viewlist(vm.$data.year,vm.$data.month,2);
                    vm.$root.viewlist(vm.$data.year,vm.$data.month,3);
                },10)
            }(),
            viewlist: function(year,month,type){
                $.ajax({
                    type: 'post',
                    data: {year:year,month:month,type:type},
                    dataType: 'json',
                    url: '../fatburn/EmployeesPathAction!performanceInfo.zk',
                    success: function(data){
                        if(data.rows.length>0){
                            if(type==1){
                                $('#nulls1').hide();
                                $.each(data.rows, function(index, item){                                    
                                    vm.$data.opcards.push({createDate:item.createDate, salerName:item.salerName, Name:item.Name, realPay:item.realPay})
                                })
                            }
                            if(type==2){
                                $('#nulls2').hide();
                                $.each(data.rows, function(index, item){                                    
                                    vm.$data.sources.push({createDate:item.createDate, salerName:item.salerName, Name:item.courseName, realPay:item.realPay})
                                })
                            }
                            if(type==3){
                                $('#nulls3').hide();
                                $.each(data.rows, function(index, item){                                    
                                    vm.$data.others.push({createDate:item.createDate, salerName:item.salerName, Name:item.Name, realPay:item.realPay})
                                })
                            }
                        }
                    }
                })
            }
        }
    })
})