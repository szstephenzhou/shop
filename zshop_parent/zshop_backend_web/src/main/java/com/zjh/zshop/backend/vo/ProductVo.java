package com.zjh.zshop.backend.vo;

import org.springframework.web.multipart.commons.CommonsMultipartFile;

/**
 * @Description: 产品用于接受前台表单form提交的产生序列号
 * @Author: zjh
 * @CreateDate: 2019/1/1 0001$ 下午 9:12$
 * @UpdateRemark: 修改内容
 * @Version: 1.0
 */
public class ProductVo {
    private     String name;
    private Double price;
    private CommonsMultipartFile file;
    private  Integer productTypeId;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public CommonsMultipartFile getFile() {
        return file;
    }

    public void setFile(CommonsMultipartFile file) {
        this.file = file;
    }

    public Integer getProductTypeId() {
        return productTypeId;
    }

    public void setProductTypeId(Integer productTypeId) {
        this.productTypeId = productTypeId;
    }
}
