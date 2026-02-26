package com.academic.evaluation.client;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;

/**
 * Client REST pour communiquer avec l'Academic Registration Service (port 8082)
 *
 * Ce composant illustre la communication REST inter-microservices.
 * Il vérifie qu'un étudiant est bien inscrit à un cours avant d'ajouter une
 * note.
 */
@Component
public class AcademicRegistrationClient {

    private static final Logger log = LoggerFactory.getLogger(AcademicRegistrationClient.class);

    private final RestTemplate restTemplate;
    private final String registrationServiceUrl;

    public AcademicRegistrationClient(RestTemplate restTemplate,
            @Value("${academic.registration.service.url}") String registrationServiceUrl) {
        this.restTemplate = restTemplate;
        this.registrationServiceUrl = registrationServiceUrl;
    }

    /**
     * Vérifie si un étudiant est inscrit à un cours dans l'Academic Registration
     * Service
     *
     * Appel REST: GET
     * http://localhost:8082/registrations/check?studentId={sid}&courseId={cid}
     *
     * @param studentId l'identifiant de l'étudiant
     * @param courseId  l'identifiant du cours
     * @return true si l'étudiant est inscrit au cours, false sinon
     * @throws IllegalStateException si le Registration Service est inaccessible
     */
    public boolean isStudentEnrolled(Long studentId, Long courseId) {
        String url = registrationServiceUrl + "/registrations/check?studentId=" + studentId + "&courseId=" + courseId;
        log.debug("Vérification inscription étudiant id={} au cours id={} via {}", studentId, courseId, url);
        try {
            Boolean enrolled = restTemplate.getForObject(url, Boolean.class);
            log.debug("Étudiant id={} inscrit au cours id={}: {}", studentId, courseId, enrolled);
            return Boolean.TRUE.equals(enrolled);
        } catch (HttpClientErrorException.NotFound e) {
            log.warn("Inscription non trouvée pour étudiant={} cours={}", studentId, courseId);
            return false;
        } catch (ResourceAccessException e) {
            log.error("Academic Registration Service inaccessible à {}", url, e);
            throw new IllegalStateException(
                    "Impossible de contacter l'Academic Registration Service. Vérifiez que le service est démarré sur le port 8082.");
        }
    }
}
