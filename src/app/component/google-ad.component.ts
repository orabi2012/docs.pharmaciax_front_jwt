import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-google-ad',
    template: `
    <ins class="adsbygoogle"
         style="display:block"
         [attr.data-ad-client]="adClient"
         [attr.data-ad-slot]="adSlot"
         [attr.data-ad-format]="adFormat"
         data-full-width-responsive="true"></ins>
  `
})
export class GoogleAdComponent {
    @Input() adClient: string = 'ca-pub-8400668080120923';
    @Input() adSlot!: number;
    @Input() adFormat!: string;

    ngOnInit() {
        try {
            ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
        } catch (e) {
            console.error('Error loading Google AdSense:', e);
        }
    }
    // ... rest of the component code
} 