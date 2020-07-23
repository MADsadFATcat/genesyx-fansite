import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TelegramBotComponent } from './pages/telegram-bot/telegram-bot.component';
import { DressingRoomComponent } from './pages/dressing-room/dressing-room.component';
import { HelperComponent } from './pages/helper/helper.component';
import { HomeComponent } from './pages/home/home.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'helper', component: HelperComponent},
  {path: 'dressing-room', component: DressingRoomComponent},
  {path: 'telegram-bot', component: TelegramBotComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
