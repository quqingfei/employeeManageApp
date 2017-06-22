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
        name:'',
        sex:'M',
        phone:'',
        elevl:'1',
        type:'1',
        mark:'',
        id:'',
        url:''
    },
    ready: function(){
        if(getUrlParam('id')==null){
            this.id="";
            console.log(this.id)
        }else{
              $.ajax({
                type: 'post',
                dataType: 'json',
                data:{id:getUrlParam('id')},
                url:'../employees/GymCustomerAction!getById.zk',
                success: function(data){
                   if(data.STATUS){
                       if(data.ERROR=="No Login!"){
                           alert('未登录');
                           return false;
                       }                           
                       var data = data.gymCustomer;
                       vm.$data.name = data.name;
                       vm.$data.sex = data.sex;
                       vm.$data.phone = data.phone;
                       vm.$data.type = data.inviteStatus;
                       vm.$data.elevl = data.level;
                       vm.$data.mark = data.reservedInfo;
                       vm.$data.id = data.id;
                   }else{
                           alert("获取用户信息失败，请重新打开！");
                   }
                }
            })  
        }
    },
    methods:{
        addSubmit: function(){
            var reg = /^1[3|4|5|7|8][0-9]{9}$/
            if(vm.$data.name==""){
                alert('请输入姓名！');
                return false;
            }
            if(vm.$data.sex==""){
                alert('请选择性别！');
                return false;
            }
            if(vm.$data.phone==""){
                alert('请填写手机号码！');
                return false;
            }
            if(vm.$data.phone!=""){
                if(!reg.test(vm.$data.phone)){
                    alert('手机号码输入有误！');
                    return false;
                }
            }
            console.log(vm.$data.name+','+vm.$data.sex+','+vm.$data.phone+','+vm.$data.elevl+','+vm.$data.type+','+vm.$data.mark)
            var data = {name:vm.$data.name,
                       phone:vm.$data.phone,
                        sex:vm.$data.sex,
                        level:vm.$data.elevl,
                        inviteStatus: vm.$data.type,
                        reservedInfo:vm.$data.mark
                       }
                if(getUrlParam('id')==null){
                    vm.$data.url = '../employees/GymCustomerAction!add.zk';
                }else{
                    vm.$data.url = '../employees/GymCustomerAction!update.zk';
                    data.id = getUrlParam('id');
                }
            $.ajax({
                type: 'post',
                dataType: 'json',
                data:data,
                url:vm.$data.url,
                success: function(data){
                   if(data.STATUS){
                       if(data.ERROR=="No Login!"){
                           alert('未登录');
                           return false;
                       } 
                       if(getUrlParam('id')==null){
                            window.location.href = geturl('4');
                        }else{
                            history.go(-1)
                        }
                       
                   }else{
                       alert('添加失败');
                   }
                }
            })
        }
    }
})
})