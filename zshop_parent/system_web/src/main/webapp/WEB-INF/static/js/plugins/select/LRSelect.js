//插件名称: LRSelect  
//作    者: Kian Wang
//功能说明: 设置左右select的option的互相移动. 必须保证每个option的value的唯一性和optgroup的label的唯一性.  
//输入参数: 1-6:左select,右select ,>| ,> ,< , |< 这六个DOM元素的Id  
//          7: 左select是否可移动  (无此参数则为可移动---true)  
//          8：右select是否可移动  (无此参数则为可移动---true)  
//调用示例: $(function(){ $.fn.LRSelect("selLeft", "selRight", "img_L_AllTo_R", "img_L_To_R", "img_R_To_L", "img_R_AllTo_L"); });      
 
(function ($) {
    jQuery.fn.LRSelect = function (selLeft, selRight, img_L_AllTo_R, img_L_To_R, img_R_To_L, img_R_AllTo_L, LIsRemovable, RIsRemovable) {
        $("#" + img_L_AllTo_R + ",#" + img_L_To_R + ",#" + img_R_To_L + ",#" + img_R_AllTo_L).css("cursor", "pointer");
        if (typeof (LIsRemovable) == "undefined") {
            LIsRemovable = true;
        }
        if (typeof (RIsRemovable) == "undefined") {
            RIsRemovable = true;
        }
        $("#" + selLeft).dblclick(function () {
            LRSelect.movePart(selLeft, selRight, true);
        });
        $("#" + selRight).dblclick(function () {
            LRSelect.movePart(selRight, selLeft, false);
        });
        $("#" + img_L_AllTo_R).click(function () {
            LRSelect.moveAll(selLeft, selRight, true);
        });
        $("#" + img_L_To_R).click(function () {
            LRSelect.movePart(selLeft, selRight, true);
        });
        $("#" + img_R_To_L).click(function () {
            LRSelect.movePart(selRight, selLeft, false);
        });
        $("#" + img_R_AllTo_L).click(function () {
            LRSelect.moveAll(selRight, selLeft, false);
        });
        LRSelect = {};
        LRSelect.movePart = function (source, target, sourceIsLeft) {
            var obj = $("#" + source + " :selected");
            LRSelect.commonMove(obj, source, target, sourceIsLeft);
        }
        LRSelect.moveAll = function (source, target, sourceIsLeft) {
            var obj = $("#" + source + " option");
            LRSelect.commonMove(obj, source, target, sourceIsLeft);
        }
        LRSelect.commonMove = function (jqObj, source, target, sourceIsLeft) {
            jqObj.reverseSelf().each(function () {
                var selVal = $(this).val();
                var selfOptgroupLab = $(this).parent().attr("label");

                var haveGroup = false;
                var targetHaveSameGroup = true;
                if (typeof (selfOptgroupLab) != "undefined") {
                    haveGroup = true;
                    if ($("#" + target).find("optgroup[label='" + selfOptgroupLab + "']").length == 0) {
                        targetHaveSameGroup = false;
                    }
                }
                //判断源是否可移  
                var sourceIsRemovable = (sourceIsLeft && LIsRemovable) || (!sourceIsLeft && RIsRemovable);
                //如果对方没有这个值  
                if (!LRSelect.checkValInSelect(selVal, target)) {
                    //如果自身都没有optgroup, 对方直接加自己就好了.    
                    if (!haveGroup) {
                        //如果源是可移动的
                        if (sourceIsRemovable) {
                            $("#" + target).prepend($(this));
                        } else {
                            $("#" + target).prepend($(this).clone());
                        }
                    }
                        //如果自身有optgroup    
                    else {
                        //如果对方已有相同的optgroup    
                        if (targetHaveSameGroup) {
                            //如果源是可移动的  
                            if (sourceIsRemovable) {
                                $("#" + target).find("optgroup[label='" + selfOptgroupLab + "']").prepend($(this));
                            } else {
                                $("#" + target).find("optgroup[label='" + selfOptgroupLab + "']").prepend($(this).clone());
                            }
                        } else {
                            $("#" + target).prepend($(this).parent().clone());
                            $("#" + target + " optgroup[label='" + selfOptgroupLab + "'] option[value!='" + selVal + "']").remove();
                            //如果源是可移动的  
                            if (sourceIsRemovable) {
                                $(this).remove();
                            }
                        }
                        //如果源是可移动的  
                        if (sourceIsRemovable) {
                            //如果给了对方之后, 自身的optgroup为空, 则删除自己的optgroup  
                            if ($("#" + source).find("optgroup[label='" + selfOptgroupLab + "'] option").length == 0) {
                                $("#" + source).find("optgroup[label='" + selfOptgroupLab + "']").remove();
                            }
                        }
                    }
                }
                    //如果对方有这个值了， 在自己能移动的情况下， 删除此值  
                else {
                    //如果自身都没有optgroup   
                    if (!haveGroup) {
                        //如果源是可移动的  
                        if (sourceIsRemovable) {
                            $(this).remove();
                        }
                    } else {
                        //如果源是可移动的  
                        if (sourceIsRemovable) {
                            $(this).remove();
                            //如果给了对方之后, 自身的optgroup为空, 则删除自己的optgroup  
                            if ($("#" + source).find("optgroup[label='" + selfOptgroupLab + "'] option").length == 0) {
                                $("#" + source).find("optgroup[label='" + selfOptgroupLab + "']").remove();
                            }
                        }
                    }
                }
            });
            $("#" + source + " option").each(function () {
                $(this).get(0).selected = false;
            });
            $("#" + target + " option").each(function () {
                $(this).get(0).selected = false;
            });
        }
        //判断一个值,在select中是否已存在        
        LRSelect.checkValInSelect = function (val, selectId) {
            var isExist = false;
            $("#" + selectId + " option").each(function () {
                if (val == $(this).val()) {
                    isExist = true;
                }
            });
            return isExist;
        }
    }
})(jQuery);
(function ($) {
    $.fn.reverseSelf = function () {
        var arr = [];
        for (var i = this.length - 1; i >= 0; i--) {
            arr.push(this.get(i));
        }
        return $(arr);
    }
})(jQuery);