---
title: Dependency Injection in React
date: "2022-12-21"
publish: true
---
# Dependency Injection in React

> In software engineering, dependency injection is a design pattern in which an object or function receives other objects or functions that it depends on. [^1]

## Pros
- More flexible
- Easier for unit testing.

## Cons
- More complexity

---

## Example

This is `Page` component which has the `ExoticButton` as a dependency.
```tsx[class="line-numbers"][data-line=4]
export default function Page({ ... }: Props) {
  return (
    <div>
      <ExoticButton/>
    </div>
  );
}
```
In this case, if we change the button, it will inevitably affect the `Page` component. Or if a consumer of the component doesn't want to use the `ExoticButton`, we can have a conditional flag to change the button.
```tsx[class="line-numbers"]
export default function Page({ ..., isAnotherPage }: Props) {
  return (
    <div>
      {isAnotherPage ? <ExoticButton/>: <AnotherButton/>}
    </div>
  );
}
```
A dependency injection way is to lift the button rendering responsibily to the consumer of the Page component.
```tsx[class="line-numbers"]
export default function Page({ ..., button }: Props) {
  return (
    <div>
      {button}
    </div>
  );
}
```

---
[^1]: [wiki](https://en.wikipedia.org/wiki/Dependency_injection)