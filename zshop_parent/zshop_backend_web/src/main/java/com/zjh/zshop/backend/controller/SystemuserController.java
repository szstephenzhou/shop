package com.zjh.zshop.backend.controller;

import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.zjh.zshop.backend.vo.SysUserVo;
import com.zjh.zshop.constant.PaginatonConstant;
import com.zjh.zshop.pojo.Role;
import com.zjh.zshop.pojo.SysUser;
import com.zjh.zshop.service.SysUserService;
import com.zjh.zshop.util.ResponseResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.ObjectUtils;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

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

    /**
     * 打开默认页面的展示信息
     *
     * @param pageNum  当前页码
     * @param pageSize 页数
     * @param model    页面model 存储页面上的调用
     * @return 返回跳转到页面
     */
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

    /**
     * 页面默认的用户角色信息获取
     *
     * @return
     */
    @ModelAttribute("Roles")
    public List<Role> getUserRoles() {
        return sysUserService.getAllRoles();
        //   return  new Role();
    }

    /**
     * 修改用户信息的时候 查看用户详情
     *
     * @param id
     * @return
     */
    @RequestMapping("/findById")
    @ResponseBody
    public ResponseResult findById(Integer id) {
        SysUser sysUser = sysUserService.findById(id);
        if (null != sysUser) {
            return ResponseResult.success(sysUser);
        } else {
            return ResponseResult.fail("id错误，请联系管理员");
        }
    }


    /**
     * 修改用户信息
     *
     * @param sysUserVo 页面提交的model
     * @return
     */
    @RequestMapping("/edit")
    public String edit(SysUserVo sysUserVo) {
        System.out.println(sysUserVo.toString());

        return "forward:selectAll";
    }


}
