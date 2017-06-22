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
var index = 1;     
var vm = new Vue({
    el: '#mysource',
    data:{
        todos:[],
        saleName:'',
        gmtCreate:'',
        status:'',
        invteStatus:'1',
        remark:'',
        id:'',
        saleId:'',
        customerId:''
    },
    ready: function(){
        this.getData();
        this.ajaxData();
    },
    methods:{
        update: function(id){
            var self = this;
            var dof = $('#datetime-picker').val()+":00";
            var date = new Date();
            var year = date.getFullYear();
            var month = date.getMonth()+1;
            var daed = date.getDate();
            var hour = date.getHours();
            var minute = date.getMinutes();
            var months = month>=10?month:'0'+month;
            var daeda =  daed>=10?daed:'0'+daed;
            var hours =  hour>=10?hour:'0'+hour;
            var minutes =  minute>=10?minute:'0'+minute;
            var dn = year+'/'+months+'/'+daeda+" "+hours+':'+'00:00';
            var ss = new Date(dn).getTime();
            var dd = new Date(dof).getTime();
            if(dd-ss<=0){
                alert('选择的时间必须大于当前时间！');
                return false;
            }
            var data = {status:vm.$data.status,
                        remark:vm.$data.remark,
                        invteStatus:vm.$data.invteStatus,
                        saleId:vm.$data.saleId,
                        saleName:vm.$data.saleName,
                        date:$('#datetime-picker').val()+":00",
                        customerId:vm.$data.customerId,
                        id:id
                       }
            $.ajax({
                type: 'post',
                dataType: 'json',
                data:data,
                url:'../employees/GymCustomerInvitationAction!update.zk',
                success: function(data){
                   if(data.STATUS){                       
                       if(data.ERROR=="No Login!"){
                           alert('未登录');
                           return false;
                       } 
                        self.todos = [];
                        self.getData();
                       $('.del').trigger('click');                              
                   }else{
                       alert('添加失败');
                   }
                }
            })
        },
        sub: function(data){
            $('.eed').hide();
            $('.mynulled').hide();
            $('.uplink').show();
            $('.uplink').animate({'left':0},100);
            vm.$data.saleName = data.saleName;
            vm.$data.gmtCreate = data.gmtCreate;
            vm.$data.status = data.status;
            vm.$data.invteStatus = data.invteStatus;
            vm.$data.remark = data.remark;
            vm.$data.id = data.id;
            vm.$data.saleId = data.saleId;
            vm.$data.customerId = data.customerId;
            var date = new Date(data.gmtCreate);
            var month = date.getMonth()+1;
            var year = date.getFullYear();
            var daed = date.getDate();
            var hour = date.getHours();
            var minute = date.getMinutes();
            
            var montha = month>=10?month:'0'+month;
            var daeda =  daed>=10?daed:'0'+daed;
            var hours =  hour>=10?hour:'0'+hour;
            var minutes =  minute>=10?minute:'0'+minute;
            $("#datetime-picker").datetimePicker({
              value: [year,montha ,daeda , hours, minutes],
              maxDate: date.getFullYear()+':'+montha+':'+daeda
            });
        },
        dellink: function(id){
            $.ajax({
                type: 'post',
                dataType: 'json',
                data:{id:id},  
                url:'../employees/GymCustomerInvitationAction!delete.zk',
                success: function(data){
                   if(data.STATUS){
                       if(data.ERROR=="No Login!"){
                           alert('未登录');
                           return false;
                       }
                       $('.del').trigger('click');
                       $('#dioelist .pinl').each(function(index,item){
                           if($(this).attr('delid')==id){
                               $(this).remove();
                           }
                       });
                       if($('#dioelist .pinl').length<=0){
                           $('#mynulled').show();
                       }
                   }else{
                           alert(data.INFO);
                   }
                }
            }) 
        },
        getData: function(){
            $.ajax({
                type: 'post',
                dataType: 'json',
                data:{pageSize:30,pageIndex:index,customerId:getUrlParam('id')},  
                url:'../employees/GymCustomerInvitationAction!list.zk',
                success: function(data){
                   if(data.STATUS){
                       if(data.ERROR=="No Login!"){
                           alert('未登录');
                           return false;
                       }                           
                       var data = data.rows;
                       if(data.length > 0){
                           $.each(data,function(index,item){
                               item.name = getCookie('username');
                               vm.$data.todos.push(item);
                           })
                       }else{
                           index--;
                           $('#mynulled').show();
                       }
                   }else{
                           alert(data.INFO);
                   }
                }
            })  
        },
        ajaxData: function(){
            $(document).ready(function() {
              $(window).scroll(function() {
                if ($(document).scrollTop() >= $(document).height() - $(window).height()) {
                    index++;
                    vm.$root.getData();
                }
              });
            }); 
        }
    }
})
})