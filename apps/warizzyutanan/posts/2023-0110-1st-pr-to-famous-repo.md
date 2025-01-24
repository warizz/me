---
title: "My first PR to a public repo"
date: "2023-01-10"
publish: true
tags:
    - life
    - github
    - react
    - typescript
---

## ✏️ Keys takeaway
- Using the PR description as a guideline for contributors.
- Having friendly status update messages help people understand what to do next.

## ❓ The problem and the fix

While I was implementing [react-syntax-highlighter](https://www.npmjs.com/package/react-syntax-highlighter) into my side project, I encountered this error 
```ts
error TS2305: Module '"react-syntax-highlighter/dist/cjs/styles/prism"' has no exported member 'oneDark'.

import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
         ~~~~~~~
```

I dug a little bit deeper and found out that the style was exported but the problem was the Typescript definition has no exported member of it. I created `react-syntax-highlighter.d.ts` as a local definition of the lib and the Typescript error was gone.

```ts
declare module "react-syntax-highlighter/dist/cjs/styles/prism" {
  export { default as oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism/one-dark";
  export { default as oneLight } from "react-syntax-highlighter/dist/cjs/styles/prism/one-light";
}

declare module "react-syntax-highlighter/dist/cjs/styles/prism/one-dark" {
  const style: { [key: string]: React.CSSProperties };
  export default style;
}

declare module "react-syntax-highlighter/dist/cjs/styles/prism/one-light" {
  const style: { [key: string]: React.CSSProperties };
  export default style;
}
```

That was easy!

So I thought this might be a good opportunity for me to contribute to a popular repo like [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped). The first step was reading the manual from the repo ["How can I contribute?"](https://github.com/DefinitelyTyped/DefinitelyTyped#how-can-i-contribute).

## 🎁 The contirubtion

The doc said you should test your code on my local machine first.
>Before you share your improvement with the world, use the types yourself by creating a typename.d.ts file in your project and filling out its exports:

Ok, nice. Done. I did it. Next. [Make a pull request](https://github.com/DefinitelyTyped/DefinitelyTyped#make-a-pull-request). In short, you need to fork and open the PR from the fork to the base repo.

I opened the PR but to my fork, not the base, they have nice instructions that I can easily follow. 

![pr-description](/posts/1st-pr/pr-description.webp)

All of the checkboxes were checked except the "Add or edit tests". Luckily the repo already has a test so I added another by copying a similar code.

```tsx
<PrismLightHighlighter style={oneDarkCjs}>{codeString}</PrismLightHighlighter>;
<PrismLightHighlighter style={oneLightCjs}>{codeString}</PrismLightHighlighter>;
<PrismLightHighlighter style={{ keyword: { color: 'red' } }}>{codeString}</PrismLightHighlighter>;
```

Then run `npm test react-syntax-highlighter`, it was passed, easy! 

Now all the marks were ticked, time to open [the PR to the base branch](https://github.com/DefinitelyTyped/DefinitelyTyped/pull/63808)! The typescript-bot greeted me with the status of the PR, this is nice! how can I have something like this in a repo? 

![bot greeting](/posts/1st-pr/bot-1.webp)

Another message from the bot was mentioning the maintainers that they were having a new PR to review, another nice touch.

![bot mentioning maintainers](/posts/1st-pr/bot-2.webp)

Waited not long, and an owner reviewed my PR and approved it! Thanks [@anirban09](https://github.com/anirban09) :) At this moment I am still not sure what to do next, do I have to merge the PR myself or the bot will merge it for me? No idea.

![owner approval](/posts/1st-pr/owner-approval.webp)

Not long after that, a maintainer approved the PR, the bot posted a new message that the requirement was met and the PR can be merged by commenting "Ready to merge" to it.

![ready to merge](/posts/1st-pr/ready-to-merge.webp)

In the monumental moment, I commented using the keyword and the PR was merged soon afterward. 🎉

![merged](/posts/1st-pr/merge.webp)

A few days later, the Dependabot opened a PR updating the new version of the package I contributed, and that wrapped up the story of my first PR to a popular public repo ever.

![merged](/posts/1st-pr/upgrade-pr.webp)
