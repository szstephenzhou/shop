package com.zjh.zshop.backend.controller;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.zjh.zshop.constant.PaginatonConstant;
import com.zjh.zshop.constant.ResponseStatusConstant;
import com.zjh.zshop.exception.ProductTypeExistException;
import com.zjh.zshop.pojo.ProductType;
import com.zjh.zshop.service.ProductTypeService;
import com.zjh.zshop.util.ResponseResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.ObjectUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

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

        System.out.println(pageInfo.getPageSize());
        model.addAttribute("pageInfo", pageInfo);
        return "productTypeManager";
    }

    @RequestMapping("/add")
    @ResponseBody
    public ResponseResult add(String name) {

        try {
            productTypeService.add(name);
            return ResponseResult.success();
        } catch (ProductTypeExistException e) {
            return ResponseResult.fail(e.getMessage());
        }
    }


    /**
     * 通过id查询产品类型详细信息
     *
     * @param id 编码
     * @return 类型的json包
     */
    @RequestMapping("/findById")
    @ResponseBody
    public ResponseResult findById(Integer id) {

        ProductType productType = productTypeService.findById(id);
        if (null != productType) {
            return ResponseResult.success(productType);
        } else {
            return ResponseResult.fail("该产品类型不存在了！");
        }
    }

    @RequestMapping("/modifyName")
    @ResponseBody
    public ResponseResult modifyName(int id, String name) {

        try {
            productTypeService.modifyName(id, name);
            return ResponseResult.success("修改成功！");
        } catch (ProductTypeExistException e) {
            return ResponseResult.fail(e.getMessage());
        }
    }
    @RequestMapping("/deleteById")
    @ResponseBody
    public ResponseResult deleteById(int id) {

        try {
            productTypeService.deleteById(id);
            return ResponseResult.success("删除成功！");
        } catch (Exception e) {
            return ResponseResult.fail(e.getMessage());
        }
    }

    @RequestMapping("/modifyStatus")
    @ResponseBody
    public ResponseResult modifyStatus(int id,int status) {

        try {
            productTypeService.modifyStatus(id,status);
            return ResponseResult.success("修改成功！");
        } catch (Exception e) {
            return ResponseResult.fail(e.getMessage());
        }
    }


}
