package com.zoo.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.util.Date;

@Data
@TableName("feeding_record")
public class FeedingRecord {
    @TableId(type = IdType.AUTO)
    private Integer id;          // 记录ID
    private Integer animalId;    // 动物ID
    private Integer keeperId;    // 饲养员ID
    private String food;         // 食物
    private Date feedTime;       // 喂食时间
    private String note;         // 备注
    private Date createTime;     // 创建时间
}