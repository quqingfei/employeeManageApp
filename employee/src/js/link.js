$(document).ready(function(){ 
   
     // 获取url中的参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); // 构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg); // 匹配目标参数
    if (r != null)
        return unescape(r[2]);
    return null; // 返回参数值
}
    function geturl(url){
         return "http://"+window.location.host+'/fatburn/employee/index.html?id='+url;
    }
     
var vm = new Vue({
    el: '#once',
    data:{
        id:getUrlParam('id')
    },
    methods:{
        addSubmit: function(){
            var today = $('#datetime-picker').val()+":00";
            var todayTime = new Date(today).getTime();
            var date = new Date();
            var month = date.getMonth()+1;
            var year = date.getFullYear();
            var daed = date.getDate();
            var hour = date.getHours();
            var minute = date.getMinutes();
            var montha = month>=10?month:'0'+month;
            var daeda =  daed>=10?daed:'0'+daed;
            var hours =  hour>=10?hour:'0'+hour;
            var minutes =  minute>=10?minute:'0'+minute;
            var ss = year+'-'+montha+'-'+daeda+" "+hours+":"+minutes+":00"
            var nowTime = new Date(ss).getTime();
            if(nowTime-todayTime<0){
                alert('时间只能选择小于或等于现在的日期！');
                return false;
            }
            var data = {
                        date:today,
                        status:$('#statuslink').val(),
                        inviteStatus:$('#fanglink').val(),
                        record:$('#recordlink').val(),
                        customerId:getUrlParam('id')
                       }
            var url = null;
            if(getCookie('duty')=='coach'){
                url = '../employees/UserGymRecordAction!add.zk'
            }else{
                url = '../employees/GymCustomerRecordAction!add.zk'
            }
            $.ajax({
                type: 'post',
                dataType: 'json',
                data:data,
                url:url,
                success: function(data){
                   if(data.STATUS){
                       alert('添加成功');
                       $('#statuslink').val(0);
                       $('#fanglink').val(1);
                       $('#recordlink').val("");
                        $("#datetime-picker").datetimePicker({
                          value: [year,montha ,daeda , hours, minutes]
                        });
                   }else{
                       alert('添加失败');
                   }
                }
            })
        },
        addSubmitRecord: function(){
            var today = $('#datetimd-picker').val()+":00";
            var todayTime = new Date(today).getTime();
            var date = new Date();
            var month = date.getMonth()+1;
            var year = date.getFullYear();
            var daed = date.getDate();
            var hour = date.getHours();
            var minute = date.getMinutes();
            var montha = month>=10?month:'0'+month;
            var daeda =  daed>=10?daed:'0'+daed;
            var hours =  hour>=10?hour:'0'+hour;
            var minutes =  minute>=10?minute:'0'+minute;
            var ss = year+'-'+montha+'-'+daeda+" "+hours+":"+minutes+":00"
            var nowTime = new Date(ss).getTime();
            if(nowTime-todayTime>0){
                alert('时间只能选择大于于或等于现在的日期！');
                return false;
            }
            var data = {
                        date:today,
                        remark:$('#recordtext').val(),
                        customerId:getUrlParam('id')
                       }
            $.ajax({
                type: 'post',
                dataType: 'json',
                data:data,
                url:'../employees/UserGymInvitationAction!add.zk',
                success: function(data){
                   if(data.STATUS){
                       if(data.ERROR=="No Login!"){
                           alert('未登录');
                           return false;
                       }
                       alert('添加成功');
                       $('#recordtext').val("");
                        $("#datetimd-picker").datetimePicker({
                          value: [year,montha ,daeda , hours, minutes]
                        });
                   }else{
                       alert(data.INFO);
                   }
                }
            })
        }
    }
})
})