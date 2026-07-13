import { Module } from '@nestjs/common';
import { RolesGuard } from '../auth/roles.guard';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  controllers: [DashboardController],
  providers: [DashboardService, RolesGuard],
  exports: [DashboardService],
})
export class DashboardModule {}
