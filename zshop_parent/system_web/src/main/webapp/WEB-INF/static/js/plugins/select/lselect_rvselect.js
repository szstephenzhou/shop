//插件名称: LSelect_RVSelect    
//作    者: Kian Wang
//功能说明: 设置左select右虚拟select的option的互相移动.  
//输入参数: 1-6:左select,右select ,>| ,> ,< , |< 这六个DOM元素的Id  
//          7:checkbox的name  
//          8:select中option是否移动 (无此参数则为可移动---true)  
//          9:li是否可移动           (无此参数则为可移动---true)  
//调用示例:$(function (){ $.fn.LSelect_RVSelect("selLeft", "ulVirtualSel", "img_L_AllTo_R", "img_L_To_R", "img_R_To_L", "img_R_AllTo_L","chkItem");}  
 
(function ($) {
    jQuery.fn.LSelect_RVSelect = function (selLeft, ulVirtualSel, img_L_AllTo_R, img_L_To_R, img_R_To_L, img_R_AllTo_L, chkName, selOpIsRemovable, liIsRemovable) {
        $("#" + img_L_AllTo_R + ",#" + img_L_To_R + ",#" + img_R_To_L + ",#" + img_R_AllTo_L).css("cursor", "pointer");
        if (typeof (selOpIsRemovable) == "undefined") {
            selOpIsRemovable = true;
        }
        if (typeof (liIsRemovable) == "undefined") {
            liIsRemovable = true;
        }
        //左边的select的option双击  
        $("#" + selLeft).live("dblclick", function () {
            var obj = $("#" + selLeft + " :selected");
            selToUL(obj);
        });
        //click '>|'  
        $("#" + img_L_AllTo_R).click(function () {
            var obj = $("#" + selLeft + " option");
            selToUL(obj);
        });
        //click '>'  
        $("#" + img_L_To_R).click(function () {
            var obj = $("#" + selLeft + " :selected");
            selToUL(obj);
        });
        //右边的li单击, 设置样式
        $("#" + ulVirtualSel + " li").live("click", function () {
            $(this).toggleClass("ulVirtualSel_Click");
        });
        $("#" + ulVirtualSel + " li").live("dblclick", function () {
            var obj = $(this);
            ulToSel(obj);
        });

        //click '<'  
        $("#" + img_R_To_L).click(function () {
            var obj = $("#" + ulVirtualSel + " li[class='ulVirtualSel_Click']");
            ulToSel(obj);
        });
        //click '|<'  
        $("#" + img_R_AllTo_L).click(function () {
            var obj = $("#" + ulVirtualSel + " li");
            ulToSel(obj);
        });
        //select to ul  
        function selToUL(jqObj) {
            jqObj.reverseSelf().each(function () {
                var selVal = $(this).val();
                if (!isExtInUL(selVal, ulVirtualSel)) {
                    var html = "<li><input name='" + chkName + "' type='checkbox' value='" + selVal + "'><span>" + $(this).text() + "</span></li>";
                    $("#" + ulVirtualSel).prepend(html);
                }
                if (selOpIsRemovable) {
                    $(this).remove();
                }
            });
        }
        //ul to select  
        function ulToSel(jqObj) {
            jqObj.reverseSelf().find(":checkbox").each(function () {
                var selVal = $(this).val();
                if (!isExtInSel(selVal, selLeft)) {
                    var html = "<option value='" + selVal + "'>" + $(this).parent().find("span").text() + "</option>";
                    $("#" + selLeft).prepend(html);
                }
                if (liIsRemovable) {
                    $(this).parent().remove();
                }
            });
        }
        //判断选中值是否在ul中  
        function isExtInUL(selVal, target) {
            var result = false;
            $("#" + target + " :checkbox").each(function () {
                if ($(this).val() == selVal) {
                    result = true;
                }
            });
            return result;
        }
        //判断选中值是否在select中  
        function isExtInSel(selVal, target) {
            var isExist = false;
            $("#" + target + " option").each(function () {
                if (selVal == $(this).val()) {
                    isExist = true;
                }
            });
            return isExist;
        }
    }
})(jQuery);