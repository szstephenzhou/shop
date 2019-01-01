package com.zjh.zshop.service.impl;

import com.zjh.zshop.constant.ProductTypeConstant;
import com.zjh.zshop.dao.ProductTypeDao;
import com.zjh.zshop.exception.ProductTypeExistException;
import com.zjh.zshop.pojo.ProductType;
import com.zjh.zshop.service.ProductTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * @Description: java类作用描述
 * @Author: zjh
 * @CreateDate: 2018/12/30 0030$ 下午 9:47$
 * @UpdateRemark: 修改内容
 * @Version: 1.0
 */
@Service
@Transactional(propagation = Propagation.REQUIRED, rollbackFor = Exception.class)
public class ProductTypeServiceImpl implements ProductTypeService {

    @Autowired
    private ProductTypeDao productTypeDao;

    //    支持事务，配置为只读
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public List<ProductType> findAll() {
        return productTypeDao.selectAll();
    }

    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public void add(String name) throws ProductTypeExistException {
        ProductType productType = productTypeDao.selectByName(name);
        if (null != productType) {
            throw new ProductTypeExistException("商品类型已经存在,请换个名字试下");

        } else {
            productTypeDao.Insert(name, ProductTypeConstant.ProductType_ENABLE);
        }
    }
    @Override
    public ProductType findById(Integer id){
        return  productTypeDao.selectById(id);
    }

    @Override
    public void modifyName(Integer id,String  name) throws  ProductTypeExistException {
        ProductType productType = productTypeDao.selectByName(name);
        if (null != productType) {
             throw new ProductTypeExistException("商品类型已经存在,请换个名字试下");
        } else {
            productTypeDao.updateNamebyId(id,   name);
        }
    }
    @Override
    public void deleteById(Integer id)    {
         productTypeDao.deleteById(id);

    }



}
