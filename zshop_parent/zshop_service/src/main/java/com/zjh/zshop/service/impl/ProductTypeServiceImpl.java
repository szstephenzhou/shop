package com.zjh.zshop.service.impl;

import com.zjh.zshop.dao.ProductTypeDao;
import com.zjh.zshop.dao.pojo.productType;
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
    public List<productType> findAll() {
        return productTypeDao.selectAll();
    }
}
