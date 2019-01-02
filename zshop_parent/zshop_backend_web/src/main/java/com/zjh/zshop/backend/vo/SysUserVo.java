package com.zjh.zshop.backend.vo;

/**
 * @Description: java类作用描述
 * @Author: zjh
 * @CreateDate: 2019/1/2 0002$ 下午 9:32$
 * @UpdateRemark: 修改内容
 * @Version: 1.0
 */
public class SysUserVo {
    private Integer id;
    private String name;
    private String login_name;
    private String userphone;
    private String email;
    private Integer margerRole;

    @Override
    public String toString() {
        return "SysUserVo{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", login_name='" + login_name + '\'' +
                ", userphone='" + userphone + '\'' +
                ", email='" + email + '\'' +
                ", margerRole=" + margerRole +
                '}';
    }

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

    public String getLogin_name() {
        return login_name;
    }

    public void setLogin_name(String login_name) {
        this.login_name = login_name;
    }

    public String getUserphone() {
        return userphone;
    }

    public void setUserphone(String userphone) {
        this.userphone = userphone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Integer getMargerRole() {
        return margerRole;
    }

    public void setMargerRole(Integer margerRole) {
        this.margerRole = margerRole;
    }
}
