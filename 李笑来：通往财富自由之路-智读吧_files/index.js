/**
 * Created by Administrator on 2017/3/20 0020.
 */
window.onload=function() {
    /*
     改变文章发布的时间格式*/
    var articleItems = document.getElementsByName("article-item");
    var ctValues = document.getElementsByName("ctValue");
    var creatTimes = document.getElementsByName("creatTime");
    /*var labelValues = document.getElementsByName("labelValue");*/
    var articleLabels = document.getElementsByClassName("article-label");
    var articleValues = document.getElementsByName("articleValue");
    var articleTexts = document.getElementsByName("articleText");
    for (var i = 0; i < ctValues.length; i++) {

        var creatTime = ctValues[i].value;
        var dateStr = timeConvert(creatTime);

        /*creatTimes[i].lastChild.nodeValue = dateStr;*/
        creatTimes[i].innerHTML=dateStr;
        /**
         * 去掉标签图片
         * @type {Array}
         */
        var arr = new Array();

        $(".labelItemBox:eq("+i+") input[name='labelValue']:hidden").each(function () {
            var str = $(this).val().split(",");
            arr.push(str[0]);
        })
        var strs = arr.join(" · ");
        articleLabels[i].innerHTML=strs;
        /**
         * 截取文章头部介绍部分文字
         */
        /*向字符串对象中追加replaceAll方法*/
        /*String.prototype.replaceAll = function(reallyDo, replaceWith, ignoreCase) {
            if (!RegExp.prototype.isPrototypeOf(reallyDo)) {
                return this.replace(new RegExp(reallyDo, (ignoreCase ? "gi": "g")), replaceWith);
            } else {
                return this.replace(reallyDo, replaceWith);
            }
        }*/
        /*var articleStr = articleValues[i].innerHTML;
        articleStr=articleStr.replaceAll(/<.*?>/ig,"");
        //去掉左右的空白异常
        articleStr=articleStr.replaceAll(/&nbsp;/gi,'');
        articleStr=articleStr.replaceAll(/\ +/g,"");
        articleStr=articleStr.replaceAll(" ","");

        articleTexts[i].innerHTML=articleStr.substr(0,84)+"...";*/
    }

    /*监听文本框介绍宽度与整条栏目宽度一致*/
    var labelnum1;
    var labelnum2;
    if($(document).width()<=550){
        labelnum1=4;
        labelnum2=3
    }else {
        labelnum1=12;
        labelnum2=11;
    }
    /*var width1=$(".left-text").width();
    var width2=$(".article-item").width();
    /!*标签数量参数*!/

    if(width1==width2){
        $(".right-item").addClass("displayNone");
        labelnum1=4;
        labelnum2=3
    }else if(width1!=width2){
        $(".right-item").removeClass("displayNone");
        labelnum1=12;
        labelnum2=11;
    }*/
    //标签列表
    var labels = document.getElementsByName("label");
    var labelList = document.getElementsByName("label-list");
    if(labels.length>=labelnum1){

        for(var i=0;i<labelnum2;i++){
            var labelStrings = labels[i].value.split(",");
            labelList[i].innerHTML="<img name='labelImg' src='"+labelStrings[1]+"'/><span name='labelText'>"+labelStrings[0]+"</span><div class='clear'></div>"
        }
        var html = "<a href=''></a>"
        labelList[labelnum2].innerHTML="更多热门专题 >";
        $(".label-list:eq("+labelnum2+")").addClass("moreLabel");
        for(var i=labelnum1;i<labels.length;i++){
            $(".label-list:eq("+i+")").addClass("displayNone");
        }

    }else {
        for(var i=0;i<labels.length;i++){
            var labelStrings = labels[i].value.split(",");
            labelList[i].innerHTML="<img name='labelImg' src='"+labelStrings[1]+"'/><span name='labelText'>"+labelStrings[0]+"</span><div class='clear'></div>"
        }
    }
    /*标签点击筛选事件*/
    $(".label-list").click(function () {
        $(".label-list").removeClass("displayNone");

        var labelName=$(this).find("span").html();
        if(labelName == null){
            return;
        }
        var labelImg=$(this).find("img").attr("src");
        var labelString = labelName+","+labelImg;
        //显示等待
        $(".labels").showLoading();
        $.ajax({
            type:'POST',
            url:"/findAllByLabel",
            /*dataType:"json",*///预期返回类型
            /*cache:false,*/
            /*contentType:'application/json',*/ //请求数据类型 这句不加出现415错误:Unsupported Media Type
            data:{"labelString":labelString},
            success:function (data) {
                //隐藏等待
                $(".labels").hideLoading();
                $(".article-item").remove();
                $(".article-box hr").remove();
                addArticle(data);
                $(".labels input").remove();
                $(".labels div").remove();
                var html = "<div class='label-list' name='label-list'>"+
                    "<img name='labelImg' src='"+labelImg+"'/><span name='labelText'>"+labelName+"</span><div class='clear'></div>"+
                    "</div>"+
                    "<a href='/'>返回</a>";
                $(html).appendTo(".labels");
            },
            error:function (e1) {
                //隐藏等待
                $(".labels").hideLoading();
                alert(JSON.stringify(e1));
            }});

    });
    /*标签展开事件*/
    $(".moreLabel").click(function () {
        $(".label-list").removeClass("moreLabel");

        var labelLength = labels.length;

        for(var i=labelnum2;i<labels.length;i++){
            var labelStrings = labels[i].value.split(",");
            labelList[i].innerHTML="<img name='labelImg' src='"+labelStrings[1]+"'/><span name='labelText'>"+labelStrings[0]+"</span><div class='clear'></div>";
        }
        $("<div class='label-list lessLabel' name='label-list'>"+"收起 <"+"</div>").appendTo(".labels");
    });
    /*标签收起事件*/
    $(".lessLabel").live('click', function(){

        $(".lessLabel").remove();

        for(var i=labelnum2;i<labels.length;i++){
            labelList[i].innerHTML="";
        }
        labelList[labelnum2].innerHTML="更多热门专题 >";
        $(".label-list:eq("+labelnum2+")").addClass("moreLabel");
        /*去掉多余标签*/
        for(var i=labelnum1;i<labels.length;i++){
            $(".label-list:eq("+i+")").addClass("displayNone");
        }

    });

    /*局部刷新更多文章条目*/
    $(".more").click(function () {
        $(this).html("加载中...")

        var word=$(this).attr("word");

        //显示等待
        $(".moreBox").showLoading();

        var labelLists = document.getElementsByClassName("label-list");
        var labelString;
        if(labelLists.length == 1){
            var labelName=$(".label-list:eq(0)").find("span").html();
            var labelImg=$(".label-list:eq(0)").find("img").attr("src");
            labelString = labelName+","+labelImg;
        }else{
            labelString="";
        }

        var pageNo = $(".article-box").find("input[name=pageNo]").val();
        var pageSize = $(".article-box").find("input[name=pageSize]").val();

        var postJson;
        if (word!=undefined && word.length>0){
            postJson=JSON.stringify({"pageNo":pageNo,"pageSize":pageSize,"labelString":labelString,"word":word});
        }else{
            postJson=JSON.stringify({"pageNo":pageNo,"pageSize":pageSize,"labelString":labelString});
        }

        var data = postJson;
        $.ajax({
            type:'POST',
            url:"/moreArticle",
            dataType:"json",
            cache:false,
            contentType:'application/json', // 这句不加出现415错误:Unsupported Media Type
            data:data,
            success:function (data) {
                $(".more").html("加载更多");
                //隐藏等待
                $(".moreBox").hideLoading();
                if(data!=null){
                    addArticle(data);
                    $(".article-box").find("input[name=pageNo]").val(parseInt(pageNo)+1);
                }
            },
            error:function (e1) {
                $(".more").html("加载更多");
                //隐藏等待
                $(".moreBox").hideLoading();
                alert(JSON.stringify(e1));
            }});
    });

}
/*点击介绍图片跳转*/
$(".article-item .right-item img").click(function () {
    window.open($(this).parent().parent().find(".left-title a").attr("href"),"_blank");
    /*window.location.href = $(this).parent().parent().find(".left-title a").attr("href");*/
});
/*处理返回的文章条目json数据*/
function addArticle(data) {
    var html = "";
    var pageNo = data.pageNo;
    var datas = data.datas;
    var json = eval(datas);
    $.each(json, function (index, item) {
        //循环获取数据
        var id = json[index].id;
        var title = json[index].title;
        var author = json[index].author;
        var authorImage = json[index].authorImage;
        var createTime = json[index].createTime;
        var introductionImage = json[index].introductionImage;
        var labels = json[index].labels;
        var views = json[index].views;
        var messages = json[index].messages;

        var likeNum = json[index].likeNum;
        var introduction=json[index].introduction;
        if(introduction==undefined){
            introduction="";
        }
        /*var articleText = json[index].articleText;*/
        /*var audio = json[index].audio;*/
        var labelStrings = "";
        for(var i = 0;i<labels.length;i++){
            var arr = labels[i].split(",");
            if(i!=0){
                labelStrings=labelStrings+" · "+arr[0];
                continue;
            }
            labelStrings=labelStrings+arr[0];
        }

        var timeStr = timeConvert(createTime);
        html = "<div class='article-item' name='article-item'>" +
            "<div class='left-item'>" +
            "<div class='left-top'>" +
            "<img class='authFace' src="+authorImage+" width='36' height='36'/>" +
            "<span class='authName'>"+author+"</span>" +
            "<span name='creatTime' class='creatTime'>"+timeStr+"</span>" +
            "<div class='clear'></div>"+
            "</div>" +
            "<div class='left-title'>" +
            "<a  target='_blank' href='/article/"+id+"'>"+title+"</a>" +
            "</div>" +
            "<div class='left-text'>" +
            "<span name='articleText'>"+introduction+"</span>" +
            "</div>" +
            "<div class='article-status'>"+
            "<div class='article-label'>"+labelStrings+"</div>" +
            "<div class='records'>"+
            "<div class='article-view'><img src='/static/img/view.png'/>&nbsp;&nbsp;"+views+"</div>"+
            "<div class='article-view'><img src='/static/img/message.png'/>&nbsp;&nbsp;"+messages+"</div>"+
            "<div class='article-view'><img src='/static/img/likeNum.png'/>&nbsp;&nbsp;"+likeNum+"</div>"+
            "</div>"+
            "</div>"+
            "</div>"+
            "<div class='right-item' name='right-item'>"+
            "<img src=\""+introductionImage+"\"  />"+
            "</div>" +
            "<div class='clear'></div>" +
            "</div>" +
            "<hr color='#dcdcdd'/>";

        $(html).appendTo(".article-box");
        /*给新增的对象赋予jQuery函数*/
        $(".article-item .right-item img").click(function () {
            window.open($(this).parent().parent().find(".left-title a").attr("href"),"_blank");
        });
    });
}

window.onscroll=function(){
    var top=window.pageYOffset||document.documentElement.scrollTop||document.body.scrollTop;
    var node=document.getElementById('topbar');
    if(top>20){//20就是滚动条滚动到的位置，大于20才显示
        $("#topbar").css({"filter":"alpha(opacity=90)",
        "-moz-opacity":"0.9",
        "-khtml-opacity":"0.9",
        "opacity":"0.9"});
    }else{
        $("#topbar").css({"filter":"alpha(opacity=100)",
            "-moz-opacity":"1",
            "-khtml-opacity":"1",
            "opacity":"1"});
    }
}



