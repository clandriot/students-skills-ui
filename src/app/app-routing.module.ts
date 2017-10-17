import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ClassesComponent } from './components/classes.component';
import { NotesComponent } from './components/notes.component';
import { TrackingComponent } from './components/tracking.component';
import { ClassDetailsComponent } from './components/class/class-details.component';
import { SkillsComponent } from './components/skills.component';
import { TestsComponent } from './components/test/tests.component';

const routes: Routes = [
  { path: '', redirectTo: '/classes', pathMatch: 'full' },
  { path: 'classes',  component: ClassesComponent },
  { path: 'notes', component: NotesComponent, children: [
    { path: ':id', component: TestsComponent, outlet: 'tests'}
  ] },
  { path: 'tracking', component: TrackingComponent },
  { path: 'skills', component: SkillsComponent },
  { path: 'class/:id', component: ClassDetailsComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
