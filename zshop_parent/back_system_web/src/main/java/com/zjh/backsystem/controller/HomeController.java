package com.zjh.backsystem.controller;

import org.omg.CosNaming.NamingContextExtPackage.StringNameHelper;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;


/**
 * @Description: 主页显示控制器
 * @Author: zjh
 * @CreateDate: 2019/1/6 0006$ 下午 6:20$
 * @UpdateRemark: 修改内容
 * @Version: 1.0
 */
@Controller
@RequestMapping("/Home")
public class HomeController {

//    登录后的模板页面
    @RequestMapping("/Index")
    public String Index() {
        System.out.println("xxxx");
        return "Home/Home";
    }

//    模版页面打开的首页
    @RequestMapping("/Main")
    public String Main() {
        System.out.println("xxxx");
        return "Home/Main";
    }


}
