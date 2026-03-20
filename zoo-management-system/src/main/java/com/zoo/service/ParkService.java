package com.zoo.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.zoo.entity.Park;
import java.util.List;

public interface ParkService extends IService<Park> {
    // 自定义方法：根据位置查询园区
    List<Park> getParksByLocation(String location);

    // 自定义方法：批量删除园区
    boolean batchDeleteParks(List<Integer> ids);
}