package com.zjh.zshop.system.controller;

import org.aspectj.apache.bcel.generic.RET;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/Login")
public class Login {

    @RequestMapping("Index")
    public  String Index()
    {
        return  "Home";
    }
}
