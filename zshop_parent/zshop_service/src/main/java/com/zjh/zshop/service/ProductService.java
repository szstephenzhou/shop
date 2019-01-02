package com.zjh.zshop.service;

import com.zjh.zshop.dto.ProductDto;
import com.zjh.zshop.exception.ProductExistException;
import org.apache.commons.fileupload.FileUploadException;

public interface ProductService {

    public void add(ProductDto productDto) throws ProductExistException, FileUploadException;
}
