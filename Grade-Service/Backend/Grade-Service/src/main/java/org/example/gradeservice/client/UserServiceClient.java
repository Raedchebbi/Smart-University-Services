package org.example.gradeservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
import java.util.Map;

@FeignClient(name = "user-service")
public interface UserServiceClient {

    @GetMapping("/api/users/{id}")
    Map<String, Object> getUserById(@PathVariable("id") Long id);

    @GetMapping("/api/users/name/{name}")
    Map<String, Object> getUserByName(@PathVariable("name") String name);

    @GetMapping("/api/users")
    List<Map<String, Object>> getAllUsers();
}
