package com.univ.academic.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
import java.util.Map;

@FeignClient(name = "grade-service")
public interface GradeServiceClient {

    @GetMapping("/grades")
    List<Map<String, Object>> getAllGrades();

    @GetMapping("/grades/{id}")
    Map<String, Object> getGradeById(@PathVariable("id") Long id);
}
