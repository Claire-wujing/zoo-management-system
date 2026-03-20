package com.zoo.controller;

import com.zoo.entity.Animal;
import com.zoo.entity.Park;
import com.zoo.service.AnimalService;
import com.zoo.service.ParkService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/visitor")
public class VisitorController {

    @Autowired
    private ParkService parkService;
    @Autowired
    private AnimalService animalService;

    // 1. 查询所有园区（导览用）
    @GetMapping("/parks")
    public Map<String, Object> getAllParks() {
        Map<String, Object> result = new HashMap<>();
        List<Park> parks = parkService.list();
        result.put("code", 200);
        result.put("data", parks);
        return result;
    }

    // 2. 查询某个园区的动物
    @GetMapping("/park/{parkId}/animals")
    public Map<String, Object> getAnimalsByParkId(@PathVariable Integer parkId) {
        Map<String, Object> result = new HashMap<>();
        List<Animal> animals = animalService.getByParkId(parkId);
        result.put("code", 200);
        result.put("data", animals);
        return result;
    }

    // 3. 查询所有动物（游客可浏览）
    @GetMapping("/animals")
    public Map<String, Object> getAllAnimals() {
        Map<String, Object> result = new HashMap<>();
        List<Animal> animals = animalService.list();
        result.put("code", 200);
        result.put("data", animals);
        return result;
    }
}