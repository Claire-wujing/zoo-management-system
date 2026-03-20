package com.zoo.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.zoo.entity.User;
import org.apache.ibatis.annotations.Param;

public interface UserMapper extends BaseMapper<User> {
    // 根据用户名、密码、角色查询用户（登录用）
    User login(@Param("username") String username,
               @Param("password") String password,
               @Param("role") String role);
}