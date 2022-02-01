import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Routes, RouterModule } from '@angular/router'
import { IonicModule } from '@ionic/angular'
import { AppShowPage } from './app-show.page'
import { StatusComponentModule } from 'src/app/components/status/status.component.module'
import { SharingModule } from 'src/app/modules/sharing.module'
import { InstallWizardComponentModule } from 'src/app/components/install-wizard/install-wizard.component.module'
import { AppConfigPageModule } from 'src/app/modals/app-config/app-config.module'
import { AppShowHeaderComponent } from './components/app-show-header/app-show-header.component'
import { AppShowProgressComponent } from './components/app-show-progress/app-show-progress.component'
import { AppShowStatusComponent } from './components/app-show-status/app-show-status.component'
import { AppShowDependenciesComponent } from './components/app-show-dependencies/app-show-dependencies.component'
import { AppShowMenuComponent } from './components/app-show-menu/app-show-menu.component'
import { AppShowHealthChecksComponent } from './components/app-show-health-checks/app-show-health-checks.component'
import { HealthColorPipe } from './pipes/health-color.pipe'
import { ToHealthChecksPipe } from './pipes/to-health-checks.pipe'
import { ToButtonsPipe } from './pipes/to-buttons.pipe'
import { ToDependenciesPipe } from './pipes/to-dependencies.pipe'
import { ToStatusPipe } from './pipes/to-status.pipe'

const routes: Routes = [
  {
    path: '',
    component: AppShowPage,
  },
]

@NgModule({
  declarations: [
    AppShowPage,
    HealthColorPipe,
    ToHealthChecksPipe,
    ToButtonsPipe,
    ToDependenciesPipe,
    ToStatusPipe,
    AppShowHeaderComponent,
    AppShowProgressComponent,
    AppShowStatusComponent,
    AppShowDependenciesComponent,
    AppShowMenuComponent,
    AppShowHealthChecksComponent,
  ],
  imports: [
    CommonModule,
    StatusComponentModule,
    IonicModule,
    RouterModule.forChild(routes),
    InstallWizardComponentModule,
    AppConfigPageModule,
    SharingModule,
  ],
})
export class AppShowPageModule {}