/**
 * Created by Administrator on 2017/3/23 0023.
 */
$(document).ready(function () {
    var logos = document.getElementsByClassName("logo");
    logos[0].addEventListener('click',function(e){
        window.location.href = "/";
    });
    logos[0].style.cursor = "pointer";
})
$(".download").click(function () {
    window.open("http://zhidujia.com","_blank");
})