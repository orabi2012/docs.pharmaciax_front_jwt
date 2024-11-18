import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class GoogleAdsService {
    constructor() { }

    loadAdsScript() {
        const script = document.createElement('script');
        script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
        script.async = true;
        script.crossOrigin = 'anonymous';
        script.setAttribute('data-ad-client', 'ca-pub-8400668080120923');
        document.head.appendChild(script);
    }
} 