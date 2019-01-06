<%--
  Created by IntelliJ IDEA.
  User: Administrator
  Date: 2019/1/6 0006
  Time: 下午 7:14
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<!DOCTYPE html>
<!DOCTYPE html>

<html>
<head>
    <meta name="viewport" content="width=device-width" />
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="renderer" content="webkit">
    <meta http-equiv="Cache-Control" content="no-siteapp" />
    <title>智慧停车互联网平台 - 主页</title>
    <meta name="keywords" content="">
    <meta name="description" content="">
    <link rel="shortcut icon" href="favicon.ico">
    <link href="${pageContext.request.contextPath}/js/plugins/layui/css/layui.css" rel="stylesheet" />
    <link href="${pageContext.request.contextPath}/css/bootstrap.min14ed.css?v=3.3.6" rel="stylesheet">
    <link href="${pageContext.request.contextPath}/css/font-awesome.min93e3.css?v=4.4.0" rel="stylesheet">
    <link href="${pageContext.request.contextPath}/css/animate.min.css" rel="stylesheet">
    <link href="${pageContext.request.contextPath}/css/style.min862f.css?v=4.1.0" rel="stylesheet">
    <link href="${pageContext.request.contextPath}/css/myApp.css" rel="stylesheet" />
    <script src="${pageContext.request.contextPath}/js/skin.1201.js"></script>
    <style>
        /*对菜单的隐藏处理*/
        .loadingMenu {
            margin-top: 15px;
            margin-bottom: 10px;
        }

        .menu-role {
            display: none !important;
        }

        .menu-role li {
            display: none;
        }

        .show {
            display: block !important;
        }

        .hide {
            display: none !important;
        }

        a.skin {
            float: right;
            height: 30px;
            line-height: 30px;
            width: 30px;
            text-align: center;
            padding: 0px;
        }

        a.skin i {
            font-size: 25px;
            width: 30px;
            height: 30px;
            float: left;
            color: #fff;
        }

        .navbar-header {
            width: 100%;
        }

        .content-tabs {
            border-bottom-color: #d4d4d4 !important;
        }

        .page-tabs a.active {
            background-color: #d4d4d4;
            color: #888;
        }

        .page-tabs a.active i:hover, .page-tabs a.active:hover {
            background-color: #d4d4d4;
            color: #888;
        }

        .page-tabs a.active i {
            color: #888 !important;
        }

        .navbar-header .btn-primary {
            background-color: rgba(0,0,0,0) !important;
            border: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 50px;
            height: 50px;
            line-height: 50px;
            border-radius: 0 !important;
        }

        .form-group i.fa-search {
            height: 50px;
            line-height: 50px;
            padding: 0 10px;
            float: left;
        }

        .form-group input.form-control {
            width: 80%;
            float: left;
            padding: 0 !important;
        }

        /*v3.5.3 */
        .navbar-header .btn-primary {
            width: 30px;
            height: 30px;
            line-height: 30px;
        }

        .navbar-form-custom {
            height: 30px;
        }

        .form-group i.fa-search {
            line-height: 30px;
            height: 30px;
        }

        .navbar-form-custom .form-control {
            height: 30px;
        }

        .navbar {
            min-height: 30px;
        }

        #content-main {
            height: calc(100% - 110px);
        }


        .btn-w-m {
            width: 90% !important;
            margin-left: 10px;
        }
        .row > .form-group {
            border: 1px solid #5db1a0;
            width: 90%;
            margin: 5px 5px 5px 10px;
        }

    </style>
</head>
<body class="fixed-sidebar full-height-layout gray-bg" style="overflow:hidden">
<div id="wrapper">
    <!--左侧导航开始-->
    <nav class="navbar-default navbar-static-side" role="navigation">
        <div class="nav-close">
            <i class="fa fa-times-circle"></i>
        </div>
        <div class="sidebar-collapse">
            <ul class="nav" id="side-menu">
                <li class="nav-header">
                    <div class="dropdown profile-element" data-animation="bounceInRight">
                        <h4 class="text-navy">智慧停车互联网平台</h4>
                        <a data-toggle="dropdown" class="dropdown-toggle" href="#">
                                <span class="clear">
                                    <span class="block m-t-xs"><strong class="font-bold">用户名称</strong></span>
                                    <span class="text-muted text-xs block">权限组<b class="caret"></b></span>
                                </span>
                        </a>
                        <ul class="dropdown-menu animated fadeInRight m-t-xs">
                            <li class="changePwd"><a href="#">修改密码</a></li>
                            <li class="loginOut J_menuItem"><a href="#">安全退出</a></li>
                        </ul>
                    </div>
                    <div class="logo-element">P+</div>
                </li>

                <%--<li class="loadingMenu">--%>
                    <%--<div class="sk-spinner sk-spinner-three-bounce">--%>
                        <%--<div class="sk-bounce1"></div>--%>
                        <%--<div class="sk-bounce2"></div>--%>
                        <%--<div class="sk-bounce3"></div>--%>
                    <%--</div>--%>
                <%--</li>--%>


                <%--class="menu-role"--%>
                <li >
                    <a href="#"><i class="fa fa-cogs"></i> <span class="nav-label">系统管理</span><span class="fa arrow"></span></a>
                    <ul class="nav nav-second-level">
                        <li><a class="J_menuItem" href="${pageContext.request.contextPath}/User/">管理员管理</a></li>
                        <li><a class="J_menuItem" href="${pageContext.request.contextPath}/PowerGroup/Index">权限组管理</a></li>
                        <!--<li><a class="J_menuItem" href="../Wallets/Index">钱包充值管理</a></li>-->
                        <li><a class="J_menuItem" href="../SystemConfig/Index">平台参数配置</a></li>
                        <li><a class="J_menuItem" href="../WeixinMenuTool/Index">微信菜单工具</a></li>
                        <li><a class="J_menuItem" href="../SystemLog/Index" id="menuSystemLog">系统日志</a></li>
                    </ul>
                </li>
            </ul>
        </div>
    </nav>
    <!--左侧导航结束-->
    <!--右侧部分开始-->
    <div id="page-wrapper" class="gray-bg dashbard-1">
        <div class="row border-bottom">
            <nav class="navbar navbar-static-top" role="navigation" style="margin-bottom: 0">
                <div class="navbar-header">
                    <a class="navbar-minimalize minimalize-styl-2 btn btn-primary " href="#"><i class="fa fa-bars"></i> </a>
                    <form role="search" class="navbar-form-custom" method="GET" action="#">
                        <div class="form-group">
                            <i class="fa fa-search"></i>
                            <input type="text" placeholder="请输入您需要查找的车牌号 …" class="form-control" autocomplete="off" name="top-search" id="top-search">
                        </div>
                    </form>
                    <a class="tool skin" href="javascript:;"><i class="layui-icon">&#xe61b;</i></a>
                </div>
            </nav>
        </div>
        <div class="row content-tabs">
            <button class="roll-nav roll-left J_tabLeft">
                <i class="fa fa-backward"></i>
            </button>
            <nav class="page-tabs J_menuTabs">
                <div class="page-tabs-content">
                    <a href="javascript:;" class="active J_menuTab" data-id="Home">首页</a>
                </div>
            </nav>
            <button class="roll-nav roll-right J_tabRight">
                <i class="fa fa-forward"></i>
            </button>
            <div class="btn-group roll-nav roll-right">
                <button class="dropdown J_tabClose" data-toggle="dropdown">
                    关闭操作<span class="caret"></span>

                </button>
                <ul role="menu" class="dropdown-menu dropdown-menu-right">
                    <li class="J_tabShowActive">
                        <a>定位当前选项卡</a>
                    </li>
                    <li class="divider"></li>
                    <li class="J_tabCloseAll">
                        <a>关闭全部选项卡</a>
                    </li>
                    <li class="J_tabCloseOther">
                        <a>关闭其他选项卡</a>
                    </li>
                </ul>
            </div>
            <a href="#" class="roll-nav roll-right J_tabExit loginOut"><i class="fa fa fa-sign-out"></i> 退出</a>
        </div>
        <div class="row J_mainContent" id="content-main">
            <iframe class="J_iframe" name="iframe0" width="100%" height="100%" src="${pageContext.request.contextPath}/Home/Main" frameborder="0" data-id="Home" seamless></iframe>
        </div>
        <div class="footer">
            <div class="pull-right">
                2018 &copy; 智慧停车互联网平台   <a href="#" target="_blank"></a>
            </div>
        </div>
    </div>
    <!--右侧部分结束-->
</div>
<div>
    <input type="hidden" id="tempValue" /><!--不同iframe之间传值-->
    <input type="hidden" id="tempParkingKey" /><!--不同iframe之间传车场Key-->
    <!--功能扩展-自动弹出登录，由全局ajax控制-->
    <div id="modal-form" class="modal fade in" aria-hidden="true" data-backdrop="static" style="margin-top: 12%;">
        <div class="modal-dialog" style="width: 300px;">
            <div class="modal-content" style="height: 230px;">
                <div class="modal-body">
                    <button type="button" class="close hide" data-dismiss="modal"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button>
                    <div class="row">
                        <div style="width: 100%; height: 100%;">
                            <h3 class="m-t-none m-b text-center" style="color: #1ab394">请重新登录！</h3>
                            <div class="form-group">
                                <input type="text" id="username" placeholder=" 请输入用户名" class="form-control" style="width: 90%; margin: 10px; padding-left: 10px !important">
                            </div>
                            <div class="form-group">
                                <input type="password" id="password" placeholder=" 请输入密码" class="form-control" style="width: 90%; margin: 10px; padding-left: 10px !important">
                            </div>
                            <div class="form-group">
                                <button type="button" id="btn_Login" style="margin-top: 5px;" data-loading-text="<div style='text-align:center; margin:0 auto;'><div style='display:inline-block;width:45px;'>登录中</div><div class='sk-spinner sk-spinner-three-bounce' style='display:inline-block;width:45px;'><div class='sk-bounce1'></div><div class='sk-bounce2'></div><div class='sk-bounce3'></div></div></div>" class="btn btn-w-m btn-primary pull-center">登&nbsp;&nbsp;录</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <a id="LoginForm" data-toggle="modal" class="btn btn-primary hide" href="#modal-form" data-iframe="" data-reload=""></a>
</div>
<script src="${pageContext.request.contextPath}/js/jquery.min.js?v=2.1.4"></script>
<script src="${pageContext.request.contextPath}/js/bootstrap.min.js?v=3.3.6"></script>
<script src="${pageContext.request.contextPath}/js/plugins/metisMenu/jquery.metisMenu.js"></script>
<script src="${pageContext.request.contextPath}/js/plugins/layer/layer.js"></script>
<script src="${pageContext.request.contextPath}/js/contabs.min.js"></script>
<script src="${pageContext.request.contextPath}/js/plugins/pace/pace.min.js"></script>
<script src="${pageContext.request.contextPath}/js/hplus.min.js?v=4.1.0"></script>
<script src="${pageContext.request.contextPath}/js/plugins/slimscroll/jquery.slimscroll.min.js"></script>
<script src="${pageContext.request.contextPath}/scripts/jquery.md5.js"></script>
<script src="${pageContext.request.contextPath}/js/jquery.common.js"></script>
<script src="${pageContext.request.contextPath}/js/localData.js"></script>
<script>
    // var global = {
    //     formPower: null,
    //     powerType: null,
    //     showMenu: function () {
    //         var lin = $(".menu-role li");  //显示子菜单
    //         for (var i = 0; i < lin.length; i++) {
    //             var href = $(lin[i]).find("a").attr("href");
    //             var controlName = href.split('/')[1];
    //             if (this.formPower[controlName] == undefined) {
    //                 $(lin[i]).addClass("hide");
    //                 continue;
    //             }
    //             if (this.formPower[controlName]["View"] == "true") {
    //                 $(lin[i]).addClass("show");
    //             } else {
    //                 $(lin[i]).addClass("hide");
    //             }
    //         }
    //         $(".loadingMenu").remove();
    //         var li = $(".menu-role");   //显示父菜单
    //         for (var j = 0; j < li.length; j++) {
    //             if ($(li[j]).find("li[class='show']").length > 0) {
    //                 $(li[j]).removeClass("menu-role").addClass("animated fadeInUp");
    //             }
    //         }
    //     },
    //
    //     getFormPower: function () {
    //         $.getJSON("/PowerGroup/getFormPower?_r=" + Math.random(), {},  //获取到当前用户所有权限
    //             function (json) {
    //                 if (json.Success) {
    //                     global.formPower = json.Data;
    //                     global.showMenu();             //处理菜单
    //                 } else {
    //                     layer.msg('系统错误', function () {
    //                         window.top.location.href = '../../';
    //                     });
    //                 }
    //             });
    //     },
    //
    //     getPowerType: function () {
    //         $.getJSON("/PowerGroup/GetPowerEnum", {},  //获取到所有操作枚举
    //             function (json) {
    //                 if (json.Success) {
    //                     global.powerType = json.Data;
    //                 } else {
    //                     layer.msg('系统错误', function () {
    //                         window.top.location.href = '../../';
    //                     });
    //                 }
    //             });
    //     },
    //
    //     //通过文档对象和控制器名称来控制按钮
    //     documnetPower: function (currentDocument, controlName) {
    //         var fpower = this.formPower[controlName];
    //         //先禁用所有控制按钮
    //         for (var tkey in this.powerType) {
    //             var buttonD = currentDocument.getElementById(tkey);
    //             if (buttonD != null) {
    //                 buttonD.disabled = true;
    //             }
    //         }
    //         //再开启有权限的按钮
    //         for (var fKey in fpower) {
    //             if (fpower[fKey]) {
    //                 var buttonE = currentDocument.getElementById(fKey);
    //                 if (buttonE != null) {
    //                     buttonE.disabled = false;
    //                 }
    //             }
    //         }
    //         return fpower;
    //     },
    //
    //     //通过页面路径来控制按钮
    //     formPowerFill: function (iframeSrc, iframeSrcParent) {
    //         iframeSrc = ".." + iframeSrc;
    //         iframeSrcParent = iframeSrcParent == null ? null : ".." + iframeSrcParent;
    //
    //         var controlName;                    //获取传递的控制器名称
    //         var fpower;                         //获取到对应控制器button操作权限
    //         var tpower = this.powerType;        //所有按钮枚举
    //
    //         var objdoc;
    //         //如果传递的是3级页面（iframeSrcParent不为null），先获取2级框架
    //         if (iframeSrcParent != null) {
    //             controlName = iframeSrcParent.split('/')[1];
    //             fpower = this.formPower[controlName];
    //             //先获取中间层iframe（Tab项）
    //             var iframeTopName = $("iframe[src='" + iframeSrcParent + "']").attr("name");
    //             var iframeTop = window.frames[iframeTopName].document;
    //             var iframeTopWindow = window.frames[iframeTopName];
    //             //再获取到弹出层
    //             var iframeInterName = $(iframeTop).find("iframe[src='" + iframeSrc.replace("..", "") + "']").attr("name");
    //             objdoc = iframeTopWindow.frames[iframeInterName].document; //弹出层给当前顶层操作
    //
    //         } else {
    //             controlName = iframeSrc.split('/')[1];
    //             fpower = this.formPower[controlName];
    //             var iframeName = $("iframe[src='" + iframeSrc + "']").attr("name");
    //             objdoc = window.frames[iframeName].document; //得到当前传递的框架对象
    //         }
    //         //先禁用所有控制按钮
    //         for (var tkey in tpower) {
    //             var buttonD = objdoc.getElementById(tkey);
    //             if (buttonD != null) {
    //                 buttonD.disabled = true;
    //             }
    //         }
    //         //再开启有权限的按钮
    //         for (var fKey in fpower) {
    //             if (fpower[fKey]) {
    //                 var buttonE = objdoc.getElementById(fKey);
    //                 if (buttonE != null) {
    //                     buttonE.disabled = false;
    //                 }
    //             }
    //         }
    //         return fpower;
    //     }
    // }

    var pager = {
        skinItem: null,
        init: function () {
            this.loadSkin();
            this.bindEvent();
        },
        loadSkin: function () {
            var skinid = '@ViewBag.Skinid';
            for (var i = 0; i < skinModel.options.length; i++) {
                if (skinModel.options[i].skinid == skinid) {
                    pager.skinItem = skinModel.options[i];
                    break;
                }
            }
            if (pager.skinItem != null) {
                var ele = document.getElementById("linkCss") ? document.getElementById("linkCss") : document.createElement("link");
                ele.id = "linkCss";
                ele.href = pager.skinItem.css;
                ele.rel = "stylesheet";
                window.document.body.appendChild(ele);
            }
        },
        bindEvent: function () {
            $(".loginOut").click(function () {
                layer.msg('正在退出', { icon: 16 });
                $.getJSON("/Index/LoginOut", {},
                    function (json) {
                        if (json.Success) {
                            layer.closeAll();
                            window.top.location.href = '../../';
                        } else {
                            layer.msg('系统错误', function () {
                                window.top.location.href = '../../';
                            });
                        }
                    });
            });

            $('#top-search').keypress(function (event) {
                if (event.keyCode === 13) {
                    $("#tempValue").val(this.value);
                    $("#tempValue")[0].name = "ParkOrder_CarNo";
                    $("#menuMaintain").click();
                    this.value = "";
                }
            });

            $(".changePwd").click(function (event) {
                layer.open({
                    title: "<i class='fa fa-unlock-alt'></i> 修改密码",
                    type: 2,
                    area: ['400px', '390px'],
                    fix: false, //不固定
                    maxmin: false,
                    content: '/Index/ChangePassword'
                });
            });

            //登录
            $("#btn_Login").click(function () {
                var username = $("#username").val().trim();
                var btn = $(this);
                if (username.length < 5) {
                    layer.tips("提示：用户名为5-20位字符", '#username', { tips: [3] });
                    return;
                }
                var password = $("#password").val().trim();
                if (password.length < 6) {
                    layer.tips("提示：密码为6-20位字符", '#password', { tips: [3] });
                    return;
                }
                if (localData.get("Account") == null) {
                    layer.tips("您的缓存被清除，请刷新页面登录", '#username', { tips: [3] });
                    return;
                }
                if (localData.get("Account") != username) {
                    layer.tips("您输入的不是当前用户", '#username', { tips: [3] });
                    return;
                }

                $('#btn_Login').button('loading');

                $.post("/Login/Login", { Account: username, Pwd: $.md5(password) },
                    function (data) {
                        if (data.Success) {
                            $(".close").click();
                            $("#username").val("");
                            $("#password").val("");
                            btn.button('reset');

                            //判断有跳转打开页面
                            var bta = $("#LoginForm");
                            var re = $(bta).attr("data-reload");
                            var name = $(bta).attr("data-iframe");
                            if (re === "true" && name !== "") {
                                var iframe = $(window.document).find("iframe[name='" + name + "']");
                                $(iframe).attr('src', $(iframe).attr("src")); //刷新该框架，重新加载页面
                            }
                        } else {
                            setTimeout(function () {
                                $('#btn_Login').button('reset');
                            }, 500);
                            layer.tips("提示：" + data.Message, '#btn_Login', { tips: [3] });
                        }
                    }, "json");
            });
        },
        timeminmax: function (s, e, ds, de, page) {
            $(e).focus(function () { if ($(s).val() == "") { de.min = "1900-01-01 00:00:00"; page.laydate(de); } });
            $(s).focus(function () { if ($(e).val() == "") { ds.max = "2099-12-31 00:00:00"; page.laydate(ds); } });
        }
    };

    //检查登录
    function SessionExtension() {
        var vtime = setInterval(function () {
            $.post('/Index/LoginExtension/', {}, function (json) {
                //console.log(json);
                if (!json.Success) {
                    $(".loginOut").click();
                }
            }, 'json');
        }, 1000 * 60);
    }
    $(function () {
        pager.init();
        global.getFormPower();
        global.getPowerType();
        //SessionExtension();
    });


    $(".skin").click(function () {
        var frm = layer.open({
            type: 2,
            title: '更换皮肤',
            content: '/Index/Skin',
            area: ["800px", "500px"],
            btn: ["保存", "取消"],
            yes: function (a, b) {
                $.getJSON('/Index/setSkin', { Skinid: pager.skinItem.skinid }, function (json) {
                    if (json.Success) {
                        var ele = document.getElementById("linkCss") ? document.getElementById("linkCss") : document.createElement("link");
                        ele.id = "linkCss";
                        ele.href = pager.skinItem.css;
                        ele.rel = "stylesheet";
                        window.document.body.appendChild(ele);

                        $(".J_tabCloseAll").click();
                        $("iframe[data-id=Home]").attr("src", "/Index/Home?Community_ID=" + $("#Community").val());

                        layer.closeAll();
                        //window.location.reload();
                    }
                });

            }, btn2: function (a, b) {

            }
        });
    });
</script>
</body>
</html>
