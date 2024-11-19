import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-google-ad',
    template: `
    <div class="ad-container">
        <ins class="adsbygoogle"
             style="display:block; width:100%;"
             [attr.data-ad-client]="adClient"
             [attr.data-ad-slot]="adSlot"
             [attr.data-ad-format]="adFormat"
             data-full-width-responsive="true"></ins>
    </div>
    `,
    styles: [`
        .ad-container {
            width: 100%;
            max-width: 100%;
            overflow: hidden;
            margin: 0 auto;
        }
        ins.adsbygoogle {
            max-width: 100%;
        }
    `]
})
export class GoogleAdComponent implements OnInit {
    @Input() adClient: string = 'ca-pub-8400668080120923';
    @Input() adSlot!: number;
    @Input() adFormat!: string;

    ngOnInit() {
        try {
            setTimeout(() => {
                ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
            }, 100);
        } catch (e) {
            console.error('Error loading Google AdSense:', e);
        }
    }
} 