package com.univ.academic.repository;

import com.univ.academic.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {

    List<Course> findByProfessorId(Long professorId);

    List<Course> findByCreditsGreaterThanEqual(Integer credits);

    Optional<Course> findByTitle(String title);

    boolean existsByTitle(String title);
}
