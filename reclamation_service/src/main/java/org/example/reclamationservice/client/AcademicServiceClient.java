package org.example.reclamationservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
import java.util.Map;

@FeignClient(name = "academic-service")
public interface AcademicServiceClient {

    @GetMapping("/api/courses")
    List<Map<String, Object>> getAllCourses();

    @GetMapping("/api/courses/{id}")
    Map<String, Object> getCourseById(@PathVariable("id") Long id);
}
