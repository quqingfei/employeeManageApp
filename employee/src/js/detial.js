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

function setCookie(c_name,value,expiredays)
    {
        var exdate=new Date()
        exdate.setDate(exdate.getDate()+expiredays)
        document.cookie=c_name+ "=" +escape(value)+
        ((expiredays==null) ? "" : "; expires="+exdate.toGMTString())
    }    

var vm = new Vue({
    el: '#once',
    data:{
        name:'',
        sex:'M',
        phone:'',
        huiji:'',
        type:'1',
        level:'1',
        mark:'',
        saleName:'',
        inviteStatus:'',
        gmtSetSale:'',
        gmtInvite:'',
        reservedInfo:'',
        lastCommunicationDate:'',
        lastCommunication:'',
        levelBtn:'',
        id:''
    },
    methods:{
        addSubmit: function(){
            var type = getUrlParam('type');
            var url = null;
            var data = {}
            if(type == 'sell'){
                url = '../employees/GymCustomerAction!getById.zk';
                data.id = getUrlParam('id')
                $.ajax({
                    type: 'post',
                    dataType: 'json',
                    data:data,
                    url:url,
                    success: function(data){
                       if(data.STATUS){
                           if(data.ERROR=="No Login!"){
                               alert('未登录');
                               return false;
                           } 
                           $('.gendu').show();
                           var data = data.gymCustomer;
                           vm.$data.name = data.name;
                           setCookie('username',data.name,1);
                           setCookie('custormId',data.id,1);
                           setCookie('duty','huiji',1);
                           vm.$data.sex = data.sex=='F'?"女":"男";
                           vm.$data.phone = data.phone;
                           vm.$data.saleName = data.saleName;
                           vm.$data.inviteStatus = data.inviteStatus==1?"电话来访":"到店来访";
                           vm.$data.level = vm.$root.levelType(data.level);
                           vm.$data.levelBtn = data.level;
                           vm.$data.gmtSetSale = data.gmtSetSale;
                           vm.$data.gmtInvite = data.gmtInvite;
                           vm.$data.reservedInfo = data.reservedInfo==""?"无":data.reservedInfo;
                           vm.$data.lastCommunicationDate = data.lastCommunicationDate;
                           vm.$data.lastCommunication = data.lastCommunication;
                           vm.$data.id = data.id;                       
                       }else{
                           alert('添加失败');
                       }
                    }
                })
            }
            if(type == 'coach'){
                url = '../fatburn/employees/GymMemberAction!getUserById.zk'
                data.userId = getUrlParam('id')
                $.ajax({
                    type: 'post',
                    dataType: 'json',
                    data:data,
                    url:url,
                    success: function(data){
                       if(data.STATUS){
                           if(data.ERROR=="No Login!"){
                               alert('未登录');
                               return false;
                           }   
                           $('.gendu').hide();
                           vm.$data.name = data.memberName;
                           setCookie('username',data.memberName,1);
                           setCookie('custormId',data.userId,1);
                           setCookie('duty','coach',1);
                           vm.$data.sex = data.sex=='F'?"女":"男";
                           vm.$data.phone = data.phone;
//                           vm.$data.saleName = data.saleName;
//                           vm.$data.inviteStatus = data.inviteStatus==1?"电话来访":"到店来访";
//                           vm.$data.level = vm.$root.levelType(data.level);
//                           vm.$data.levelBtn = data.level;
//                           vm.$data.gmtSetSale = data.gmtSetSale;
//                           vm.$data.gmtInvite = data.gmtInvite;
//                           vm.$data.reservedInfo = data.reservedInfo==""?"无":data.reservedInfo;
//                           vm.$data.lastCommunicationDate = data.lastCommunicationDate;
//                           vm.$data.lastCommunication = data.lastCommunication;
                           vm.$data.id = data.userId;                       
                       }else{
                           alert('添加失败');
                       }
                    }
                })
            }
        }(),
        levelType:function(val){
            if(val == 1)
                return "一级客户";
            if(val == 2)
                return "二级客户";
            if(val == 3)
                return "三级客户";
            if(val == 4)
                return "四级客户";
        }
    }
})
})