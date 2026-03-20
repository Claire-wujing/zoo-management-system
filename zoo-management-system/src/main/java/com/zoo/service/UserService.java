package com.zoo.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.zoo.entity.User;
import java.util.List;

public interface UserService extends IService<User> {
    // 登录
    User login(String username, String password, String role);
    // 查询所有用户
    List<User> getAllUsers();
    // 添加用户
    boolean addUser(User user);
    // 删除用户
    boolean deleteUser(Integer id);
    // 修改用户
    boolean updateUser(User user);
}