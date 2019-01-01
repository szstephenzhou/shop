package com.zjh.zshop.dao;


import com.zjh.zshop.pojo.ProductType;
import org.apache.ibatis.annotations.Param;

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
     *
     * @return
     */
    public List<ProductType> selectAll();

    /**
     * 根据ID查询产品类型
     *
     * @param id
     * @return
     */
    public ProductType selectById(int id);

    /**
     * 根据产品名称来查询
     *
     * @param name
     * @return
     */
    public ProductType selectByName(String name);

    /**
     * 添加商品类型
     *
     * @param name 类型名称
     * @param status 状态
     */
    public void Insert(@Param("name") String name,@Param("status") int status);

    /**
     * 根据id修改名称
     * @param id
     * @param name
     */
    public void updateNamebyId(@Param("id") int id, @Param("name") String name);

    /**
     * 根据id修改状态
     * @param id
     * @param status
     */
    public void updateStatus(@Param("id") int id, @Param("status") int status);

    /**
     * 根据id删除
     * @param id
     */
    public void deleteById(int id);
}
