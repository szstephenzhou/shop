package com.zjh.zshop.backend.controller;

import com.zjh.zshop.pojo.ProductType;
import com.zjh.zshop.service.ProductTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

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
@Autowired
private ProductTypeService productTypeService;
    @RequestMapping("/findAll")
    public String findAll(Model model){
    List<ProductType> typeList=   productTypeService.findAll();
    model.addAttribute("typeList",typeList);
        return "productTypeManager";
    }
}
