import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { ScreenReader } from '@capacitor/screen-reader';

@Injectable({
    providedIn: 'root'
})
export class FocusService {
    public async focus() {
        // Only want to do this with iOS voice over
        if (Capacitor.getPlatform() !== 'ios') return;

        // Only want to do this when the screen reader is enabled
        if (!(await ScreenReader.isEnabled()).value) return;

        // This can return more than one page so select the last one
        const pages = document.querySelectorAll('.ion-page:not(.ion-page-hidden, .ion-page:has(ion-tabs))');
        let page: Element | undefined;
        pages.forEach((e) => {
            page = e;
        });

        if (!page) return;

        // Find the element on the page with the class of page-focus
        const e: Element | null = page?.querySelector('.page-focus');

        if (!e) return;

        // We need to set tabindex to -1 and focus the element for the screen reader to read what we want
        (e as HTMLElement).setAttribute('tabindex', '-1');

        console.log(`Focusing element ${e.tagName} on ${page?.tagName}`);
        (e as HTMLElement).focus();
    }
}