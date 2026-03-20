package com.zoo.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.util.Date;

@Data  // Lombok自动生成getter/setter/toString
@TableName("user")  // 对应数据库表名
public class User {
    @TableId(type = IdType.AUTO)  // 主键自增
    private Integer id;          // 用户ID
    private String username;     // 用户名
    private String password;     // 密码
    private String role;         // 角色（admin/keeper/visitor）
    private String nickname;     // 昵称
    private String avatar;       // 头像
    private Date createTime;     // 创建时间
}