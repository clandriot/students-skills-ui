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
} from '@angular/material';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { NavigationComponent } from './navigation/navigation.component';
import { ClassesComponent } from './components/classes.component';
import { NotesComponent } from './components/notes.component';
import { TrackingComponent } from './components/tracking.component';
import { ClassDetailsComponent } from './components/class/class-details.component';
import { StudentsComponent } from './components/student/students.component';
import { PageHeaderComponent } from './header/page-header.component';
import { ClassEditComponent } from './components/class/class-edit.component';

import { ClassService } from './components/class/class.service';
import { StudentService } from './components/student/student.service';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    NavigationComponent,
    ClassesComponent,
    NotesComponent,
    TrackingComponent,
    ClassDetailsComponent,
    StudentsComponent,
    PageHeaderComponent,
    ClassEditComponent
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
    MdInputModule
  ],
  entryComponents: [
    ClassEditComponent
  ],
  providers: [
    ClassService,
    StudentService
],
  bootstrap: [AppComponent]
})
export class AppModule { }
