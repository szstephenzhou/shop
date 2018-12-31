package com.zjh.zshop.backend.controller;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.zjh.zshop.constant.PaginatonConstant;
import com.zjh.zshop.pojo.ProductType;
import com.zjh.zshop.service.ProductTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.ObjectUtils;
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
    public String findAll(Integer pageNum, Integer pageSize, Model model) {
        if (ObjectUtils.isEmpty(pageNum)) {
            pageNum = PaginatonConstant.PAGE_NUM;
        }
        if (ObjectUtils.isEmpty(pageSize)) {
            pageSize = PaginatonConstant.PAGE_SIZE;
        }
        //设置分页
        PageHelper.startPage(pageNum, pageSize);
//查询所有数据
        List<ProductType> typeList = productTypeService.findAll();
//把查询的结构封装到PageInfo对象中
        PageInfo<ProductType> pageInfo = new PageInfo<>(typeList);
//把所有的结果接口分页封装到一起

        model.addAttribute("pageInfo", pageInfo);
        return "productTypeManager";
    }
}
