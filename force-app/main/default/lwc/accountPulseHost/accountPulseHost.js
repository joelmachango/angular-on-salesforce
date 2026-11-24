import { LightningElement, api } from 'lwc';

const INDUSTRIES = ['All', 'Agriculture', 'Shipping', 'Hospitality', 'Technology'];

export default class AccountPulseHost extends LightningElement {
    // URL of the deployed Account Pulse app (set in Lightning App Builder).
    @api appUrl;

    industry = 'All';
    selectedId;
    selectedName;
    listening = false;

    industryOptions = INDUSTRIES.map((value) => ({ label: value, value }));

    // A new object each time, so the embedding sees the change and updates the app.
    get embedProps() {
        return { industry: this.industry };
    }

    handleIndustryChange(event) {
        this.industry = event.detail.value;
    }

    // The event name has a dot, which an on... attribute in the template can't express,
    // so listen in JavaScript once the embedding is rendered.
    renderedCallback() {
        if (this.listening || !this.refs.embedding) return;
        this.refs.embedding.addEventListener('accountpulse.accountselected', (event) => {
            this.selectedId = event.detail?.recordId;
            this.selectedName = event.detail?.name;
        });
        this.listening = true;
    }
}
