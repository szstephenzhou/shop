package com.zjh.backsystem.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * @Description: java类作用描述
 * @Author: zjh
 * @CreateDate: 2019/1/6 0006$ 下午 8:58$
 * @UpdateRemark: 修改内容
 * @Version: 1.0
 */
@Controller
@RequestMapping("PowerGroup")
public class PowerGroupController {

    @RequestMapping("Index")
    public  String Index()
    {
        return  "PowerGroup/Index";
    }
    @RequestMapping("GetPowerGroupList")
    public String GetPowerGroupList(int pageIndex, int pageSize, String conditionParam) {


        return "GetPowerGroupList";
    }
}
