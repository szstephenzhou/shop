package com.zjh.zshop.service.impl;

import com.zjh.zshop.dao.ProductDao;
import com.zjh.zshop.dto.ProductDto;
import com.zjh.zshop.exception.ProductExistException;
import com.zjh.zshop.pojo.Product;
import com.zjh.zshop.pojo.ProductType;
import com.zjh.zshop.service.ProductService;
import com.zjh.zshop.util.StringUtils;
import org.apache.commons.beanutils.PropertyUtils;
import org.apache.commons.fileupload.FileUploadException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StreamUtils;

import java.io.FileOutputStream;
import java.io.IOException;
import java.lang.reflect.InvocationTargetException;

/**
 * @Description: java类作用描述
 * @Author: zjh
 * @CreateDate: 2019/1/1 0001$ 下午 9:41$
 * @UpdateRemark: 修改内容
 * @Version: 1.0
 */

@Service
@Transactional(propagation = Propagation.REQUIRED, rollbackFor = Exception.class)
public class ProductServiceImpl implements ProductService {
    @Autowired
    private ProductDao productDao;
    @Override
    public void add(ProductDto productDto) throws ProductExistException {
        String fileName= StringUtils.renameFileName( productDto.getFileName());
        String filePath=productDto.getUploadPath()+"/"+fileName;
        //上传文件
        try {
            StreamUtils.copy( productDto.getInputStream(),new FileOutputStream(filePath ));
        } catch (IOException e) {
            throw  new ProductExistException("文件上传异常"+e.getMessage());
        }
        Product product =new Product();
        try {
            PropertyUtils.copyProperties(product,productDto);
            product.setImage(filePath);
            ProductType productType=new ProductType();
            productType.setId(productDto.getProductTypeId());
            product.setProductType(productType );

            productDao.add(product);
        } catch ( Exception e) {
            e.printStackTrace();
        }


    }
}
