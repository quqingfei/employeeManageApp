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
        userAvatar:'',
        nickName:'',
        phone: '',
        memberName: '',
        saleName: '',
        sex:'',
        weight:'',
        height:'',
        body:'',
        userId:'',
        examId: '',
        cards:[],
        userCourses:[]
    },
    methods:{
        view:function(){
            $.ajax({
                type: 'post',
                data: {userId:getUrlParam('userId').trim(),gymId:getUrlParam('gymId')},
                dataType: 'json',
                url:'../fatburn/employees/GymMemberAction!getUserById.zk',
                success: function(data){
                    var res = data;
                    var toYear = new Date().getFullYear();
                    var url = '../file/FileCenter!showImage2.zk?name=';
                    var mi = null;                        
                    vm.$data.birthYear=toYear-res.birthYear;
                    vm.$data.bmi=parseFloat(res.weight/((res.height/100)*(res.height/100))).toFixed(2);
                    vm.$data.weight=parseFloat(res.weight).toFixed(1);
                    vm.$data.height=parseFloat(res.height).toFixed(0)+"cm";
                    vm.$data.headIcon=url+res.memberPhoto;
                    vm.$data.hasCard=res.hasCard;
                    vm.$data.nickName=res.userName;
                    vm.$data.saleName=res.saleName;
                    vm.$data.phone=res.phone;
                    vm.$data.memberName=res.memberName;
                    vm.$data.sex=res.sex;
                    vm.$data.mark=res.mark;
                    vm.$data.userId=res.userId;
                    vm.$data.cards = res.cards?res.cards:"";
                    vm.$data.examId=data.examId?geturl(data.examId):"";
                    if(vm.$data.bmi<18.4){
                        mi='增肌';
                    }else if(vm.$data.bmi<=23.9){
                        mi='维持';
                    }else{
                        mi='减脂';
                    }
                    vm.$data.body=mi;
                   /* if(res.userCourse){
                        $.each(res.userCourse, function(index,item){
                            new Date(item.gmt_create)
                        })
                    }*/
                    vm.$data.userCourses = res.userCourse?res.userCourse:"";
                }
            })
        }(),
        bigimg: function(){
            $('.zhezhao img').css('marginTop',window.innerHeight/2-($('.zhezhao img').height()/2)+"px")
            $('.zhezhao').css("right",0);
        },
        small: function(){
            $('.zhezhao').css("right","100%");
        }
    }
})
})