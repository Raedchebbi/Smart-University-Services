import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { NiveauxModule } from './niveaux/niveaux.module';
import { ClassesModule } from './classes/classes.module';
import { EurekaModule } from './eureka/eureka.module';
import { JwtStrategy } from './auth/jwt.strategy';

@Module({
  imports: [
    // Load .env
    ConfigModule.forRoot({ isGlobal: true }),

    // MongoDB connection
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGODB_URI'),
      }),
    }),

    // Passport for JWT
    PassportModule.register({ defaultStrategy: 'jwt' }),

    // Feature modules
    NiveauxModule,
    ClassesModule,
    EurekaModule,
  ],
  providers: [JwtStrategy],
})
export class AppModule {}
