package com.zoo.controller;

import com.zoo.entity.Animal;
import com.zoo.entity.Park;
import com.zoo.entity.User;
import com.zoo.service.AnimalService;
import com.zoo.service.ParkService;
import com.zoo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")  // 接口前缀：/api/admin
public class AdminController {

    @Autowired
    private AnimalService animalService;
    @Autowired
    private ParkService parkService;
    @Autowired
    private UserService userService;

    // ==================== 动物管理 CRUD ====================
    // 1. 查询所有动物
    @GetMapping("/animals")
    public Map<String, Object> getAllAnimals() {
        Map<String, Object> result = new HashMap<>();
        List<Animal> animals = animalService.list();
        result.put("code", 200);
        result.put("data", animals);
        return result;
    }

    // 2. 添加动物
    @PostMapping("/animal")
    public Map<String, Object> addAnimal(@RequestBody Animal animal) {
        Map<String, Object> result = new HashMap<>();
        boolean success = animalService.save(animal);
        result.put("code", success ? 200 : 400);
        result.put("msg", success ? "添加动物成功！🐼" : "添加失败！");
        return result;
    }

    // 3. 修改动物
    @PutMapping("/animal/{id}")
    public Map<String, Object> updateAnimal(@PathVariable Integer id, @RequestBody Animal animal) {
        Map<String, Object> result = new HashMap<>();
        animal.setId(id); // 确保ID一致
        boolean success = animalService.updateById(animal);
        result.put("code", success ? 200 : 400);
        result.put("msg", success ? "修改动物成功！🐼" : "修改失败！");
        return result;
    }

    // 4. 删除动物
    @DeleteMapping("/animal/{id}")
    public Map<String, Object> deleteAnimal(@PathVariable Integer id) {
        Map<String, Object> result = new HashMap<>();
        boolean success = animalService.removeById(id);
        result.put("code", success ? 200 : 400);
        result.put("msg", success ? "删除动物成功！" : "删除失败！");
        return result;
    }

    // ==================== 园区管理 CRUD ====================
    // 1. 查询所有园区
    @GetMapping("/parks")
    public Map<String, Object> getAllParks() {
        Map<String, Object> result = new HashMap<>();
        List<Park> parks = parkService.list();
        result.put("code", 200);
        result.put("data", parks);
        return result;
    }

    // 2. 添加园区
    @PostMapping("/park")
    public Map<String, Object> addPark(@RequestBody Park park) {
        Map<String, Object> result = new HashMap<>();
        boolean success = parkService.save(park);
        result.put("code", success ? 200 : 400);
        result.put("msg", success ? "添加园区成功！🏞️" : "添加失败！");
        return result;
    }

    // 3. 修改园区
    @PutMapping("/park/{id}")
    public Map<String, Object> updatePark(@PathVariable Integer id, @RequestBody Park park) {
        Map<String, Object> result = new HashMap<>();
        park.setId(id);
        boolean success = parkService.updateById(park);
        result.put("code", success ? 200 : 400);
        result.put("msg", success ? "修改园区成功！🏞️" : "修改失败！");
        return result;
    }

    // 4. 删除园区
    @DeleteMapping("/park/{id}")
    public Map<String, Object> deletePark(@PathVariable Integer id) {
        Map<String, Object> result = new HashMap<>();
        boolean success = parkService.removeById(id);
        result.put("code", success ? 200 : 400);
        result.put("msg", success ? "删除园区成功！" : "删除失败！");
        return result;
    }

    // ==================== 用户管理 CRUD ====================
    // 1. 查询所有用户
    @GetMapping("/users")
    public Map<String, Object> getAllUsers() {
        Map<String, Object> result = new HashMap<>();
        List<User> users = userService.getAllUsers();
        result.put("code", 200);
        result.put("data", users);
        return result;
    }

    // 2. 添加用户
    @PostMapping("/user")
    public Map<String, Object> addUser(@RequestBody User user) {
        Map<String, Object> result = new HashMap<>();
        boolean success = userService.save(user);
        result.put("code", success ? 200 : 400);
        result.put("msg", success ? "添加用户成功！👥" : "添加失败！");
        return result;
    }

    // 3. 修改用户
    @PutMapping("/user/{id}")
    public Map<String, Object> updateUser(@PathVariable Integer id, @RequestBody User user) {
        Map<String, Object> result = new HashMap<>();
        user.setId(id);
        boolean success = userService.updateById(user);
        result.put("code", success ? 200 : 400);
        result.put("msg", success ? "修改用户成功！👥" : "修改失败！");
        return result;
    }

    // 4. 删除用户
    @DeleteMapping("/user/{id}")
    public Map<String, Object> deleteUser(@PathVariable Integer id) {
        Map<String, Object> result = new HashMap<>();
        boolean success = userService.removeById(id);
        result.put("code", success ? 200 : 400);
        result.put("msg", success ? "删除用户成功！" : "删除失败！");
        return result;
    }
}