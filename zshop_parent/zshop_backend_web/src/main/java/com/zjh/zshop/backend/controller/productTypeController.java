package com.zjh.zshop.backend.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * @Description: java类作用描述
 * @Author: zjh
 * @CreateDate: 2018/12/30 0030$ 下午 8:48$
 * @UpdateRemark: 修改内容
 * @Version: 1.0
 */

@Controller
@RequestMapping("/backend/productType")
public class productTypeController {
    @RequestMapping("findAll")
    public String findAll(){

        return "productTypeManager";
    }
}
