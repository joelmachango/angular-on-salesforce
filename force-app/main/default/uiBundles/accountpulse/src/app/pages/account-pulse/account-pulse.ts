import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { createDataSDK } from '@salesforce/platform-sdk';

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

	async ngOnInit(): Promise<void> {
		const sdk = await createDataSDK();
		const result = await sdk.graphql!.query<AccountPulseResult>({ query: ACCOUNTS });

		this.accounts.set(
			(result.data?.uiapi.query.Account?.edges ?? []).map((edge) => ({
				id: edge?.node?.Id ?? '',
				name: edge?.node?.Name?.value ?? '',
				industry: edge?.node?.Industry?.value ?? '',
				revenue: edge?.node?.AnnualRevenue?.value ?? 0,
			})),
		);
	}
}
