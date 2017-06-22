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
        var responseData = '';
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
function callPhone(data){
        if (!window.WebViewJavascriptBridge) {
            return false;
        }
        window.WebViewJavascriptBridge.callHandler('callPhone', data,
            function(responseData) {
                deviceData = responseData;
            });
            return deviceData;
}     
     // 获取url中的参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); // 构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg); // 匹配目标参数
    if (r != null)
        return unescape(r[2]);
    return null; // 返回参数值
}
    function geturl(url){
         return "http://"+window.location.host+'/fatburn/bodyExam/phoneRecord.html?id='+url'&order=true;
    }
     $('.miaoshu').on('keyup change',function(){
        var l = $('.miaoshu').val().length;
        if(l>18){
            $('.sere').css('color','red');
            $('.ies').text(l);  
        }else{
            $('.sere').css('color','#ccc');
            $('.ies').text(l);            
        }
    })
var vm = new Vue({
    el: '#once',
    data:{
        birthYear:'',
        bmi:'',
        hasCard:'',
        headIcon:'',
        height:'',
        mark:'',
        nickName:'',
        phone: '',
        realName: '',
        saleName: '',
        sex:'',
        weight:'',
        body:'',
        userId:'',
        bodyExamId: ''
    },
    methods:{
        init: function () {
                var sis = setInterval(function(){
                    sign = getSignData();
//                    sign = 'OKveW0u2NSvwXsjetkD5cVnwsXgaZMnzASz0F5XkO+lLOKypgeJyBzkn5oG1lIbtMYMCsdZp6iqnyOiuYzPsjw==';
                    if(sign){
                        clearInterval(sis);
                        setTimeout(function(){ 
                        vm.$root.teseloae(sign);
                        },10);
                    }
                },1000);
        }(),
        view:function(){
            $.ajax({
                type: 'post',
                data: {userId:getUrlParam('id').trim()},
                dataType: 'json',
                url:'../fatburn/employees/GymMemberAction!listCustomer.zk',
                success: function(data){
                    var res = data.rows[0];
                    var toYear = new Date().getFullYear();
                    var url = '../file/FileCenter!showImage2.zk?name=';
                    var mi = null;
                        if(res.bmi<18.4){
                            mi='增肌';
                        }else if(res.bmi<=23.9){
                            mi='维持';
                        }else{
                            mi='减脂';
                        }
                    vm.$data.birthYear=toYear-res.birthYear;
                    vm.$data.bmi=parseFloat(res.bmi).toFixed(2);
                    vm.$data.weight=parseFloat(res.weight).toFixed(1);
                    vm.$data.headIcon=url+res.headIcon;
                    vm.$data.hasCard=res.hasCard;
                    vm.$data.hasCard=res.hasCard;
                    vm.$data.nickName=res.nickName;
                    vm.$data.saleName=res.saleName;
                    vm.$data.phone=res.phone;
                    vm.$data.realName=res.realName;
                    vm.$data.sex=res.sex;
                    vm.$data.mark=res.mark;
                    vm.$data.userId=res.userId;
                    vm.$data.body=mi;
                    vm.$data.bodyExamId=data.bodyExamId?geturl(data.bodyExamId):"";
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
                        vm.$root.view();
                    }
                }
            })
        },
        call: function(data){
            callPhone(data);
        }
    }
})
})