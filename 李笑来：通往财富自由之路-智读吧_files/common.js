/**
 * Created by Administrator on 2017/3/30 0030.
 */
/*处理时间为可读格式*/
function timeConvert(creatTime) {
    /*var d = new Date(Date.parse(creatTime.replace(/-/g,"/")));*/
    /*var d = new Date(creatTime);*/
    /*判断为时间字符串还是数字时间long值*/
    var d;
    if(!isNaN(creatTime)){
        d=new Date();
        d.setTime(creatTime);
    }else {
        d=getDateForStringDate(creatTime);
    }

    var now = new Date();
    var dateStr = "";

    var month = d.getMonth() + 1;
    var day = d.getDate();
    var hour = d.getHours();
    var minutes = d.getMinutes();
    if (month < 10) {
        month = "0" + month;
    }
    if (day < 10) {
        day = "0" + day;
    }
    if (hour < 10) {
        hour = "0" + hour;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }

    if ((now.getTime() - d.getTime()) < 60 * 60 * 1000) {
        dateStr =  "刚刚";
    }else if((now.getTime() - d.getTime()) < 24 * 60 * 60 * 1000){
        dateStr = d.getHours() + "小时前";
    }else if ((now.getTime() - d.getTime()) < 24 * 60 * 60 * 1000 * 365) {
        dateStr = month + "." + day + " " + hour + ":" + minutes;
    } else {
        dateStr = d.getFullYear() + "." + month + "." + day + " " + hour + ":" + minutes;
    }
    return dateStr;

}
/**
 * 解决 ie，火狐浏览器不兼容new Date(s)
 * @param strDate
 * 返回 date对象
 * add by zyf at 2015年11月5日
 */
function getDateForStringDate(strDate){

    //切割年月日与时分秒称为数组
    var s = strDate.split(" ");
    /*var s1 = s[0].split("-");*/
    var s2 = s[3].split(":");
    if(s2.length==2){
        s2.push("00");
    }
    var m=new Array("Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Spt","Oct","Nov","Dec");
    var month;
    for(var i = 0;i<m.length;i++){
        if(m[i]==s[1]){
            month=i; break;
        }
    }
    var date = new Date(s[5],month,s[2],s2[0],s2[1],s2[2]);
    /*return new Date(s1[0],s1[1]-1,s1[2],s2[0],s2[1],s2[2]);*/
    return date;
}