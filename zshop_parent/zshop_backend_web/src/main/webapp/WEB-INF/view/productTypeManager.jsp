<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html lang="zh">
<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <meta http-equiv="X-UA-Compatible" content="ie=edge"/>
    <title>产品类型管理</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/bootstrap.css"/>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/index.css"/>
    <script src="${pageContext.request.contextPath}/js/jquery.js"></script>
    <script src="${pageContext.request.contextPath}/js/bootstrap.js"></script>
    <script src="${pageContext.request.contextPath}/js/userSetting.js"></script>
    <%--分页插件--%>
    <script src="${pageContext.request.contextPath}/js/bootstrap-paginator.js"></script>
    <%--layer弹框js--%>
    <script src="${pageContext.request.contextPath}/layer/layer.js"></script>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/zshop.css"/>
    <script type="application/javascript">
        $(function () {
            $("#pagination").bootstrapPaginator({
                //设置版本号
                bootstrapMajorVersion: 3,
                // 显示第几页
                currentPage: ${pageInfo.pageNum},
                // 总页数
                totalPages: ${pageInfo.pageSize},


                // //当单击操作按钮的时候, 执行该函数, 调用ajax渲染页面
                pageUrl: function (type, page, current) {

                    return "${pageContext.request.contextPath}/backend/productType/findAll?pageNum=" + page;

                },
                itemTexts: function (type, page, current) {
                    switch (type) {
                        case "first":
                            return "首页";
                        case "prev":
                            return "上一页";
                        case "next":
                            return "下一页";
                        case "last":
                            return "末页";
                        case "page":
                            return page;
                    }
                }
            });
        });

        // 添加商品类型
        function addProductType() {
            $.post('${pageContext.request.contextPath}/backend/productType/add',
                {
                    'name': $('#productTypeName').val()
                }, function (relust) {
                    if (relust.status) {
                        layer.msg(relust.message, {time: 3000, skin: 'sucessMsg'},function () {

                            location.href='${pageContext.request.contextPath}/backend/productType/findAll?pageNum='+${pageInfo.pageNum};
                        });
                    } else {
                        layer.msg(relust.message, {time: 5000, skin: 'errorMsg'})
                    }
                }
            );
        }

        //显示商品类型
        function showProductType(id) {
            $.post(
                '${pageContext.request.contextPath}/backend/productType/findById',
                {'id': id},
                function (relust) {
                    if (relust.status == 1) {
                        $("#proTypeNum").val(relust.data.id);
                        $("#proTypeName").val(relust.data.name);
                    }
                }
            );
        }
        // 修改商品名称
        function modifyName() {
            $.ajax({
                type:'post',
                url:'${pageContext.request.contextPath}/backend/productType/modifyName',
                data:{'id':$("#proTypeNum").val(),'name':$("#proTypeName").val()},
                dataType:'json',
                success:function (result) {
                    if (result.status) {
                        layer.msg(result.message, {time: 2000, skin: 'sucessMsg'},function () {
                            location.href='${pageContext.request.contextPath}/backend/productType/findAll?pageNum='+${pageInfo.pageNum};
                        });
                    } else {
                        layer.msg(result.message, {time: 5000, skin: 'errorMsg'})
                    }
                }
            });
        }
        
        // 显示确认删除的模态框
        function showDeleteModel(id) {
            $("#deleteProductTypeId").val(id);
            $("#deleteProductType").modal("show");
        }
        
        function deleteProductType() {
         $.ajax({
             type:'get',
             url:'${pageContext.request.contextPath}/backend/productType/deleteById',
             data:{'id':$("#deleteProductTypeId").val()},
             dataType:'json',
             success:function (result) {
                 if(result.status){
                     layer.msg(result.message,{time:2000,shin:'sucessMsg'},function () {
                         location.href='${pageContext.request.contextPath}/backend/productType/findAll?pageNum='+${pageInfo.pageNum};
                     });
                 }else {
                     layer.msg(result.message, {time: 5000, skin: 'errorMsg'})
                 }
             }
         });
        }
    </script>
</head>

<body>
<div class="panel panel-default" id="userSet">
    <div class="panel-heading">
        <h3 class="panel-title">商品类型管理</h3>
    </div>
    <div class="panel-body">
        <input type="button" value="添加商品类型" class="btn btn-primary" id="doAddProTpye">
        <br>
        <br>
        <div class="show-list">
            <table class="table table-bordered table-hover" style='text-align: center;'>
                <thead>
                <tr class="text-danger">
                    <th class="text-center">编号</th>
                    <th class="text-center">类型名称</th>
                    <th class="text-center">状态</th>
                    <th class="text-center">操作</th>
                </tr>
                </thead>
                <tbody id="tb">
                <c:forEach items="${pageInfo.list}" var="productTpye">
                    <tr>
                        <td>${productTpye.id}</td>
                        <td>${productTpye.name}</td>
                        <td>
                            <c:if test="${productTpye.status==1}">启用</c:if>
                            <c:if test="${productTpye.status==0}">禁用</c:if>
                        </td>
                        <td class="text-center">
                            <input type="button" class="btn btn-warning btn-sm doProTypeModify" value="修改"
                                   onclick="showProductType(${productTpye.id})">
                            <input type="button" class="btn btn-warning btn-sm doProTypeDelete" onclick="showDeleteModel(${productTpye.id})" value="删除">

                            <c:if test="${productTpye.status==1}">
                                <input type="button" class="btn btn-danger btn-sm doProTypeDisable" value="禁用">
                            </c:if>
                            <c:if test="${productTpye.status==0}">
                                <input type="button" class="btn btn-green btn-sm doProTypeDisable" value="启用">
                            </c:if>

                        </td>
                    </tr>
                </c:forEach>


                </tbody>
            </table>
            <%--分页插件的实现 bootstrop-pagination--%>
            <ul id="pagination" style="float:right"></ul>
        </div>
    </div>
</div>

<!-- 添加商品类型 start -->
<div class="modal fade" tabindex="-1" id="ProductType">
    <!-- 窗口声明 -->
    <div class="modal-dialog modal-lg">
        <!-- 内容声明 -->
        <div class="modal-content">
            <!-- 头部、主体、脚注 -->
            <div class="modal-header">
                <button class="close" data-dismiss="modal">&times;</button>
                <h4 class="modal-title">添加商品类型</h4>
            </div>
            <div class="modal-body text-center">
                <div class="row text-right">
                    <label for="productTypeName" class="col-sm-4 control-label">类型名称：</label>
                    <div class="col-sm-4">
                        <input type="text" class="form-control" id="productTypeName">
                    </div>
                </div>
                <br>
            </div>
            <div class="modal-footer">
                <input  id="deleteProductTypeId" type="hidden"/>

                <button class="btn btn-primary addProductType" onclick="addProductType()">添加</button>
                <button class="btn btn-primary cancel" data-dismiss="modal">取消</button>
            </div>
        </div>
    </div>
</div>
<!-- 添加商品类型 end -->

<!-- 修改商品类型 start -->
<div class="modal fade" tabindex="-1" id="myProductType">
    <!-- 窗口声明 -->
    <div class="modal-dialog modal-lg">
        <!-- 内容声明 -->
        <div class="modal-content">
            <!-- 头部、主体、脚注 -->
            <div class="modal-header">
                <button class="close" data-dismiss="modal">&times;</button>
                <h4 class="modal-title">修改商品类型</h4>
            </div>
            <div class="modal-body text-center">
                <div class="row text-right">
                    <label for="proTypeNum" class="col-sm-4 control-label">编号：</label>
                    <div class="col-sm-4">
                        <input type="text" class="form-control" id="proTypeNum" readonly>
                    </div>
                </div>
                <br>
                <div class="row text-right">
                    <label for="proTypeName" class="col-sm-4 control-label">类型名称</label>
                    <div class="col-sm-4">
                        <input type="text" class="form-control" id="proTypeName">
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-warning updateProType" onclick="modifyName()">修改</button>
                <button class="btn btn-primary cancel" data-dismiss="modal">取消</button>
            </div>
        </div>
    </div>
</div>
<!-- 修改商品类型 end -->


<!-- 删除商品类型 start -->
<div class="modal fade" tabindex="-1" id="deleteProductType">
    <!-- 窗口声明 -->
    <div class="modal-dialog">
        <!-- 内容声明 -->
        <div class="modal-content">
            <!-- 头部、主体、脚注 -->
            <div class="modal-header">
                <button class="close" data-dismiss="modal">&times;</button>
                <h4 class="modal-title">提示消息</h4>
            </div>
            <div class="modal-body text-center">
                <div class="row text-center">
                     <h4>确认要删除该商品类型吗?</h4>
                </div>
                <br>
            </div>
            <div class="modal-footer">
                <button class="btn btn-warning updateProType" onclick="deleteProductType()">确定</button>
                <button class="btn btn-primary cancel" data-dismiss="modal">取消</button>
            </div>
        </div>
    </div>
</div>
<!-- 修改商品类型 end -->
</body>

</html>
