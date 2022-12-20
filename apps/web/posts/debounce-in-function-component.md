---
title: "Using \"lodash.debounce\" in function components."
date: "2021-10-12"
tags:
    - react
    - lodash
publish: true
---
# Using "lodash.debounce" in function components.

Wrong: declare a debounced function inside a render function.

```ts
function SomeInput(){
  const debouncedCalculation = debounce(calculation,1000)
  return <Input onChange={(e)=>debouncedCalculation(e)}/>
}
```

If the component is rendered 4 times, 4 debouncedCalculation instances will be created, and when the delays end, all 4 instances will call the method inside.

```
render 1:  debouncedCalculation1
render 2:  debouncedCalculation2
render 3:  debouncedCalculation3
render 4:  debouncedCalculation4
```

Correct: declare a debounced function once outside a render function.

```ts
const debouncedCalculation = debounce(calculation,1000)

function SomeInput(){
  return <Input onChange={(e)=>debouncedCalculation(e)}/>
}
```

Now the debouncedCalculation will be created once per import, and when the delay end, only 1 instance will call the method inside.

```
render 1:  debouncedCalculation
render 2:  debouncedCalculation
render 3:  debouncedCalculation
render 4:  debouncedCalculation
```