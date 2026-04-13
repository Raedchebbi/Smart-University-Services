package esprit.userservice.service;

import jakarta.ws.rs.core.Response;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.RoleRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class KeycloakAdminService {

    private final Keycloak keycloak;
    private final String realm;

    public KeycloakAdminService(
            @Value("${keycloak.admin.server-url}") String serverUrl,
            @Value("${keycloak.admin.realm}") String realm,
            @Value("${keycloak.admin.client-id}") String clientId,
            @Value("${keycloak.admin.username}") String username,
            @Value("${keycloak.admin.password}") String password) {
        this.realm = realm;
        this.keycloak = KeycloakBuilder.builder()
                .serverUrl(serverUrl)
                .realm("master")
                .clientId(clientId)
                .username(username)
                .password(password)
                .build();
    }

    /**
     * Creates a user in Keycloak with the given credentials and realm role.
     * @return the Keycloak user ID (sub)
     */
    public String createUser(String username, String email, String password, String roleName) {
        RealmResource realmResource = keycloak.realm(realm);
        UsersResource usersResource = realmResource.users();

        // Build user representation
        UserRepresentation user = new UserRepresentation();
        user.setUsername(username);
        user.setEmail(email);
        user.setEnabled(true);
        user.setEmailVerified(true);

        // Set password credential
        CredentialRepresentation credential = new CredentialRepresentation();
        credential.setTemporary(false);
        credential.setType(CredentialRepresentation.PASSWORD);
        credential.setValue(password);
        user.setCredentials(Collections.singletonList(credential));

        // Create user
        try (Response response = usersResource.create(user)) {
            if (response.getStatus() == 201) {
                String userId = extractUserId(response);

                // Assign realm role
                assignRealmRole(realmResource, userId, roleName);

                return userId;
            } else if (response.getStatus() == 409) {
                throw new RuntimeException("User already exists in Keycloak with username: " + username);
            } else {
                throw new RuntimeException("Failed to create user in Keycloak. Status: " + response.getStatus());
            }
        }
    }

    /**
     * Deletes a user from Keycloak by their username.
     */
    public void deleteUserByUsername(String username) {
        UsersResource usersResource = keycloak.realm(realm).users();
        List<UserRepresentation> users = usersResource.searchByUsername(username, true);
        if (!users.isEmpty()) {
            usersResource.delete(users.get(0).getId());
        }
    }

    /**
     * Updates a user's password and role in Keycloak.
     */
    public void updateUser(String oldUsername, String newUsername, String email, String password, String roleName) {
        RealmResource realmResource = keycloak.realm(realm);
        UsersResource usersResource = realmResource.users();
        List<UserRepresentation> users = usersResource.searchByUsername(oldUsername, true);

        if (users.isEmpty()) {
            // User doesn't exist in Keycloak yet — create them
            createUser(newUsername, email, password, roleName);
            return;
        }

        UserRepresentation user = users.get(0);
        String userId = user.getId();

        // Update basic fields
        user.setUsername(newUsername);
        user.setEmail(email);
        usersResource.get(userId).update(user);

        // Update password
        if (password != null && !password.isBlank()) {
            CredentialRepresentation credential = new CredentialRepresentation();
            credential.setTemporary(false);
            credential.setType(CredentialRepresentation.PASSWORD);
            credential.setValue(password);
            usersResource.get(userId).resetPassword(credential);
        }

        // Update role — remove all existing realm roles (STUDENT, TEACHER, ADMIN) and assign the new one
        for (String r : List.of("STUDENT", "TEACHER", "ADMIN")) {
            try {
                RoleRepresentation role = realmResource.roles().get(r).toRepresentation();
                usersResource.get(userId).roles().realmLevel().remove(Collections.singletonList(role));
            } catch (Exception ignored) {
                // Role not assigned — skip
            }
        }
        assignRealmRole(realmResource, userId, roleName);
    }

    private void assignRealmRole(RealmResource realmResource, String userId, String roleName) {
        try {
            RoleRepresentation role = realmResource.roles().get(roleName).toRepresentation();
            realmResource.users().get(userId).roles().realmLevel().add(Collections.singletonList(role));
        } catch (Exception e) {
            throw new RuntimeException("Failed to assign role '" + roleName + "' in Keycloak. " +
                    "Make sure the realm role exists. Error: " + e.getMessage());
        }
    }

    private String extractUserId(Response response) {
        String location = response.getHeaderString("Location");
        if (location != null) {
            return location.substring(location.lastIndexOf('/') + 1);
        }
        throw new RuntimeException("Could not extract user ID from Keycloak response");
    }
}
