package com.zjh.zshop.dao;

import com.zjh.zshop.pojo.Role;
import com.zjh.zshop.pojo.SysUser;

import java.util.List;

public interface SysUserDao {

    public List<SysUser> selectAll();

   public SysUser findById(Integer id);

    public  List<Role> getAllRoles();
}
