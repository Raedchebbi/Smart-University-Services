package com.academic.registration.client;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;

/**
 * Client REST pour communiquer avec l'Academic Core Service (port 8081)
 *
 * Ce composant illustre la communication REST inter-microservices.
 * Il vérifie l'existence des étudiants et des cours avant les inscriptions.
 */
@Component
public class AcademicCoreClient {

    private static final Logger log = LoggerFactory.getLogger(AcademicCoreClient.class);

    private final RestTemplate restTemplate;
    private final String coreServiceUrl;

    public AcademicCoreClient(RestTemplate restTemplate,
            @Value("${academic.core.service.url}") String coreServiceUrl) {
        this.restTemplate = restTemplate;
        this.coreServiceUrl = coreServiceUrl;
    }

    /**
     * Vérifie si un étudiant existe dans l'Academic Core Service
     *
     * Appel REST: GET http://localhost:8081/students/{studentId}/exists
     *
     * @param studentId l'identifiant de l'étudiant à vérifier
     * @return true si l'étudiant existe, false sinon
     * @throws IllegalStateException si le Core Service est inaccessible
     */
    public boolean studentExists(Long studentId) {
        String url = coreServiceUrl + "/students/" + studentId + "/exists";
        log.debug("Vérification existence étudiant id={} via {}", studentId, url);
        try {
            Boolean exists = restTemplate.getForObject(url, Boolean.class);
            log.debug("Étudiant id={} existe: {}", studentId, exists);
            return Boolean.TRUE.equals(exists);
        } catch (HttpClientErrorException.NotFound e) {
            log.warn("Étudiant id={} non trouvé dans le Core Service", studentId);
            return false;
        } catch (ResourceAccessException e) {
            log.error("Academic Core Service inaccessible à {}", url, e);
            throw new IllegalStateException(
                    "Impossible de contacter l'Academic Core Service. Vérifiez que le service est démarré sur le port 8081.");
        }
    }

    /**
     * Vérifie si un cours existe dans l'Academic Core Service
     *
     * Appel REST: GET http://localhost:8081/courses/{courseId}/exists
     *
     * @param courseId l'identifiant du cours à vérifier
     * @return true si le cours existe, false sinon
     * @throws IllegalStateException si le Core Service est inaccessible
     */
    public boolean courseExists(Long courseId) {
        String url = coreServiceUrl + "/courses/" + courseId + "/exists";
        log.debug("Vérification existence cours id={} via {}", courseId, url);
        try {
            Boolean exists = restTemplate.getForObject(url, Boolean.class);
            log.debug("Cours id={} existe: {}", courseId, exists);
            return Boolean.TRUE.equals(exists);
        } catch (HttpClientErrorException.NotFound e) {
            log.warn("Cours id={} non trouvé dans le Core Service", courseId);
            return false;
        } catch (ResourceAccessException e) {
            log.error("Academic Core Service inaccessible à {}", url, e);
            throw new IllegalStateException(
                    "Impossible de contacter l'Academic Core Service. Vérifiez que le service est démarré sur le port 8081.");
        }
    }
}
