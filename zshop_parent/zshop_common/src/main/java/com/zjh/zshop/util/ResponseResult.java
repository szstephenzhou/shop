package com.zjh.zshop.util;

import com.zjh.zshop.constant.ResponseStatusConstant;

/**
 * @Description: java类作用描述
 * @Author: zjh
 * @CreateDate: 2019/1/1 0001$ 上午 10:57$
 * @UpdateRemark: 修改内容
 * @Version: 1.0
 */
public class ResponseResult {


    /**
     * 返回的//状态
     */
    private int status;
    /**
     * 返回的消息
     */
    private String message;
    /**
     * 返回的数据
     */
    private Object data;

    public ResponseResult() {

    }

    public ResponseResult(int status, String message, Object data) {
        this.status = status;
        this.message = message;
        this.data = data;
    }

    /**
     * 返回成功的result模型
     *
     * @param data
     * @return
     */
    public static ResponseResult success(Object data) {
        return new ResponseResult(ResponseStatusConstant.RESPONSE_STATUS_SUCESS, "success", data);
    }
    public static ResponseResult success( ) {
        return new ResponseResult(ResponseStatusConstant.RESPONSE_STATUS_SUCESS, "success", null);
    }

    public static ResponseResult success(String msg ) {
        return new ResponseResult(ResponseStatusConstant.RESPONSE_STATUS_SUCESS, msg, null);
    }
    /**
     * 返回失败的模型
     *
     * @param msg 原因
     * @return
     */
    public static ResponseResult fail(String msg) {
        return new ResponseResult(ResponseStatusConstant.RESPONSE_STATUS_FAIL, msg, "");
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }
}
