package com.zjh.zshop.dto;

import java.io.InputStream;

/**
 * @Description: java类作用描述
 * @Author: zjh
 * @CreateDate: 2019/1/1 0001$ 下午 9:27$
 * @UpdateRemark: 修改内容
 * @Version: 1.0
 */
public class ProductDto {
    private String name;
    private Double price;

    private Integer productTypeId;

    private InputStream inputStream;//文件流
    private String fileName;//文件名
    private String uploadPath;//文件路径

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

    public Integer getProductTypeId() {
        return productTypeId;
    }

    public void setProductTypeId(Integer productTypeId) {
        this.productTypeId = productTypeId;
    }

    public InputStream getInputStream() {
        return inputStream;
    }

    public void setInputStream(InputStream inputStream) {
        this.inputStream = inputStream;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getUploadPath() {
        return uploadPath;
    }

    public void setUploadPath(String uploadPath) {
        this.uploadPath = uploadPath;
    }
}
