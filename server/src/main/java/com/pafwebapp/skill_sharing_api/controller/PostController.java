import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "*") // Allow frontend access
public class PostController {
    @Autowired
    private PostService postService;

    private static final String UPLOAD_DIR = "uploads/";

    @PostMapping("/upload")
    public ResponseEntity<Post> uploadPost(@RequestParam("title") String title,
                                           @RequestParam("description") String description,
                                           @RequestParam("image") MultipartFile image,
                                           @RequestParam("userId") Long userId) {
        try {
            String fileName = System.currentTimeMillis() + "_" + image.getOriginalFilename();
            Path filePath = Paths.get(UPLOAD_DIR + fileName);
            Files.write(filePath, image.getBytes());

            Post post = new Post();
            post.setTitle(title);
            post.setDescription(description);
            post.setImageUrl(fileName);
            post.setUser(new User(userId)); // Assuming user exists

            return ResponseEntity.ok(postService.createPost(post));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/uploads/{fileName:.+}")
public ResponseEntity<Resource> getFile(@PathVariable String fileName) {
    try {
        Path filePath = Paths.get(UPLOAD_DIR).resolve(fileName).normalize();
        Resource resource = new UrlResource(filePath.toUri());
        return ResponseEntity.ok().contentType(MediaType.IMAGE_JPEG).body(resource);
    } catch (Exception e) {
        return ResponseEntity.notFound().build();
    }
}

}
