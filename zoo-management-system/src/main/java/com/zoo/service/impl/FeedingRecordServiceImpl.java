package com.zoo.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.zoo.entity.FeedingRecord;
import com.zoo.mapper.FeedingRecordMapper;
import com.zoo.service.FeedingRecordService;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class FeedingRecordServiceImpl extends ServiceImpl<FeedingRecordMapper, FeedingRecord> implements FeedingRecordService {

    @Override
    public List<FeedingRecord> getByKeeperId(Integer keeperId) {
        return baseMapper.selectByKeeperId(keeperId);
    }

    @Override
    public List<FeedingRecord> getByAnimalId(Integer animalId) {
        return baseMapper.selectByAnimalId(animalId);
    }
}