import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MdButtonModule,
  MdMenuModule,
  MdToolbarModule,
  MdIconModule,
  MdSidenavModule,
  MdListModule,
  MdTableModule,
  MdDialogModule,
  MdInputModule,
  MdTabsModule,
  MdTooltipModule,
  MdSlideToggleModule,
} from '@angular/material';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { NavigationComponent } from './navigation/navigation.component';
import { ClassesComponent } from './components/classes.component';
import { NotesComponent } from './components/notes.component';
import { TrackingComponent } from './components/tracking.component';
import { ClassDetailsComponent } from './components/class/class-details.component';
import { StudentEditComponent } from './components/student/student-edit.component';
import { PageHeaderComponent } from './header/page-header.component';
import { ClassEditComponent } from './components/class/class-edit.component';
import { ConfirmComponent } from './components/misc/confirm.component';
import { SkillsComponent } from './components/skills.component';
import { SkillEditComponent } from './components/skill/skill-edit.component';

import { ClassService } from './components/class/class.service';
import { StudentService } from './components/student/student.service';
import { SkillService } from './components/skill/skill.service';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    NavigationComponent,
    ClassesComponent,
    NotesComponent,
    TrackingComponent,
    ClassDetailsComponent,
    StudentEditComponent,
    PageHeaderComponent,
    ClassEditComponent,
    ConfirmComponent,
    SkillsComponent,
    SkillEditComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MdButtonModule,
    MdMenuModule,
    MdToolbarModule,
    MdIconModule,
    MdSidenavModule,
    MdListModule,
    MdTableModule,
    MdDialogModule,
    MdInputModule,
    MdTabsModule,
    MdTooltipModule,
    MdSlideToggleModule
  ],
  entryComponents: [
    ClassEditComponent,
    ConfirmComponent,
    StudentEditComponent,
    SkillEditComponent
  ],
  providers: [
    ClassService,
    StudentService,
    SkillService
],
  bootstrap: [AppComponent]
})
export class AppModule { }
