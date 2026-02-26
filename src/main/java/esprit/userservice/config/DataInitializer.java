package esprit.userservice.config;

import esprit.userservice.model.Role;
import esprit.userservice.model.User;
import esprit.userservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;

    @Override
    public void run(String... args) {
        userRepository.saveAll(List.of(
                User.builder().name("Ahmed Zayen").email("ahmed@esprit.tn").password("pass123").role(Role.STUDENT).build(),
                User.builder().name("Marwa Derbel").email("marwa@esprit.tn").password("pass123").role(Role.STUDENT).build(),
                User.builder().name("Sarah Mohsen").email("sarah@esprit.tn").password("pass123").role(Role.TEACHER).build(),
                User.builder().name("Karim Ben Ali").email("karim@esprit.tn").password("pass123").role(Role.TEACHER).build(),
                User.builder().name("Admin Omar").email("admin@esprit.tn").password("admin123").role(Role.ADMIN).build()
        ));

    }
}
