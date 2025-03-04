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
@Module({
  imports: [
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
  ],
})
export class AppModule {}
