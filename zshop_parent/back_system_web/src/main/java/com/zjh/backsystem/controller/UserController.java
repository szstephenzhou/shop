package com.zjh.backsystem.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * @Description: java类作用描述
 * @Author: zjh
 * @CreateDate: 2019/1/6 0006$ 下午 7:49$
 * @UpdateRemark: 修改内容
 * @Version: 1.0
 */
@Controller("/User")
public class UserController {

    @RequestMapping("pageList")
    public String pageList() {
        return "pageList";
    }
}
