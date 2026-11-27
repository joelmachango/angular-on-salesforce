import { ChangeDetectionStrategy, Component, OnInit, computed, signal } from '@angular/core';
import { type ViewSDK, createDataSDK, getViewSDK } from '@salesforce/platform-sdk';
import { type I18nFormatters, createI18nFormatters, fetchI18nContext } from '@salesforce/platform-sdk/i18n';
// Generated from the query below and the org's schema by `npm run graphql:codegen`.
import type { AccountPulseQuery } from '../../api/graphql-operations-types';

interface Account {
	id: string;
	name: string;
	industry: string;
	revenue: number;
}

// GraphQL through Salesforce's UI API: the server applies object, field and sharing security.
const ACCOUNTS = /* GraphQL */ `
	query AccountPulse {
		uiapi {
			query {
				Account(first: 50, orderBy: { AnnualRevenue: { order: DESC } }) {
					edges {
						node {
							Id
							Name @optional {
								value
							}
							Industry @optional {
								value
							}
							AnnualRevenue @optional {
								value
							}
						}
					}
				}
			}
		}
	}
`;

@Component({
	selector: 'app-account-pulse',
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './account-pulse.html',
})
export class AccountPulseComponent implements OnInit {
	protected readonly accounts = signal<Account[]>([]);
	protected readonly industry = signal('All');

	// Loading and error states, so the page never shows a misleading "0 accounts".
	protected readonly loading = signal(true);
	protected readonly error = signal<string | null>(null);

	// Derived state: recalculated only when accounts() or industry() change.
	protected readonly visible = computed(() =>
		this.industry() === 'All'
			? this.accounts()
			: this.accounts().filter((a) => a.industry === this.industry()),
	);
	protected readonly total = computed(() => this.visible().reduce((sum, a) => sum + a.revenue, 0));

	// Formatters for the signed-in user's locale and currency, from Salesforce.
	private readonly formatters = signal<I18nFormatters | null>(null);

	// Embedded in a Lightning page? The host LWC talks to us through the View SDK.
	private view?: ViewSDK;

	async ngOnInit(): Promise<void> {
		void this.connectToHost();

		try {
			const sdk = await createDataSDK();
			const [result, context] = await Promise.all([
				sdk.graphql!.query<AccountPulseQuery>({ query: ACCOUNTS }),
				// Nice to have: if the locale lookup fails, show plain numbers rather than no data.
				fetchI18nContext(sdk).catch(() => null),
			]);
			if (context) this.formatters.set(createI18nFormatters(context));

			this.accounts.set(
				(result.data?.uiapi.query.Account?.edges ?? []).map((edge) => ({
					id: edge?.node?.Id ?? '',
					name: edge?.node?.Name?.value ?? '',
					industry: edge?.node?.Industry?.value ?? '',
					revenue: edge?.node?.AnnualRevenue?.value ?? 0,
				})),
			);
		} catch (e) {
			this.error.set(e instanceof Error ? e.message : 'Could not load accounts.');
		} finally {
			this.loading.set(false);
		}
	}

	protected money(value: number): string {
		return this.formatters()?.formatCurrency(value, { maximumFractionDigits: 0 }) ?? value.toLocaleString();
	}

	// Step 10: props in. The host LWC passes { industry } on <lightning-ui-embedding props>.
	private async connectToHost(): Promise<void> {
		this.view = await getViewSDK();
		const ui = this.view.getUiState?.();
		if (!ui) return; // opened from the App Launcher, not embedded

		const apply = (props: { industry?: string }) => this.industry.set(props.industry || 'All');
		apply(ui.state.props);
		ui.subscribe((next) => apply(next.props));
	}

	// Step 11: events out. Tell the host which account was picked.
	protected select(account: Account): void {
		this.view?.dispatchEvent?.(
			new CustomEvent('accountpulse.accountselected', {
				detail: { recordId: account.id, name: account.name },
				bubbles: true,
			}),
		);
	}
}
