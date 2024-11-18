import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleAdComponent } from '../component/google-ad.component';

@NgModule({
    declarations: [
        GoogleAdComponent
    ],
    imports: [
        CommonModule
    ],
    exports: [
        GoogleAdComponent
    ]
})
export class SharedModule { } 