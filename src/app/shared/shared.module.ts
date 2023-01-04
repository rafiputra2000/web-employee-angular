import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { ValidationMessageComponent } from './validation-message/validation-message.component';
import { StringUtil } from './utils/string.utils';
import { RouterModule } from '@angular/router';
import { SafeStylePipe } from './pipes/safe-style.pipe';

@NgModule({
  declarations: [NavbarComponent, ValidationMessageComponent, SafeStylePipe],
  imports: [CommonModule, RouterModule],
  providers: [StringUtil],
  exports: [NavbarComponent, ValidationMessageComponent, SafeStylePipe],
})
export class SharedModule {}
