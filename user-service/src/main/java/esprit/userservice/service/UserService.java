package esprit.userservice.service;

import esprit.userservice.model.Role;
import esprit.userservice.model.User;
import esprit.userservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final KeycloakAdminService keycloakAdminService;


    public User createUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already in use: " + user.getEmail());
        }

        // Use the user's name (lowercased, spaces replaced) as the Keycloak username
        String keycloakUsername = user.getName().toLowerCase().replace(" ", ".");

        // Create user in Keycloak first
        String keycloakId = keycloakAdminService.createUser(
                keycloakUsername,
                user.getEmail(),
                user.getPassword(),
                user.getRole().name()
        );
        log.info("Created Keycloak user '{}' with id={}", keycloakUsername, keycloakId);

        // Save to local DB
        User saved = userRepository.save(user);
        log.info("Created local user id={} (keycloak username: {})", saved.getId(), keycloakUsername);
        return saved;
    }


    public List<User> getAllUsers() {
        return userRepository.findAll();
    }


    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }


    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }


    public List<User> getUsersByRole(Role role) {
        return userRepository.findByRole(role);
    }


    public User updateUser(Long id, User updatedUser) {
        User existing = getUserById(id);

        if (!existing.getEmail().equals(updatedUser.getEmail())
                && userRepository.existsByEmail(updatedUser.getEmail())) {
            throw new RuntimeException("Email already in use: " + updatedUser.getEmail());
        }

        String oldUsername = existing.getName().toLowerCase().replace(" ", ".");
        String newUsername = updatedUser.getName().toLowerCase().replace(" ", ".");

        // Sync with Keycloak
        keycloakAdminService.updateUser(
                oldUsername,
                newUsername,
                updatedUser.getEmail(),
                updatedUser.getPassword(),
                updatedUser.getRole().name()
        );
        log.info("Updated Keycloak user '{}' -> '{}'", oldUsername, newUsername);

        existing.setName(updatedUser.getName());
        existing.setEmail(updatedUser.getEmail());
        existing.setPassword(updatedUser.getPassword());
        existing.setRole(updatedUser.getRole());

        return userRepository.save(existing);
    }


    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        // Delete from Keycloak
        String keycloakUsername = user.getName().toLowerCase().replace(" ", ".");
        keycloakAdminService.deleteUserByUsername(keycloakUsername);
        log.info("Deleted Keycloak user '{}'", keycloakUsername);

        userRepository.deleteById(id);
    }
}
