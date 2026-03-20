package com.zoo.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.zoo.entity.Animal;
import java.util.List;

public interface AnimalService extends IService<Animal> {
    List<Animal> getByParkId(Integer parkId);
    List<Animal> getRecentAnimals(); // 最近添加的动物（按创建时间倒序）
}