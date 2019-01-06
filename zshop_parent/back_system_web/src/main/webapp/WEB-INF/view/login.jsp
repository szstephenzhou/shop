<%--
  Created by IntelliJ IDEA.
  User: Administrator
  Date: 2019/1/6 0006
  Time: 下午 6:18
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>

<!DOCTYPE html>
<html>
<head>
    <script>
        if (window.top !== window.self) {
            window.top.location = window.location;
        }
    </script>
    <meta name="viewport" content="width=device-width"/>
    <title>欢迎使用互联网停车场管理平台企业版 - 登录</title>
    <meta name="keywords" content="欢迎使用互联网停车场管理平台企业版">
    <meta name="description" content="领先行业的互联网云停车系统">
    <link rel="shortcut icon" href="favicon.ico">
    <link href="${pageContext.request.contextPath}/css/bootstrap.min14ed.css?v=3.3.6" rel="stylesheet">
    <link href="${pageContext.request.contextPath}/css/font-awesome.min93e3.css?v=4.4.0" rel="stylesheet">
    <link href="${pageContext.request.contextPath}/css/animate.min.css" rel="stylesheet">
    <link href="${pageContext.request.contextPath}/css/style.min862f.css?v=4.1.0" rel="stylesheet">
    <link href="${pageContext.request.contextPath}/css/plugins/iCheck/custom.css" rel="stylesheet">
    <style>
        body {background: url(${pageContext.request.contextPath}/css/patterns/bg.png) no-repeat;background-size: 100% 100%;background-position-y: 0px; }
        .gray-bg { background-color: #02c17e; }
        .logo-name { color: #fff; }
        .form-control, .single-line { border: 1px solid #5db1a0; }
        .tabs-container .nav-tabs { border-bottom: none; }
        .tabs-container .nav-tabs > li {width: 50%;margin-bottom: 0px; }
        .tabs-container .nav-tabs > li > a {margin-right: 0px;border-radius: 0px;color: #555;background: rgba(255, 255, 255, 0.4); }
        .tabs-container .nav-tabs > li.active > a, .tabs-container .nav-tabs > li.active > a:focus, .tabs-container .nav-tabs > li.active > a:hover { background-color: rgba(255, 255, 255, 1); }
        .tabs-container .nav-tabs > li > a:hover { background-color: rgba(255, 255, 255, 0.3); }
        .tabs-container .panel-body {border-radius: 0px;background: rgba(255, 255, 255, 1); }
        .sk-spinner-three-bounce div {width: 9px;height: 9px;margin-left: 5px;background-color: #fff; }
        .sk-spinner-three-bounce.sk-spinner { width: 60px; }
        #liPlatform a { border-top-left-radius: 3px; }
        #liBiz a { border-top-right-radius: 3px; }
        .tabs-container .panel-body {border-bottom-right-radius: 3px;border-bottom-left-radius: 3px; }
    </style>
</head>
<body class="gray-bg">
<div class="middle-box text-center loginscreen  animated fadeInDown">
    <div>
        <div>
            <img src="${pageContext.request.contextPath}/css/patterns/logo.png" alt="互联网停车场管理平台企业版" style="height: 90px; margin-top: 100px;"/>
        </div>
        <h3 style="color: #fff; margin-top: 20px;">欢迎使用互联网停车场管理平台企业版</h3>
        <form id="LoginForm" class="m-t" role="form" action="${pageContext.request.contextPath}/Home/Index">

            <div class="tabs-container">
                <ul class="nav nav-tabs">
                    <li id="liPlatform" class="active">
                        <a data-toggle="tab" aria-expanded="true">平 台</a>
                    </li>
                    <li id="liBiz" class="">
                        <a data-toggle="tab" aria-expanded="false">商 户</a>
                    </li>
                </ul>
                <div class="tab-content">
                    <div class="tab-pane active">
                        <div class="panel-body">
                            <div class="form-group">
                                <input type="text" id="Account" class="form-control" placeholder="用户名" required>
                            </div>
                            <div class="form-group">
                                <input type="password" id="Pwd" class="form-control" placeholder="密码" required>
                            </div>
                            <div>
                                <button type="submit" id="submit" data-loading-text="<div style='text-align:center; margin:0 auto;'><div style='display:inline-block;width:45px;'>登录中</div><div class='sk-spinner sk-spinner-three-bounce' style='display:inline-block;width:45px;'><div class='sk-bounce1'></div><div class='sk-bounce2'></div><div class='sk-bounce3'></div></div></div>" class="btn btn-w-m btn-primary pull-right">登&nbsp;&nbsp;录</button>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </div>
</div>
<script src="${pageContext.request.contextPath}/js/jquery.min.js?v=2.1.4"></script>
<script src="${pageContext.request.contextPath}/js/bootstrap.min.js?v=3.3.6"></script>
<script src="${pageContext.request.contextPath}/scripts/jquery.md5.js"></script>
<script src="${pageContext.request.contextPath}/js/plugins/layer/layer.js"></script>
<script src="${pageContext.request.contextPath}/js/jquery.common.js"></script>
<script src="${pageContext.request.contextPath}/js/plugins/iCheck/icheck.min.js"></script>
<script src="${pageContext.request.contextPath}/js/localData.js"></script>
<script>
    $("#liBiz").click(function() {
        $("#NoWiring").closest("label").hide().prev().attr("class", "btn block btn-primary full-width");
    });

    $("#liPlatform").click(function() {
        $("#NoWiring").closest("label").show().prev().attr("class", "btn btn-w-m btn-primary pull-right");
    });

    $(function() {
        if (localData.get('logintype') == "platform" || localData.get('logintype') == null) {
            $("#liPlatform").addClass("active").next().removeClass("active");
            $("#liPlatform").click();
        } else {
            $("#liPlatform").removeClass("active").next().addClass("active");
            $("#liBiz").click();
        }
        $(".i-checks").iCheck({ checkboxClass: "icheckbox_square-green", radioClass: "iradio_square-green" });
        $('.i-checks').on('ifChecked', function() { $('.i-checks').not(this).iCheck('uncheck'); });
    });

    $('#LoginForm').submit(function() {
        var channel = $("#liPlatform").hasClass("active");
        var account = $("#Account").val().trim();
        var pwd = $("#Pwd").val().trim();
        // if (account.length < 5) {
        //     layer.tips("提示：用户名为5-20位字符", '#Account', { tips: [3] });
        //     return false;
        // }
        // if (pwd.length < 6) {
        //     layer.tips("提示：密码为6-20位字符", '#Pwd', { tips: [3] });
        //     return false;
        // }
       // $('#submit').button('loading');

        location.href='${pageContext.request.contextPath}/Home/login';

        <%--$.post("/Login/Login", { Account: account, Pwd: $.md5(pwd) },--%>
            <%--function(data) {--%>
                <%--if (data.Success) {--%>
                    <%--if (channel) {--%>
                        <%--localData.set('logintype', 'platform');--%>
                        <%--if ($("#NoWiring").is(":checked")) {--%>
                            <%--document.location.href = "${pageContext.request.contextPath}/DevicePark";--%>
                            <%--return;--%>
                        <%--}--%>
                        <%--document.location.href = "${pageContext.request.contextPath}/Index";--%>
                    <%--} else {--%>
                        <%--localData.set('logintype', 'business');--%>
                        <%--document.location.href = "${pageContext.request.contextPath}/BizIndex";--%>
                    <%--}--%>
                    <%--localData.set("Account", account);--%>
                <%--} else {--%>
                    <%--setTimeout(function () {--%>
                        <%--$('#submit').button('reset');--%>
                    <%--}, 500);--%>
                    <%--layer.tips("提示：" + data.Message, '#submit', { tips: [3] });--%>
                <%--}--%>
            <%--}, "json");--%>
        <%--return false; //防止submit按钮自动刷新一次页面--%>
    });
</script>
</body>
</html>

