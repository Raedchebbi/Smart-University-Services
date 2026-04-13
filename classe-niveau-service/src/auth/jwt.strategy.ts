import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptionsWithoutRequest } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(configService: ConfigService) {
    const realmUrl = configService.get<string>('KEYCLOAK_REALM_URL')!;
    const jwksUri = configService.get<string>('KEYCLOAK_JWKS_URI')!;

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      algorithms: ['RS256'],
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri,
      }),
    } as StrategyOptionsWithoutRequest);
  }

  // Return the full decoded payload — roles live in realm_access.roles
  validate(payload: Record<string, unknown>): Record<string, unknown> {
    return payload;
  }
}
