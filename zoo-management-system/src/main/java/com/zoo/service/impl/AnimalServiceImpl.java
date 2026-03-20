package com.zoo.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.zoo.entity.Animal;
import com.zoo.mapper.AnimalMapper;
import com.zoo.service.AnimalService;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AnimalServiceImpl extends ServiceImpl<AnimalMapper, Animal> implements AnimalService {

    @Override
    public List<Animal> getByParkId(Integer parkId) {
        return baseMapper.selectByParkId(parkId);
    }

    @Override
    public List<Animal> getRecentAnimals() {
        // 按创建时间倒序，取前5条
        return lambdaQuery()
                .orderByDesc(Animal::getCreateTime)
                .last("LIMIT 5")
                .list();
    }
}