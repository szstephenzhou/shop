package com.zjh.zshop.backend.controller;

import com.zjh.zshop.backend.vo.ProductVo;
import com.zjh.zshop.dto.ProductDto;
import com.zjh.zshop.pojo.ProductType;
import com.zjh.zshop.service.ProductService;
import com.zjh.zshop.service.ProductTypeService;
import com.zjh.zshop.util.ResponseResult;
import org.apache.commons.beanutils.PropertyUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpSession;
import java.lang.reflect.InvocationTargetException;
import java.util.List;

/**
 * @Description: 产品控制器
 * @Author: zjh
 * @CreateDate: 2019/1/1 0001$ 下午 8:14$
 * @UpdateRemark: 修改内容
 * @Version: 1.0
 */
@Controller
@RequestMapping("/backend/ProductManager")
public class ProductManagerController {
    @Autowired
    ProductTypeService productTypeService;

    @Autowired
    ProductService productService;

    //    有效的产品类型检索
    @ModelAttribute("productTypes")
    public List<ProductType> getEnableProductTypes() {
        List<ProductType> productTypes = productTypeService.getEnableProductTypes();
        return productTypes;
    }

    @RequestMapping("/findAll")
    public String findAll() {
        return "productManager";
    }

    @RequestMapping("/add")
    public String add(ProductVo productVo, HttpSession session, Model model) {

        String uploadPath = session.getServletContext().getRealPath("WEB-INF/upload");

        try {
            ProductDto productDto = new ProductDto();
            PropertyUtils.copyProperties(productDto, productVo);//相同属性拷贝
            productDto.setInputStream(productVo.getFile().getInputStream());
            productDto.setFileName(productVo.getFile().getOriginalFilename());
            productDto.setUploadPath(uploadPath);

            productService.add(productDto);

            model.addAttribute("successMsg", "添加成功");
        } catch (Exception e) {
            e.printStackTrace();
            model.addAttribute("errorMsg", "添加失败" + e.getMessage());
        }

        return "forward:findAll";
    }
}
