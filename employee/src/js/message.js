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
         return "http://"+window.location.host+'/fatburn/bodyExam/employeePhoneRecord.html?id='+url;
    }
     
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
        view:function(){
            $.ajax({
                type: 'post',
                data: {userId:getUrlParam('id')},
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
                    vm.$data.mark= res.mark;
                    vm.$data.userId=res.userId;
                    vm.$data.body=mi;
                    vm.$data.bodyExamId=data.bodyExamId?geturl(data.bodyExamId):"";
                }
            })
        }(),
        animatleftmake: function(){
            $('.posleft').css("left",0);
        },        
        call: function(data){
            window.parent.callPhone(data);
        },
       /* gomaker: function(){
            window.location.href = "mark.html?id="+vm.$data.userId+"&mark="+vm.$data.mark
        },*/
        submitmark: function(){
//            if($('.miaoshu').val().length>18){
//                alert('备注不得超过18个字符！');
//                return false;
//            }else{            
                $.ajax({
                    type: 'post',
                    data: {userId:getUrlParam('id'),remark:$('.miaoshu').val()},
                    url: '../fatburn/employees/GymMemberAction!remark.zk',
                    dataType: 'json',
                    success: function(data){
                        if(data.STATUS){
                           vm.$data.mark=$('.miaoshu').val();
                           $('.posleft').css("left",'100%');
                        }else{
                            alert(data.INFO);
                        }
                    }
                })
//            }
        },
        showHeadImg:function(){
            $('.box').css("display", "table-cell").show();
        },
        hideHeadImg:function(){
            $('.box').css("display", "none").hide();
        }
    }
})
})