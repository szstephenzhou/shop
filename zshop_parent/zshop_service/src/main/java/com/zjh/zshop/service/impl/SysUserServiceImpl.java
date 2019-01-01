package com.zjh.zshop.service.impl;

import com.zjh.zshop.dao.SysUserDao;
import com.zjh.zshop.pojo.SysUser;
import com.zjh.zshop.service.SysUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * @Description: java类作用描述
 * @Author: zjh
 * @CreateDate: 2018/12/31 0031$ 下午 8:18$
 * @UpdateRemark: 修改内容
 * @Version: 1.0
 */
@Service
@Transactional(propagation = Propagation.REQUIRED, rollbackFor = Exception.class)
public class SysUserServiceImpl implements SysUserService {
    @Autowired
    private SysUserDao sysUserDao;

    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public List<SysUser> selectAll() {
        return sysUserDao.selectAll();
    }


}
