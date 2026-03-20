package com.zoo;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.zoo.mapper")  // 扫描Mapper接口
public class ZooApplication {
    public static void main(String[] args) {
        SpringApplication.run(ZooApplication.class, args);
        System.out.println("🐼 可爱风动物园管理系统启动成功！访问地址：http://localhost:8080/html/login.html");
    }
}