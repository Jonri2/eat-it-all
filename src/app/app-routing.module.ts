import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListPageComponent } from './components/pages/list-page/list-page.component';
import { LoginPageComponent } from './components/pages/login/login.component';
import { ViewFoodPageComponent } from './components/pages/view-food-page/view-food-page.component';

const routes: Routes = [
  { path: 'list', component: ListPageComponent },
  { path: 'view/:id', component: ViewFoodPageComponent },
  { path: 'login', component: LoginPageComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
