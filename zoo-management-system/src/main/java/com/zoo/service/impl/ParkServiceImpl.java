package com.zoo.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.zoo.entity.Park;
import com.zoo.mapper.ParkMapper;
import com.zoo.service.ParkService;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ParkServiceImpl extends ServiceImpl<ParkMapper, Park> implements ParkService {

    // 实现根据位置查询园区
    @Override
    public List<Park> getParksByLocation(String location) {
        LambdaQueryWrapper<Park> wrapper = new LambdaQueryWrapper<>();
        wrapper.like(Park::getLocation, location); // 模糊查询位置
        return this.list(wrapper);
    }

    // 实现批量删除园区
    @Override
    public boolean batchDeleteParks(List<Integer> ids) {
        return this.removeByIds(ids); // 复用IService的批量删除方法
    }
}