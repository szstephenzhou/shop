package com.zjh.zshop.backend.controller;


import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.zjh.zshop.constant.PaginatonConstant;
import com.zjh.zshop.pojo.SysUser;
import com.zjh.zshop.service.SysUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.ObjectUtils;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;


@Controller
@RequestMapping("/backend/sysuser")
public class SystemuserController {
    @Autowired
    private SysUserService sysUserService;

    @RequestMapping("/login")
    public String login() {

        return "main";
    }

    @RequestMapping("/selectAll")
    public String selectAll(Integer pageNum, Integer pageSize, Model model) {
        if (ObjectUtils.isEmpty(pageNum)) {
            pageNum = PaginatonConstant.PAGE_NUM;
        }
        if (ObjectUtils.isEmpty(pageSize)) {
            pageSize = PaginatonConstant.PAGE_SIZE;
        }

        PageHelper.startPage(pageNum, pageSize);
        List<SysUser> sysUserList = sysUserService.selectAll();
        PageInfo<SysUser> pageInfo = new PageInfo<>(sysUserList);
        model.addAttribute("pageInfo", pageInfo);


        return "sysUserManager";
    }


}
