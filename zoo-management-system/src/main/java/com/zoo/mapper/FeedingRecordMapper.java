package com.zoo.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.zoo.entity.FeedingRecord;
import org.apache.ibatis.annotations.Param;
import java.util.List;

public interface FeedingRecordMapper extends BaseMapper<FeedingRecord> {
    // 根据饲养员ID查询喂食记录
    List<FeedingRecord> selectByKeeperId(@Param("keeperId") Integer keeperId);
    // 根据动物ID查询喂食记录
    List<FeedingRecord> selectByAnimalId(@Param("animalId") Integer animalId);
}