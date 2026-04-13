package esprit.eureka4twin3;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;

@SpringBootApplication
@EnableEurekaServer
public class Eureka4Twin3Application {

	public static void main(String[] args) {
		SpringApplication.run(Eureka4Twin3Application.class, args);
	}

}
