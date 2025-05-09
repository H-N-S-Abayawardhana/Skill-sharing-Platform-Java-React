package Backend.controller;

import Backend.model.User;
import Backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.core.Authentication;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    private final Path fileStoragePath = Paths.get("Backend/uploads/profile-images").toAbsolutePath().normalize();
    
    public UserController() {
        try {
            Files.createDirectories(fileStoragePath);
        } catch (IOException ex) {
            throw new RuntimeException("Could not create directory for uploaded files", ex);
        }
    }
    
    @GetMapping("/profile-images/{fileName:.+}")
    public ResponseEntity<Resource> getProfileImage(@PathVariable String fileName) {
        try {
            Path filePath = fileStoragePath.resolve(fileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            
            if(resource.exists()) {
                return ResponseEntity.ok()
                        .contentType(MediaType.IMAGE_JPEG)
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (MalformedURLException ex) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping(value = "/{id}", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<?> updateUserWithImage(
            @PathVariable Long id,
            @RequestPart(value = "username") String username,
            @RequestPart(value = "email") String email,
            @RequestPart(value = "firstName", required = false) String firstName,
            @RequestPart(value = "lastName", required = false) String lastName,
            @RequestPart(value = "bio", required = false) String bio,
            @RequestPart(value = "profileImage", required = false) MultipartFile profileImage) {
        
        try {
            User user = new User();
            user.setUsername(username);
            user.setEmail(email);
            user.setFirstName(firstName);
            user.setLastName(lastName);
            user.setBio(bio);
            
            if (profileImage != null && !profileImage.isEmpty()) {
                String fileName = UUID.randomUUID().toString() + "_" + profileImage.getOriginalFilename();
                Path targetLocation = fileStoragePath.resolve(fileName);
                Files.copy(profileImage.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
                user.setProfilePicture("/api/users/profile-images/" + fileName);
            }
            
            User updatedUser = userService.updateUser(id, user);
            return ResponseEntity.ok(updatedUser);
        } catch (IOException ex) {
            return ResponseEntity.badRequest().body("Failed to upload profile image: " + ex.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody User user) {
        try {
            User updatedUser = userService.updateUser(id, user);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Follow a user
    @PostMapping("/{id}/follow")
    public ResponseEntity<?> followUser(@PathVariable Long id, Authentication authentication) {
        String email = authentication.getName();
        User currentUser = userService.getUserByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        userService.followUser(currentUser.getId(), id);
        return ResponseEntity.ok().build();
    }

    // Unfollow a user
    @PostMapping("/{id}/unfollow")
    public ResponseEntity<?> unfollowUser(@PathVariable Long id, Authentication authentication) {
        String email = authentication.getName();
        User currentUser = userService.getUserByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        userService.unfollowUser(currentUser.getId(), id);
        return ResponseEntity.ok().build();
    }

    // Get suggested users
    @GetMapping("/suggestions")
    public ResponseEntity<?> getSuggestedUsers(Authentication authentication) {
        String email = authentication.getName();
        User currentUser = userService.getUserByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        java.util.List<User> suggestions = userService.getSuggestedUsers(currentUser.getId());
        // Map to DTO for frontend (hide sensitive info)
        java.util.List<java.util.Map<String, Object>> result = new java.util.ArrayList<>();
        for (User user : suggestions) {
            java.util.Map<String, Object> map = new java.util.HashMap<>();
            map.put("id", user.getId());
            map.put("username", user.getUsername());
            map.put("firstName", user.getFirstName());
            map.put("lastName", user.getLastName());
            map.put("profilePicture", user.getProfilePicture());
            result.add(map);
        }
        return ResponseEntity.ok(result);
    }
}