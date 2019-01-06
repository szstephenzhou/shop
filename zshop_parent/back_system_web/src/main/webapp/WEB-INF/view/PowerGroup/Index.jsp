<%--
  Created by IntelliJ IDEA.
  User: Administrator
  Date: 2019/1/6 0006
  Time: 下午 9:00
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>权限组管理</title>
    <meta name="keywords" content="">
    <meta name="description" content="">
    <link href="${pageContext.request.contextPath}/css/bootstrap.min14ed.css?v=3.3.6" rel="stylesheet">
    <link href="${pageContext.request.contextPath}/css/font-awesome.min93e3.css?v=4.4.0" rel="stylesheet">
    <link href="${pageContext.request.contextPath}/css/plugins/iCheck/custom.css" rel="stylesheet">
    <link href="${pageContext.request.contextPath}/css/animate.min.css" rel="stylesheet">
    <link href="${pageContext.request.contextPath}/css/style.min862f.css?v=4.1.0" rel="stylesheet">
    <link href="${pageContext.request.contextPath}/css/myApp.css?33" rel="stylesheet" />
    <link href="${pageContext.request.contextPath}/js/plugins/layer/skin/layer.css" rel="stylesheet" />
</head>

<body class="gray-bg">
<div class="wrapper wrapper-content animated fadeInRight">

    <div class="row">
        <div class="col-sm-12">
            <div class="ibox float-e-margins">
                <div class="ibox-title">
                    <ol class="col-lg-5 breadcrumb">
                        <li>系统管理</li>
                        <li>权限组管理</li>
                    </ol>
                    <div class="ibox-tools">

                        <a class="dropdown-toggle" data-toggle="dropdown" href="#">
                            <i class="fa fa-wrench"></i>
                        </a>
                        <ul class="dropdown-menu dropdown-user">
                            <li>
                                <a href="#" onclick="location.reload()"><i class="fa fa-refresh animated rotateIn"></i>&nbsp; 重新载入</a>
                            </li>
                        </ul>

                        <a class="collapse-link">
                            <i class="fa fa-chevron-up"></i>
                        </a>

                    </div>
                </div>
                <div class="ibox-content">
                    <div class="row">
                        <div class="col-sm-6 m-b-xs">
                            <button type="button" id="Add"  class=" btn btn-primary " ><i class="fa fa-plus"></i>&nbsp; 新增</button>
                            <button type="button" id="Update" class="btn btn-primary "><i class="fa fa-edit"></i>&nbsp; 修改</button>
                            <button type="button" id="Enable" class="btn btn-primary "><i class="fa fa-check-circle-o"></i>&nbsp; 启用</button>
                            <button type="button" id="Disable" class="btn btn-primary "><i class="fa fa-ban"></i>&nbsp; 禁用</button>
                            <button type="button" id="Delete" class="btn btn-primary "><i class="fa fa-trash-o"></i>&nbsp; 删除</button>
                        </div>
                        <div class="col-sm-3 m-b-xs"></div>
                        <div class="col-sm-3">
                            <div class="input-group searchForm">
                                <input type="text" placeholder="权限名称" id="PowerGroup_Name" name="PowerGroup_Name" class="form-control">
                                <span class="input-group-btn">
                                    <button type="button" id="Search" class="btn btn-primary search-btn"><i class="fa fa-search"></i> 查询</button>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="table-responsive">
                        <table class="table table-striped  table-hover">
                            <thead>
                            <tr>
                                <th></th>
                                <th>权限名称</th>
                                <th>用户数</th>
                                <th>状态</th>
                                <th>描述</th>
                                <th>创建人</th>
                            </tr>
                            </thead>
                            <tbody id="data-view"></tbody>

                            <script id="data-tmpl" type="text/x-jquery-tmpl">
                                <tr>
                                    <td>
                                        <input type="checkbox" class="i-checks" value="${PowerGroup_ID }">
                                    </td>
                                    <td>${PowerGroup_Name }</td>
                                    <td><span class="label">${PowerGroup_AdminCount }</span></td>
                                    <td>
                                        {{if PowerGroup_Enable}}
                                        <span class="badge badge-info">启用</span>
                                        {{else}}
                                        <span class="badge badge-warning">禁用</span>
                                        {{/if}}
                                    </td>
                                    <td>${PowerGroup_Remark }</td>
                                    <td>${Admin_Account }</td>
                                </tr>
                            </script>

                        </table>
                    </div>

                    <div class="row" >
                        <div class="ibox-content page-box" >
                            <div class="col-sm-5 page-size no-padding-y">
                                显示<span id="item-begin"> 0</span> 到 <span id="item-end">0</span> 项，共 <span id="item-sum">0</span> 项，

                                每页显示
                                <select id="page-size">
                                    <option value="10">10</option>
                                    <option value="25">25</option>
                                    <option value="50">50</option>
                                    <option value="100">100</option>
                                </select>
                                条记录
                            </div>
                            <div class="col-sm-7 no-padding-y">
                                <div class=" m-b-xs fa-pull-right text-right dataTables_paginate paging_simple_numbers" id="page-btm"> </div>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    </div>

</div>
<script src="${pageContext.request.contextPath}/js/jquery.min.js?v=2.1.4"></script>
<script src="${pageContext.request.contextPath}/js/bootstrap.min.js?v=3.3.6"></script>
<script src="${pageContext.request.contextPath}/js/content.min.js?v=1.0.0"></script>
<script src="${pageContext.request.contextPath}/js/plugins/iCheck/icheck.min.js"></script>
<script src="${pageContext.request.contextPath}/js/plugins/layer/layer.js"></script>
<script src="${pageContext.request.contextPath}/js/plugins/layer/laypage-v1.3/laypage/laypage.js"></script>
<script src="${pageContext.request.contextPath}/js/jquery.tmpl.min.js"></script>
<script src="${pageContext.request.contextPath}/js/jquery.common.js"></script>
<script>

    var pager = {
        pageIndexCurrent: 1,
        init: function () {
            this.bindPower();
            this.bindEvent();
        },

        //数据绑定
        bindData: function(pageIndex) {
            layer.msg('加载中...', { icon: 16, time: 0 });

            var conditionParam = $(".searchForm").formToJSON(true, function(data) {
                return data;
            });

            var pageSize = $("#page-size").val();
            $.ajax({
                type: 'post',
                url: '/PowerGroup/GetPowerGroupList',
                dataType: 'json',
                data: { pageIndex: pageIndex, pageSize: pageSize, conditionParam: JSON.stringify(conditionParam) },
                success: function(json) {
                    if (json.Success) {
                        //填充表格
                        if (json.Data != null && json.Data.ResultList != null && json.Data.ResultList.length > 0) {
                            $("#data-view").html($('#data-tmpl').tmpl(json.Data.ResultList));

                            //翻页组件
                            laypage({
                                cont: 'page-btm', //容器。值支持id名、原生dom对象，jquery对象,
                                pages: json.Data.TotalPage, //总页数
                                curr: json.Data.PageIndex, //当前页
                                skin: 'molv', //皮肤
                                skip: true, //是否开启跳页
                                first: 1, //将首页显示为数字1,。若不显示，设置false即可
                                last: json.Data.TotalPage, //将尾页显示为总页数。若不显示，设置false即可
                                prev: '<', //若不显示，设置false即可
                                next: '>', //若不显示，设置false即可

                                jump: function(e, first) { //触发分页后的回调
                                    if (!first) { //一定要加此判断，否则初始时会无限刷新
                                        pager.pageIndexCurrent = e.curr;
                                        pager.bindData(e.curr);
                                    }
                                }
                            });

                            //设置统计项显示
                            $("#item-begin").html(json.Data.PageIndex == 1 ? 1 : (json.Data.PageIndex-1) * json.Data.PageSize);
                            $("#item-end").html(json.Data.TotalRecord < json.Data.PageIndex * json.Data.PageSize ? json.Data.TotalRecord : json.Data.PageIndex * json.Data.PageSize);
                            $("#item-sum").html(json.Data.TotalRecord);

                            //加载表中checkbox的i-checks样式
                            $(".i-checks").iCheck({ checkboxClass: "icheckbox_square-green", radioClass: "iradio_square-green" });
                            //单选
                            $('.i-checks').on('ifChecked', function (){ $('.i-checks').not(this).iCheck('uncheck');} );

                        } else {
                            $("#data-view").html("<tr class='text-center'><td colspan='6'>没有找到匹配的记录</td></tr>");
                        }
                        layer.closeAll();
                    } else {
                        layer.msg('加载失败：' + json.Message, { icon: 5, btn: ['确定'] });
                    }
                },
                error: function() {
                    layer.msg('系统错误', { icon: 2, shift: 6, btn: ['确定'] });
                }
            });

        },
        bindPower: function() {
            //加载表单权限控制
            var fpower = window.parent.global.formPowerFill(window.location.pathname, null);
            if (fpower["Search"]) {
                this.bindData(pager.pageIndexCurrent);
            }
        },

        bindEvent: function() {

            //查询
            $("#Search").click(function() {
                pager.pageIndexCurrent = 1;
                pager.bindData(pager.pageIndexCurrent);
            });

            //新增操作
            $("#Add").click(function() {

                var fulllayer = layer.open({
                    title: "<i class='fa fa-users'></i> 新增权限组",
                    type: 2,
                    area: ['900px', '640px'],
                    fix: false, //不固定
                    maxmin: true, //可缩放
                    content: 'PowerEdit?Edit=Add'
                });
                //layer.full(fulllayer);

            });

            //编辑
            $("#Update").click(function() {

                //获取要编辑的权限ID
                var checkes = $("#data-view input[type='checkbox']:checked");
                if (checkes.length > 0) {
                    var powerGroupID = $(checkes[0]).val();

                    var fulllayer = layer.open({
                        title: "<i class='fa fa-users'></i> 编辑权限组",
                        type: 2,
                        area: ['900px', '640px'],
                        fix: false, //不固定
                        maxmin: true, //可缩放
                        content: 'PowerEdit?Edit=Update&PowerGroupID=' + powerGroupID
                    });
                    //layer.full(fulllayer);
                } else {
                    layer.msg("请选择！");
                }
            });


            //启用
            $("#Enable").click(function() {

                var checkes = $("#data-view input[type='checkbox']:checked");
                if (checkes.length > 0) {
                    var PowerGroup_ID = $(checkes[0]).val();

                    layer.confirm('是否启用此权限组？', {
                        btn: ['确定', '取消'], icon: 3
                    }, function() {

                        $.getJSON("/PowerGroup/EnablePowerGroup?_r=" + Math.random(), { PowerGroup_ID: PowerGroup_ID },
                            function(json) {
                                if (json.Success) {
                                    layer.msg('已启用', { icon: 1, time: 1000 }, function() {
                                        pager.bindData(pager.pageIndexCurrent);
                                    });
                                } else {
                                    layer.msg('启用失败：' + json.Message, { icon: 2, shift: 6 });
                                }
                            });

                    }, function() {});

                } else {
                    layer.msg("请选择！");
                }
            });


            //禁用
            $("#Disable").click(function() {

                var checkes = $("#data-view input[type='checkbox']:checked");
                if (checkes.length > 0) {
                    var PowerGroup_ID = $(checkes[0]).val();

                    layer.confirm('是否禁用此权限组？', {
                        btn: ['确定', '取消'], icon: 3
                    }, function() {

                        $.getJSON("/PowerGroup/DisablePowerGroup?_r=" + Math.random(), { PowerGroup_ID: PowerGroup_ID },
                            function(json) {
                                if (json.Success) {
                                    layer.msg('已禁用', { icon: 1, time: 1000 }, function() {
                                        pager.bindData(pager.pageIndexCurrent);
                                    });
                                } else {
                                    layer.msg('禁用失败：' + json.Message, { icon: 2, shift: 6 });
                                }
                            });

                    }, function() {});

                } else {
                    layer.msg("请选择！");
                }

            });

            //删除
            $("#Delete").click(function() {

                var checkes = $("#data-view input[type='checkbox']:checked");
                if (checkes.length > 0) {
                    var PowerGroup_ID = $(checkes[0]).val();

                    layer.confirm('是否删除此权限组？', {
                        btn: ['确定', '取消'], icon: 3
                    }, function () {

                        $.getJSON("/PowerGroup/DeletePowerGroup?_r=" + Math.random(), { PowerGroup_ID: PowerGroup_ID },
                            function(json) {
                                if (json.Success) {
                                    layer.msg('已删除', { icon: 1 ,time:1000},function() {
                                        pager.bindData(pager.pageIndexCurrent);
                                    } );
                                } else {
                                    layer.msg('删除失败：' + json.Message, { icon: 5 });
                                }
                            });

                    }, function() {});

                } else {
                    layer.msg("请选择！");
                }

            });

        }

    };

    $(function() { pager.init() });

</script>


</body>
</html>
