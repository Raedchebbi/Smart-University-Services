package com.academic.registration.exception;

/**
 * Exception levée quand une ressource n'est pas trouvée
 */
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }
}
