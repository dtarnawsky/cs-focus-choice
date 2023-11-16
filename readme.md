# Focus Management Example

In this example application we are attempting to ensure that when the screen reader is turned on that it reads the most important element on the given page.

The default behavior of a screen reader is to read a seemly random element (it happens to be something that is close to where you pressed last). This behavior may mean that it reads elements that are behind modals, re-reads elements, etc. We really want it to start on the most important element on any page.

In the app there are 2 pages with `<h1>` tags that should be read first on each page. To achieve this we are marking them up with `<h1 class="page-focus">` then we are using some javascript in [focus.service.ts](src/app/focus.service.ts) to attempt to call `focus` on the element that has the class `page-focus`. 

## Reproducing
- `npm intall`
- `npx ionic build  --configuration=production`
- `npx cap sync`
- `npx cap open ios`
- Run the application in XCode
- Turn on Voice Over
- Notice that it will begin reading an element on page 1 or 2 then when we call focus it will read what we want it to (the `h1`)

## Technique ##
We add the following to `global.scss`:
```css
.page-focus:focus-visible {
    outline: none;
}
```

We capture the `stackDidChange` event of `ion-router-outlet`:
```html
  <ion-router-outlet (stackDidChange)="stackChanged()"></ion-router-outlet>
```


## Challenges
We don't know **exactly** when an `ion-page` is displayed. So we take a best guess using the Angular router but we need to sleep for a certain amount of time to account for the `ion-page` animating in. Unfortunately an `ion-router-outlet` does not expose an event when it completes its animation and it does not expose which `ion-page` was animated in (so we have to guess by looking through the DOM and picking the last element).

Because of these caveats there are these problems:
- The screen reader will begin reading what it thinks is important on the page before we have called focus to let it know what is the most important thing it should start on.
- The screen reader may read the previous screen if the timing is wrong because the new page we are routing to may not have animated in.

## Possible Fix
The `ion-router-outlet` has an internal [ionNavDidChange](https://github.com/ionic-team/ionic-framework/blob/ed040b09e9cbd4246864e690542132defc6a6578/core/src/components/router-outlet/router-outlet.tsx#L71) event that could tell us when it is animated in a page.

If this component emitted the element (the `ion-page`) when it completed navigating/animating in, then an developer could call `focus` on the element they feel is important on the page and avoid the screen reader's default behavior of reading a seemly random element on the page.