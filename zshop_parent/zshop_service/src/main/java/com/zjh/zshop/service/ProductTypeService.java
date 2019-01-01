package com.zjh.zshop.service;

import com.zjh.zshop.exception.ProductTypeExistException;
import com.zjh.zshop.pojo.ProductType;

import java.util.List;

public interface ProductTypeService {

    /**
     * 查找所有商品类型信息
     */
    public List<ProductType> findAll();
    /**
     * 添加商品类型信息
     *  判断名称是否一致
     */
   public void add(String name) throws ProductTypeExistException;

   public  ProductType findById(Integer id);
}
