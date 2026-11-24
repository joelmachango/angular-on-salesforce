import { Routes } from '@angular/router';
import { AccountPulseComponent } from './pages/account-pulse/account-pulse';

export const routes: Routes = [
	{ path: '', component: AccountPulseComponent },
	{ path: '**', redirectTo: '' },
];
