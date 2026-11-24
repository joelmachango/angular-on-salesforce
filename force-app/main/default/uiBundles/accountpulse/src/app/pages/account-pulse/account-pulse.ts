import { ChangeDetectionStrategy, Component, OnInit, computed, signal } from '@angular/core';
import { createDataSDK } from '@salesforce/platform-sdk';
import { type I18nFormatters, createI18nFormatters, fetchI18nContext } from '@salesforce/platform-sdk/i18n';

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

type Field<T> = { value?: T | null } | null | undefined;
interface AccountPulseResult {
	uiapi: {
		query: {
			Account?: {
				edges?: ({ node?: { Id: string; Name?: Field<string>; Industry?: Field<string>; AnnualRevenue?: Field<number> } | null } | null)[] | null;
			} | null;
		};
	};
}

@Component({
	selector: 'app-account-pulse',
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './account-pulse.html',
})
export class AccountPulseComponent implements OnInit {
	protected readonly accounts = signal<Account[]>([]);
	protected readonly industry = signal('All');

	// Derived state: recalculated only when accounts() or industry() change.
	protected readonly visible = computed(() =>
		this.industry() === 'All'
			? this.accounts()
			: this.accounts().filter((a) => a.industry === this.industry()),
	);
	protected readonly total = computed(() => this.visible().reduce((sum, a) => sum + a.revenue, 0));

	// Formatters for the signed-in user's locale and currency, from Salesforce.
	private readonly formatters = signal<I18nFormatters | null>(null);

	async ngOnInit(): Promise<void> {
		const sdk = await createDataSDK();
		const [result, context] = await Promise.all([
			sdk.graphql!.query<AccountPulseResult>({ query: ACCOUNTS }),
			fetchI18nContext(sdk),
		]);
		this.formatters.set(createI18nFormatters(context));

		this.accounts.set(
			(result.data?.uiapi.query.Account?.edges ?? []).map((edge) => ({
				id: edge?.node?.Id ?? '',
				name: edge?.node?.Name?.value ?? '',
				industry: edge?.node?.Industry?.value ?? '',
				revenue: edge?.node?.AnnualRevenue?.value ?? 0,
			})),
		);
	}

	protected money(value: number): string {
		return this.formatters()?.formatCurrency(value, { maximumFractionDigits: 0 }) ?? String(value);
	}
}
