package com.zoo.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.util.Date;

@Data
@TableName("animal")
public class Animal {
    @TableId(type = IdType.AUTO)
    private Integer id;          // 动物ID
    private String name;         // 动物名称
    private String type;         // 动物类型
    private Integer age;         // 年龄
    private Integer parkId;      // 所属园区ID
    private String intro;        // 介绍
    private String imageUrl;     // 图片地址
    private Date createTime;     // 创建时间
}