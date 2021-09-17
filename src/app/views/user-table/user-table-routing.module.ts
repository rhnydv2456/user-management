import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserTableComponent } from './user-table.component';

const routes: Routes = [
  {
    path: '',
    component: UserTableComponent,
    data: {
      title: 'User-Table'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserTableRoutingModule {}
