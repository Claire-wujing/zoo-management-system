package com.zoo.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.util.Date;

@Data
@TableName("park")
public class Park {
    @TableId(type = IdType.AUTO)
    private Integer id;          // 园区ID
    private String name;         // 园区名称
    private String location;     // 位置
    private String intro;        // 介绍
    private String imageUrl;     // 图片地址
    private Date createTime;     // 创建时间
}