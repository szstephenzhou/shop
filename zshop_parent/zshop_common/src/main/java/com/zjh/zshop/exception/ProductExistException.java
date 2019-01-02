package com.zjh.zshop.exception;

/**
 * @Description: java类作用描述
 * @Author: zjh
 * @CreateDate: 2019/1/1 0001$ 上午 10:25$
 * @UpdateRemark: 修改内容
 * @Version: 1.0
 */
public class ProductExistException extends  Exception {
    public ProductExistException() {
        super();
    }

    public ProductExistException(String message) {
        super(message);
    }

    public ProductExistException(String message, Throwable cause) {
        super(message, cause);
    }

    public ProductExistException(Throwable cause) {
        super(cause);
    }

    protected ProductExistException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
