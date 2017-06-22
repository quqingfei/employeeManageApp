function goChat(data) {
    if (!window.WebViewJavascriptBridge) {
        return false;
    }
    window.WebViewJavascriptBridge.callHandler('toChat', data,
        function(responseData) {
            deviceData = responseData;
        });
        return deviceData;
}
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
$(document).ready(function(){   
if(getUrlParam('id')==4){
    $(".ygt a").eq(3).trigger('click');
}
var index = 1;
var typeChoose = "";   
var chooseType = "";   
var vm = new Vue({
    el: '#mysource',
    data: {
        todos: [],
        users: [],
        toyear: new Date().getFullYear(),
        tomonth: new Date().getMonth()+1>=10?new Date().getMonth()+1:'0'+(new Date().getMonth()+1),
        cardSumPay: null,
        courseSumPay: null,
        courseCount: null,
        avgMajor: null,
        avgService: null,
        noeMajor: null,
        noeService: null,
        state: "",
        sumTotal: null,
        index:1,
        sie:0,
        is:1,
        layer:0,
        chooseItem:'全部',
        chooseItemCor:'全部',
        chooseItemlink:'全部',
        coach:"资源管理",
        lists:[]
    },
    methods: {
        init: function () {
//                 var sis = setInterval(function(){
//                     sign = getSignData();
//                     sign = 'OKveW0u2NSvwXsjetkD5cWNbZq3VQf66SX7tb9gYu9raGr8M22RSVGRqMYiboiVAo7sb3skSFFAUGvQsAdt0hw==';
// //                    18696014388
//                     if(sign){
                        $('.preloader').fadeOut(200);
//                         clearInterval(sis);
                        setTimeout(function(){ 
//                         vm.$root.teseloae(sign);
                        vm.$root.getDuty();
                        },10);
                    // }
                // },1000);
        }(),
        getToday: function(){
            var today = new Date();
            var year = today.getFullYear();
            var month = today.getMonth()>=10?today.getMonth():"0"+parseInt(today.getMonth()+1);
            var day = today.getDate()>=10?today.getDate():"0"+today.getDate();
            return year+"/"+month+"/"+day;
        },
        teseloae:function(singel){
            // $.ajax({
            //     type: 'post',
            //     data: {sign:encodeURI(singel)},
            //     url: '../fatburn/ScoreAction!checkSign.zk',
            //     dataType: 'json',
            //     success: function(data){
                    if(data.STATUS){
                        vm.$root.viewdetial(vm.$data.toyear,vm.$data.tomonth);
                        vm.$root.viewmysource("",vm.$data.index);
                        vm.$root.viewemplee('','','',1);
                        vm.$root.getResourceList(null,null,null,vm.$data.type);
                        
                    // }
                // }
            // })
        },
        getDuty:function(){
            $.ajax({
                type: 'post',
                url: '../fatburn//employees/GymEmployeesAction!getDuty.zk',
                dataType: 'json',
                success: function(data){
                    if(data.STATUS){
                      if(data.duty == "教练"){
                          vm.$data.coach = '服务管理'
                          $('.fuwu').show()
                      }else{
                          vm.$data.coach = '资源管理'
                          $('.ziyuan').show()
                      }
                    }
                }
            })
        },
        viewmysource: function(state,index){
             switch(state){
                case '':  vm.$data.chooseItemCor = '全部';  
                    break;
                case 2:  vm.$data.chooseItemCor = '已开课';  
                    break;
                case 3:  vm.$data.chooseItemCor = '已完成';  
                    break;
            }
            $.ajax({
                type: 'post',
                data: {state:state,pageSize:30,pageIndex:index},
                url: '../fatburn/EmployeesPathAction!listMyCourse.zk',
                dataType: 'json',
                beforeSend: function(){
                    $('#nulls').text('数据加载中...').show();
                },
                success: function(data){
                    if(data.rows){
                        var row = data.rows;
                        var tod = null;
                        if(data.total<=0){
                            $('#nulls').text('没有数据了').show();
                        }else{
                            $('#nulls').text('查看更多').show();
                        }
                        if(state==vm.$data.state){
                            if(vm.$data.sie==0){
                                vm.$data.sie=1
                            }else{
                                return false;
                            }
                        }else{
                            vm.$data.index=1;
                            vm.$data.state=state;
                            vm.$data.todos=[];
                        }
                        $.each(row, function(index,item){
                           if(tod==item.date){                                      
                            vm.$data.todos.push({id:item.tableId,type:item.type,courseName:item.courseName.length>=12?item.courseName.substr(0,12)+"...":item.courseName,orderCount:item.orderCount,maxCount:item.maxCount,hour:item.hour,courseState:item.courseState}) 
                           }else{
                               tod=item.date;
                               var todays=null;
                               var zhou = new Date(tod).getUTCDay()+1;
                              switch(zhou){
                                  case 1: zhou="周一";break;
                                  case 2: zhou="周二";break;
                                  case 3: zhou="周三";break;
                                  case 4: zhou="周四";break;
                                  case 5: zhou="周五";break;
                                  case 6: zhou="周六";break;
                                  case 7: zhou="周日";break;
                              }
                              if(vm.$root.getToday()==tod){
                                  todays = "今天";
                              } vm.$data.todos.push({id:item.tableId,type:item.type,courseName:item.courseName.length>=12?item.courseName.substr(0,12)+"...":item.courseName,orderCount:item.orderCount,maxCount:item.maxCount,hour:item.hour,date:item.date,zhou:zhou,today:todays,courseState:item.courseState})
                           }                               
                        })
                        
                    }else{
                        console.log('error')
                    }
                },
                complete:function(){
                    
                },
                error: function(err){
                    console.log(err);
                }
            })
        },
        cilckmore: function(){
            vm.$root.viewmysource(vm.$data.state,++vm.$data.index);
        },
        viewemplee: function(type,num,name,is){
            switch(type){
                case '':  vm.$data.chooseItem = '全部';  
                    break;
                case 'hasCard':  vm.$data.chooseItem = '会员';  
                    break;
                case 'hasLike':  vm.$data.chooseItem = '非会员';  
                    break;
                case 'zombie':  vm.$data.chooseItem = '僵尸';  
                    break;    
            }
            vm.$data.state = type;
            $.ajax({
                type: 'post',
                data: {type:type,rows:30,page:is,phone:num,realName:name},
                url:'../fatburn/employees/GymMemberAction!listCustomer.zk',
                dataType: 'json',
                success: function(data){
                    var url = '../file/FileCenter!showImage2.zk?name=';
                        $('.top').removeClass('disa');
                        if(is<=1){                           
                            $('.diy').addClass('disa');
                            vm.$data.layer = 0;
                            vm.$data.is=is;
                        }if(is>=Math.ceil(data.total/30)){
                            $('.diy').next().next().addClass('disa');
                            vm.$data.is = Math.ceil(data.total/30);
                        }
                        vm.$data.users=[];
                        $('.mynulls').hide();
                        var toYear = new Date().getFullYear();
                        $.each(data.rows, function(index,item){
                            var mi = null;
                            if(item.bmi<18.4){
                                mi=1;
                            }else if(item.bmi<=23.9){
                                mi=2;
                            }else{
                                mi=3;
                            }
                            vm.$data.users.push({
                                userId: item.userId,
                                phone: item.phone,
                                nickName: typeof(item.realName)=='undefined'?"-" : item.realName.length>=5?item.realName.substring(0,4)+"...":item.realName,
                                lastSignTime:(new Date().getTime()-item.lastSignTime)>604800000?true:false,
                                birthYear:item.card_name,
                                sex: item.sex,
                                bmi: mi,
                                useTime: item.useTime?item.useTime:0,
                                isMember: item.hasCard,
                                headIcon: url+item.headIcon,
                                signPerWeek:item.signPerWeek
                            })
                        })                        
                    if(data.total<=0){
                        $('.mynulls').show();
                    }
                }
            })
        },
        listcort: function(){
            if($('#morelist .dys').is('.disa')){
                return false;
            }            
            vm.$root.viewemplee(vm.$data.state,null,null,++vm.$data.is);
        },
        listsert:function(){
            if($('#morelist .diy').is('.disa')){
                return false;
            }
            vm.$root.viewemplee(vm.$data.state,null,null,--vm.$data.is==0?1:vm.$data.is);
        },
        viewdetial: function(year,month){
            $.ajax({
                type:'post',
                data: {year:year,month:month},
                url: '../fatburn/EmployeesPathAction!getPerformance.zk',
                dataType: 'json',
                success: function(data){
                    vm.$data.cardSumPay=data.rows.cardSumPay.toFixed(2);//开卡总金额
                    vm.$data.courseCount=data.rows.courseCount;//课程总次数
                    vm.$data.courseSumPay=data.rows.courseSumPay.toFixed(2);//课程总金额
                    vm.$data.sumTotal = (Number(data.rows.courseSumPay)+Number(vm.$data.cardSumPay)).toFixed(2);
                    vm.$data.noeMajor=parseInt(data.rows.avgMajor);
                    vm.$data.avgMajor=data.rows.avgMajor;
                    vm.$data.noeService=parseInt(data.rows.avgService);
                    vm.$data.avgService=data.rows.avgService;
                }
            })
        },
        gochat: function(data){
            console.log(data)
            goChat(data);
        },
        goMessageHtml: function(data){
            $('#mysource').css({'overflow':'hidden','background':'#666'});
            $('.nonse').css({'visibility':'hidden'})
            $('#message').css('height',$(window).height()-60+'px');
            $('#message iframe').attr('src','message.html?id='+data);
            $('#message,.close').fadeIn(200);
            $('.back').hide();
        },
        goback: function(data){
            history.back();
        },
        closeIframe:function(){
            $('.nonse').css({'visibility':'visible','background':'#fff'})
            $('#mysource').css({'overflow':'auto'});
            $('#message,.close').fadeOut(200);
        },
        serchBtn: function(){
            var dres = $('#serchinput').val();
            var reg = /(^0{0,1}1[3|4|5|6|7|8|9][0-9]{9}$)/;
            if(reg.test(dres)){                
                vm.$root.viewemplee(null,dres,null);
            }else{
                vm.$root.viewemplee(null,null,dres);
            }
        },
        linkserchBtn: function(){
            var dres = $('#linkserchinput').val();
            var reg = /(^0{0,1}1[3|4|5|6|7|8|9][0-9]{9}$)/;
            if(reg.test(dres)){                
                vm.$root.getResourceList(null,dres,null,0,1);
            }else{
                vm.$root.getResourceList(dres,null,null,0,1);
            }
        },
        chooseDate: function(){
            $("#city-picker").picker({
              toolbarTemplate: '<header class="bar bar-nav" style="height: 2.8rem;">\
              <button class="button button-link pull-right close-picker" id="#pull-right" style="color:#3fc371;font-size:1.4rem;line-height:2.8rem">确定</button>\
              <h1 class="title" style="font-size:1.4rem;line-height:2.8rem">请选择日期</h1>\
              </header>',
              cols: [
                {
                  textAlign: 'center',
                  values: ['2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019']
                  //如果你希望显示文案和实际值不同，可以在这里加一个displayValues: [.....]
                },
                {
                  textAlign: 'center',
                  values: ['01', '02', '03', '04', '05', '06', '07','08','09','10','11','12']
                }
              ],
              onClose: function(){
                    var v = $("#city-picker").val();
                    vm.$data.toyear = v.split(" ")[0];
                    vm.$data.tomonth = v.split(" ")[1];
                    vm.$root.viewdetial(vm.$data.toyear,vm.$data.tomonth);
                }
            });
        }(),
        goall: function(){
            window.location.href="all.html";
        },
        stringSur: function(str){
            var n = "";
            if(str.lenght>=12){
                n = str.substr(0,12);
            }
            console.log('n='+n)
            return n;
        },
        getResourceList: function(name,phone,status,type,items){
            typeChoose=status;
            chooseType=type;
            console.log(typeChoose);
            switch(type){
                case 0:  vm.$data.chooseItemlink = '全部';  
                    break;
                case 1:  vm.$data.chooseItemlink = '录入';  
                    break;
                case 2:  vm.$data.chooseItemlink = '注册';  
                    break;
                case 3:  vm.$data.chooseItemlink = '购卡';  
                    break;  
                case 4:  vm.$data.chooseItemlink = '过期';  
                    break;     
            }            
            if(index==0){index=1}
            var daas = {pageSize:30,pageIndex:index,name:name,phone:phone,status:status,orderByDesc:'gmtCreate'};
            $.ajax({
                type:'post',
                data:daas,
                url: '../employees/GymCustomerAction!list.zk',
                dataType: 'json',
                success: function(data){
                    $('#mynulled').hide();
                    if(items==1){
                        vm.$data.lists=[];
                    }                        
                    if(data.rows.length<=0){
                        $('#mynulled').show();
                            index--;             
                        return false;
                    }
                    $.each(data.rows,function(index,item){
                        vm.$data.lists.push(item)
                    })      
                }
            }) 
        },
        ajaxData: function(){
            $(document).ready(function() {
              $(window).scroll(function() {
                if ($(document).scrollTop() >= $(document).height() - $(window).height()) {
                    index++;
                    console.log("socrll"+typeChoose);
                    vm.$root.getResourceList(null,null,typeChoose,chooseType);
                }
              });
            }); 
        }(),
        goDetial: function(id,type){
            window.location.href = "http://"+window.location.host+'/fatburn/employee/detial.html?id='+id+'&type='+type;
        }
      
  }
})

})