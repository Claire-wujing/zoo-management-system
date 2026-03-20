package com.zoo.controller;

import com.zoo.entity.User;
import com.zoo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController  // 返回JSON数据
public class LoginController {

    @Autowired  // 注入UserService
    private UserService userService;

    // 登录接口：POST请求，地址 /api/login
    @PostMapping("/api/login")
    public Map<String, Object> login(
            @RequestParam String username,
            @RequestParam String password,
            @RequestParam String role) {

        Map<String, Object> result = new HashMap<>();

        // 调用服务层登录方法
        User user = userService.login(username, password, role);

        if (user != null) {
            // 登录成功
            result.put("code", 200);
            result.put("msg", "登录成功！🐾");
            result.put("data", user);  // 返回用户信息（不含密码）
            user.setPassword(null);  // 隐藏密码
        } else {
            // 登录失败
            result.put("code", 400);
            result.put("msg", "用户名、密码或角色错误！❌");
        }

        return result;
    }
}