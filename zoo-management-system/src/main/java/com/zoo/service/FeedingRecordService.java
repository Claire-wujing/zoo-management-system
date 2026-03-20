package com.zoo.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.zoo.entity.FeedingRecord;
import java.util.List;

public interface FeedingRecordService extends IService<FeedingRecord> {
    List<FeedingRecord> getByKeeperId(Integer keeperId);
    List<FeedingRecord> getByAnimalId(Integer animalId);
}