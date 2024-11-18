import { Component, OnInit, Input } from "@angular/core";

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
export class GoogleAdComponent implements OnInit {
    @Input() adClient: string = 'ca-pub-8400668080120923';
    @Input() adSlot!: string | number;
    @Input() adFormat: string = 'auto';

    ngOnInit() {
        ((window as any)['adsbygoogle'] = (window as any)['adsbygoogle'] || []).push({});
    }
    // ... rest of the component code
} 