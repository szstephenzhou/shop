package com.zjh.zhop.system.controller;

import org.aspectj.apache.bcel.generic.RET;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/login")
public class login {

    @RequestMapping("Index")
    public  String Index()
    {
        return  "Home";
    }
}
