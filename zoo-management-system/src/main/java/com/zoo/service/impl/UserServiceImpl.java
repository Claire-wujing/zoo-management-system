package com.zoo.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.zoo.entity.User;
import com.zoo.mapper.UserMapper;
import com.zoo.service.UserService;
import org.springframework.stereotype.Service;
import java.util.List;

@Service  // 标记为服务类
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements UserService {

    @Override
    public User login(String username, String password, String role) {
        // 调用Mapper的login方法查询用户
        return baseMapper.login(username, password, role);
    }

    @Override
    public List<User> getAllUsers() {
        // 查询所有用户
        return baseMapper.selectList(null);
    }

    @Override
    public boolean addUser(User user) {
        // 添加用户（insert成功返回1，失败返回0）
        return baseMapper.insert(user) > 0;
    }

    @Override
    public boolean deleteUser(Integer id) {
        // 删除用户
        return baseMapper.deleteById(id) > 0;
    }

    @Override
    public boolean updateUser(User user) {
        // 修改用户
        return baseMapper.updateById(user) > 0;
    }

}