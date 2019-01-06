//插件名称: UpDownSelOption  
//作    者: Kian Wang
//功能说明: 设置指定的select的option的上下移动.  
//输入参数: 上下图片的id, 需要移动option的select的id
//调用示例: $(function(){ $.fn.UpDownSelOption("imgUp", "imgDown", "selRight"); });  
 
(function ($) {
    jQuery.fn.UpDownSelOption = function (imgUp, imgDown, up_down_targetId) {
        $("#" + imgUp + ",#" + imgDown).css("cursor", "pointer");
        var $sel = $("#" + up_down_targetId);
        $("#" + imgUp).click(function () {
            if ($sel.find("option:selected").length == 0) {
                return;
            }
            if ($sel.find("option:selected:first").prev().length == 0) {
                return;
            }
            $sel.find("option:selected:first").prev().insertAfter($sel.find("option:selected:last"));
        });
        $("#" + imgDown).click(function () {
            if ($sel.find("option:selected").length == 0) {
                return;
            }
            if ($sel.find("option:selected:last").next().length == 0) {
                return;
            }
            $sel.find("option:selected:last").next().insertBefore($sel.find("option:selected:first"));
        });
    }
})(jQuery);