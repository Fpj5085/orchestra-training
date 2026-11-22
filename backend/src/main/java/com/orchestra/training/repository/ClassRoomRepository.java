package com.orchestra.training.repository;

import com.orchestra.training.domain.ClassRoom;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClassRoomRepository extends JpaRepository<ClassRoom, Long> {}
