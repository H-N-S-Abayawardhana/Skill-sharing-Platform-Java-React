package Backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import Backend.model.User;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByProviderAndProviderId(String provider, String providerId);
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);

    // Find users not followed by the given user and not the user themselves
    @Query("SELECT u FROM User u WHERE u.id <> :userId AND u NOT IN (SELECT f FROM User user JOIN user.following f WHERE user.id = :userId)")
    List<User> findSuggestedUsers(Long userId);
} 