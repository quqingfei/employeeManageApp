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
        inviteStatus:'1',
        record:'',
        id:'',
        saleId:'',
        customerId:'',
        coaname:'会籍顾问'
    },
    ready: function(){
        this.getData();
        this.ajaxData();
    },
    methods:{
        update: function(id){
            var url = null;
            if(getCookie('duty')=="coach"){
                url = '../employees/UserGymRecordAction!update.zk'
            }else{
                url = '../employees/GymCustomerRecordAction!update.zk'
            }
            var self = this;
            var data = {status:vm.$data.status,
                        record:vm.$data.record,
                        inviteStatus:vm.$data.inviteStatus,
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
                url:url,
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
            $('#mynulled').hide();
            $('.uplink').show();
            $('.uplink').animate({'left':0},100);
            if(typeof(data.saleName)=='undefined'){
                vm.$data.coaname='教练名称';
                vm.$data.saleName = data.coachName;
            }else{
                vm.$data.coaname='会籍顾问';
                vm.$data.saleName = data.saleName;
            }0
           
            vm.$data.gmtCreate = data.gmtCreate;
            vm.$data.status = data.status;
            vm.$data.inviteStatus = data.inviteStatus;
            vm.$data.record = data.record;
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
            var url = null;
            if(getCookie('duty')=="coach"){
                url = '../employees/UserGymRecordAction!delete.zk'
            }else{
                url = '../employees/GymCustomerRecordAction!delete.zk'
            }
            $.ajax({
                type: 'post',
                dataType: 'json',
                data:{id:id},  
                url:url,
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
            var url = null;
            if(getCookie('duty')=="coach"){
                url = '../employees/UserGymRecordAction!list.zk'
            }else{
                url = '../employees/GymCustomerRecordAction!list.zk'
            }
            $.ajax({
                type: 'post',
                dataType: 'json',
                data:{pageSize:30,pageIndex:index,customerId:getUrlParam('id')},  
                url:url,
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