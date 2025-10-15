package com.kobe.koreahistory.repository;

import com.kobe.koreahistory.domain.entity.Topic;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * packageName    : com.kobe.koreahistory.repository
 * fileName       : TopicRepository
 * author         : kobe
 * date           : 2025. 10. 15.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025. 10. 15.        kobe       최초 생성
 */
public interface TopicRepository extends JpaRepository<Topic, Long> {
	Optional<Topic> findByTopicTitle(String topicTitle);
}
