import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { UserTableRoutingModule } from './user-table-routing.module';
import { UserTableComponent } from './user-table.component';


@NgModule({
  imports: [
    FormsModule,
    UserTableRoutingModule,
    ChartsModule,
    BsDropdownModule,
    ButtonsModule.forRoot()
  ],
  declarations: [UserTableComponent]
})
export class UserTableModule { }
