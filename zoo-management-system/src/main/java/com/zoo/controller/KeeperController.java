package com.zoo.controller;

import com.zoo.entity.Animal;
import com.zoo.entity.FeedingRecord;
import com.zoo.service.AnimalService;
import com.zoo.service.FeedingRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
@RestController
@RequestMapping("/api/keeper")
public class KeeperController {

    @Autowired
    private AnimalService animalService;
    @Autowired
    private FeedingRecordService feedingRecordService;

    // 1. 查询所有动物
    @GetMapping("/animals")
    public Map<String, Object> getAllAnimals() {
        Map<String, Object> result = new HashMap<>();
        List<Animal> animals = animalService.list();
        result.put("code", 200);
        result.put("data", animals);
        return result;
    }

    // 2. 新增喂食记录
    @PostMapping("/feeding-record")
    public Map<String, Object> addFeedingRecord(@RequestBody FeedingRecord record) {
        Map<String, Object> result = new HashMap<>();
        try {
            boolean success = feedingRecordService.save(record);
            result.put("code", success ? 200 : 400);
            result.put("msg", success ? "喂食记录添加成功！🐟" : "添加失败～");
        } catch (Exception e) {
            result.put("code", 500);
            result.put("msg", "提交失败：" + e.getMessage());
            e.printStackTrace();
        }
        return result;
    }

    // 3. 查询我的喂食记录
    @GetMapping("/feeding-records/{keeperId}")
    public Map<String, Object> getMyFeedingRecords(@PathVariable Integer keeperId) {
        Map<String, Object> result = new HashMap<>();
        List<FeedingRecord> records = feedingRecordService.getByKeeperId(keeperId);
        result.put("code", 200);
        result.put("data", records);
        return result;
    }

    // 4. 修改喂食记录（新增）
    @PutMapping("/feeding-record/{recordId}")
    public Map<String, Object> updateFeedingRecord(
            @PathVariable Integer recordId,
            @RequestBody FeedingRecord record) {
        Map<String, Object> result = new HashMap<>();
        try {
            record.setId(recordId); // 确保ID一致
            boolean success = feedingRecordService.updateById(record);
            result.put("code", success ? 200 : 400);
            result.put("msg", success ? "喂食记录修改成功！🐟" : "修改失败～");
        } catch (Exception e) {
            result.put("code", 500);
            result.put("msg", "修改失败：" + e.getMessage());
            e.printStackTrace();
        }
        return result;
    }

    // 5. 删除喂食记录（新增）
    @DeleteMapping("/feeding-record/{recordId}")
    public Map<String, Object> deleteFeedingRecord(@PathVariable Integer recordId) {
        Map<String, Object> result = new HashMap<>();
        try {
            boolean success = feedingRecordService.removeById(recordId);
            result.put("code", success ? 200 : 400);
            result.put("msg", success ? "喂食记录删除成功！🐟" : "删除失败～");
        } catch (Exception e) {
            result.put("code", 500);
            result.put("msg", "删除失败：" + e.getMessage());
            e.printStackTrace();
        }
        return result;
    }
}