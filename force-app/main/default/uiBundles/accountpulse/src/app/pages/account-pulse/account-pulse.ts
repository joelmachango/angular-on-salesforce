import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'app-account-pulse',
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './account-pulse.html',
})
export class AccountPulseComponent {}
