import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { LOCALE_ID } from '@angular/core';

import { DateAdapter } from '@angular/material';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatButtonModule,
  MatMenuModule,
  MatToolbarModule,
  MatIconModule,
  MatSidenavModule,
  MatListModule,
  MatTableModule,
  MatDialogModule,
  MatInputModule,
  MatTabsModule,
  MatTooltipModule,
  MatSlideToggleModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatCheckboxModule
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
import { TestsComponent } from './components/test/tests.component';
import { TestEditComponent } from './components/test/test-edit.component';
import { TestResultsComponent } from './components/test/test-results.component';

import { ClassService } from './components/class/class.service';
import { StudentService } from './components/student/student.service';
import { SkillService } from './components/skill/skill.service';
import { TestService } from './components/test/test.service';

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
    SkillEditComponent,
    TestsComponent,
    TestEditComponent,
    TestResultsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatTableModule,
    MatDialogModule,
    MatInputModule,
    MatTabsModule,
    MatTooltipModule,
    MatSlideToggleModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule
  ],
  entryComponents: [
    ClassEditComponent,
    ConfirmComponent,
    StudentEditComponent,
    SkillEditComponent,
    TestEditComponent
  ],
  providers: [
    ClassService,
    StudentService,
    SkillService,
    TestService,
    { provide: LOCALE_ID, useValue: 'fr-FR' }
],
  bootstrap: [AppComponent]
})
export class AppModule { }
