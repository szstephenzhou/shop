package com.zjh.zshop.exception;

/**
 * @Description: java类作用描述
 * @Author: zjh
 * @CreateDate: 2019/1/1 0001$ 上午 10:25$
 * @UpdateRemark: 修改内容
 * @Version: 1.0
 */
public class ProductTypeExistException extends  Exception {
    public ProductTypeExistException() {
        super();
    }

    public ProductTypeExistException(String message) {
        super(message);
    }

    public ProductTypeExistException(String message, Throwable cause) {
        super(message, cause);
    }

    public ProductTypeExistException(Throwable cause) {
        super(cause);
    }

    protected ProductTypeExistException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
