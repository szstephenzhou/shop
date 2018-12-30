package com.zjh.zshop.dao.pojo;

import java.io.Serializable;

/**
 * @Description: 产品类型model类 pojo
 * @Author: zjh
 * @CreateDate: 2018/12/30 0030$ 下午 8:59$
 * @UpdateRemark: 修改内容
 * @Version: 1.0
 */
// Serializable 实例化这个对象
public class productType implements Serializable {

    private Integer id;
    private  String name;
    private  Integer status;


    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }



}
