package com.univ.gateway.filter;

import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.Collection;
import java.util.stream.Collectors;

/**
 * Passes user identity downstream via X-User-Id and X-User-Roles headers.
 */
@Component
public class AuthHeaderRelayFilter implements GlobalFilter, Ordered {

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        return ReactiveSecurityContextHolder.getContext()
                .filter(ctx -> ctx.getAuthentication() instanceof JwtAuthenticationToken)
                .map(ctx -> (JwtAuthenticationToken) ctx.getAuthentication())
                .map(auth -> {
                    Jwt jwt = auth.getToken();
                    String userId = jwt.getClaimAsString("sub");
                    String roles = auth.getAuthorities().stream()
                            .map(Object::toString)
                            .collect(Collectors.joining(","));

                    return exchange.mutate()
                            .request(r -> r
                                    .header("X-User-Id", userId)
                                    .header("X-User-Roles", roles))
                            .build();
                })
                .defaultIfEmpty(exchange)
                .flatMap(chain::filter);
    }

    @Override
    public int getOrder() {
        return -1; // Run early
    }
}
