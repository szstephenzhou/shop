package com.zjh.zshop.dao;



import com.zjh.zshop.pojo.ProductType;

import java.util.List;

/**
 * @Description: java类作用描述
 * @Author: zjh
 * @CreateDate: 2018/12/30 0030$ 下午 9:10$
 * @UpdateRemark: 修改内容
 * @Version: 1.0
 */
public interface ProductTypeDao {

    /**
     * 查找所有的商品类型
      * @return
     */
    public List<ProductType> selectAll();
}
