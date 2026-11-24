/**
 * Copyright (c) 2026, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
	lucideArrowDown,
	lucideArrowUp,
	lucideBath,
	lucideBedDouble,
	lucideBuilding2,
	lucideCalendarClock,
	lucideCalendarDays,
	lucideCheck,
	lucideChevronDown,
	lucideChevronRight,
	lucideCircleAlert,
	lucideDollarSign,
	lucideFile,
	lucideFileQuestion,
	lucideFileText,
	lucideGlobe,
	lucideHardHat,
	lucideHouse,
	lucideImage,
	lucideLayoutDashboard,
	lucideListFilter,
	lucideLogIn,
	lucideLogOut,
	lucideMapPin,
	lucideMenu,
	lucidePhone,
	lucideSearch,
	lucideSearchX,
	lucideStar,
	lucideBug,
	lucideDroplets,
	lucideRefrigerator,
	lucideThermometer,
	lucideTrendingDown,
	lucideTrendingUp,
	lucideZap,
	lucideUpload,
	lucideUser,
	lucideUserPen,
	lucideUserPlus,
	lucideWrench,
	lucideX,
} from '@ng-icons/lucide';

export const APP_ICONS = {
	error: lucideCircleAlert,
	close: lucideX,
	person: lucideUser,
	login: lucideLogIn,
	logout: lucideLogOut,
	editProfile: lucideUserPen,
	personAdd: lucideUserPlus,
	search: lucideSearch,
	filter: lucideListFilter,
	chevronRight: lucideChevronRight,
	chevronDown: lucideChevronDown,
	arrowUp: lucideArrowUp,
	arrowDown: lucideArrowDown,
	noResults: lucideSearchX,
	notFound: lucideFileQuestion,
	globe: lucideGlobe,
	check: lucideCheck,
	image: lucideImage,
	upload: lucideUpload,
	file: lucideFile,
	house: lucideHouse,
	bath: lucideBath,
	bed: lucideBedDouble,
	building: lucideBuilding2,
	calendarClock: lucideCalendarClock,
	calendarDays: lucideCalendarDays,
	dollar: lucideDollarSign,
	fileText: lucideFileText,
	worker: lucideHardHat,
	dashboard: lucideLayoutDashboard,
	mapPin: lucideMapPin,
	menu: lucideMenu,
	phone: lucidePhone,
	star: lucideStar,
	wrench: lucideWrench,
	bug: lucideBug,
	droplets: lucideDroplets,
	refrigerator: lucideRefrigerator,
	thermometer: lucideThermometer,
	trendingDown: lucideTrendingDown,
	trendingUp: lucideTrendingUp,
	zap: lucideZap,
} as const;

export type AppIconName = keyof typeof APP_ICONS;

@Component({
	selector: 'app-icon',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [NgIcon],
	providers: [provideIcons(APP_ICONS)],
	host: {
		'[class]': 'classes()',
		'[attr.aria-label]': 'ariaLabel()',
		'[attr.aria-hidden]': 'ariaLabel() ? null : true',
	},
	template: '<ng-icon [name]="name()" [size]="size()" />',
})
export class IconComponent {
	readonly name = input.required<AppIconName>();
	readonly size = input<string>('1rem');
	readonly ariaLabel = input<string | null>(null, { alias: 'aria-label' });
	// Non-size utilities (color, margin) still pass through to the host.
	readonly classes = input<string>('', { alias: 'class' });
}
