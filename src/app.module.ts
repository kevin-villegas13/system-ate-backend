import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { SectorsModule } from './sectors/sectors.module';
import { ChildrenModule } from './children/children.module';
import { DelegatesModule } from './delegates/delegates.module';
import { BenefitsModule } from './benefits/benefits.module';
import { DelegateAssignmentsModule } from './delegate_assignments/delegate_assignments.module';
import { BenefitDeliveriesModule } from './benefit_deliveries/benefit_deliveries.module';
import { AffiliatesModule } from './affiliates/affiliates.module';
import { EventsModule } from './events/events.module';
import { ConfigModule } from '@nestjs/config';
import { GendersModule } from './genders/genders.module';
import { RoleModule } from './role/role.module';
import { RecipientModule } from './recipient/recipient.module';
import { DeliveryModule } from './delivery/delivery.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    AuthModule,
    UserModule,
    SectorsModule,
    ChildrenModule,
    DelegatesModule,
    BenefitsModule,
    DelegateAssignmentsModule,
    BenefitDeliveriesModule,
    AffiliatesModule,
    EventsModule,
    GendersModule,
    RoleModule,
    RecipientModule,
    DeliveryModule,
  ],
})
export class AppModule {}
