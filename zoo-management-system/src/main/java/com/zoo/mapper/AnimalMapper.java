package com.zoo.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.zoo.entity.Animal;
import org.apache.ibatis.annotations.Param;
import java.util.List;

public interface AnimalMapper extends BaseMapper<Animal> {
    // 根据园区ID查询动物
    List<Animal> selectByParkId(@Param("parkId") Integer parkId);
}