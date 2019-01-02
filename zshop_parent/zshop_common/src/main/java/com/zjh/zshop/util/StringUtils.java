package com.zjh.zshop.util;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Random;

/**
 * @Description: java类作用描述
 * @Author: zjh
 * @CreateDate: 2019/1/1 0001$ 下午 9:44$
 * @UpdateRemark: 修改内容
 * @Version: 1.0
 */
public class StringUtils {
    public static String renameFileName(String fileName) {
        int dotIndex = fileName.lastIndexOf(".");
        String suffix = fileName.substring(dotIndex);
        return new SimpleDateFormat("yyyyMMddHHmmss").format(new Date()) + new Random().nextInt(100) + suffix;
    }
}
