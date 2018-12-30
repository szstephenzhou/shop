package com.zjh.zshop.service;

import com.zjh.zshop.dao.ProductTypeDao;
import com.zjh.zshop.dao.pojo.productType;

import java.util.List;

public interface ProductTypeService {

    /**
     * 查找所有商品类型信息
     */
    public List<productType> findAll();
}