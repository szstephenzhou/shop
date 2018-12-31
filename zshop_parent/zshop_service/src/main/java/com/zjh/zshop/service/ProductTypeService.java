package com.zjh.zshop.service;

import com.zjh.zshop.pojo.ProductType;

import java.util.List;

public interface ProductTypeService {

    /**
     * 查找所有商品类型信息
     */
    public List<ProductType> findAll();
}
