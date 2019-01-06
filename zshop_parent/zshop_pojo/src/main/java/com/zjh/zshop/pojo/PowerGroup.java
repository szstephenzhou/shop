package com.zjh.zshop.pojo;

import java.util.Date;

/**
 * @Description: java类作用描述
 * @Author: zjh
 * @CreateDate: 2019/1/6 0006$ 下午 9:37$
 * @UpdateRemark: 修改内容
 * @Version: 1.0
 */
public class PowerGroup {

    /**
     * 权限组名称
     */
    private int PowerGroup_ID;
    /**
     * 权限存储JSON字符串
     */
    private String PowerGroup_Name;
    /**
     * 权限存储JSON字符串
     */
    private String PowerGroup_Value;
    /**
     * 权限 1启用 0禁用
     */
    private int PowerGroup_Enable;
    /**
     * 使用数量统计
     */
    private int PowerGroup_AdminCount;
    /**
     * 权限组备注
     */
    private String PowerGroup_Remark;
    /**
     * 新增权限组的操作员
     */
    private int Admin_ID;

    /**
     *  权限组分类
     */
    private int PowerGroup_Level;

    /**
     * TopID
     */
    private int Admin_TopID;
    /**
     * 创建时间
     */
    private Date PowerGroup_CreateTime;
    /**
     * 新增权限组的操作员
     */
    private String Admin_Name;
    /**
     * 权限组创建人账号
     */
    private String Admin_Account;


    public int getPowerGroup_ID() {
        return PowerGroup_ID;
    }

    public void setPowerGroup_ID(int powerGroup_ID) {
        PowerGroup_ID = powerGroup_ID;
    }

    public String getPowerGroup_Name() {
        return PowerGroup_Name;
    }

    public void setPowerGroup_Name(String powerGroup_Name) {
        PowerGroup_Name = powerGroup_Name;
    }

    public String getPowerGroup_Value() {
        return PowerGroup_Value;
    }

    public void setPowerGroup_Value(String powerGroup_Value) {
        PowerGroup_Value = powerGroup_Value;
    }

    public int getPowerGroup_Enable() {
        return PowerGroup_Enable;
    }

    public void setPowerGroup_Enable(int powerGroup_Enable) {
        PowerGroup_Enable = powerGroup_Enable;
    }

    public int getPowerGroup_AdminCount() {
        return PowerGroup_AdminCount;
    }

    public void setPowerGroup_AdminCount(int powerGroup_AdminCount) {
        PowerGroup_AdminCount = powerGroup_AdminCount;
    }

    public String getPowerGroup_Remark() {
        return PowerGroup_Remark;
    }

    public void setPowerGroup_Remark(String powerGroup_Remark) {
        PowerGroup_Remark = powerGroup_Remark;
    }

    public int getAdmin_ID() {
        return Admin_ID;
    }

    public void setAdmin_ID(int admin_ID) {
        Admin_ID = admin_ID;
    }

    public int getPowerGroup_Level() {
        return PowerGroup_Level;
    }

    public void setPowerGroup_Level(int powerGroup_Level) {
        PowerGroup_Level = powerGroup_Level;
    }

    public int getAdmin_TopID() {
        return Admin_TopID;
    }

    public void setAdmin_TopID(int admin_TopID) {
        Admin_TopID = admin_TopID;
    }

    public Date getPowerGroup_CreateTime() {
        return PowerGroup_CreateTime;
    }

    public void setPowerGroup_CreateTime(Date powerGroup_CreateTime) {
        PowerGroup_CreateTime = powerGroup_CreateTime;
    }

    public String getAdmin_Name() {
        return Admin_Name;
    }

    public void setAdmin_Name(String admin_Name) {
        Admin_Name = admin_Name;
    }

    public String getAdmin_Account() {
        return Admin_Account;
    }

    public void setAdmin_Account(String admin_Account) {
        Admin_Account = admin_Account;
    }
}
