---
title: 'How to fix vitejs and @material-ui/pickers error "No matching export in ..."'
date: "2024-03-01"
publish: true
tags:
  - vite
  - react
  - material-ui
---

In my legacy project using Create React App (CRA), I utilized `@material-ui/pickers` for date selection components like so:

```typescript
import type { DatePickerView } from '@material-ui/pickers'
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import type { MaterialUiPickersDate } from '@material-ui/pickers/typings/date'

...

const DatePicker = ({ ... }) => {
    ...
}

export default DatePicker
```

Transitioning the project to ViteJs, I encountered import errors with @material-ui/pickers, specifically with missing exports for KeyboardDateTimePickerProps.

```bash
✘ [ERROR] No matching export in "node_modules/.pnpm/@material-ui+pickers@3.2.2_@date-io+core@1.3.13_@material-ui+core@4.12.4_prop-types@15.6.2_re_7oyc4atx4tz2za7ityyicziahu/node_modules/@material-ui/pickers/esm/DateTimePicker/index.js" for import "KeyboardDateTimePickerProps"

    node_modules/.pnpm/@material-ui+pickers@3.2.2_@date-io+core@1.3.13_@material-ui+core@4.12.4_prop-types@15.6.2_re_7oyc4atx4tz2za7ityyicziahu/node_modules/@material-ui/pickers/esm/index.js:4:30:
      4 │ import { DateTimePickerProps, KeyboardDateTimePickerProps } from './DateTimePicker';
```

To solve this, [thanks to this comment in ViteJs Github issue](https://github.com/vitejs/vite/issues/3205#issuecomment-829941756), I updated the `vite.config.ts` file to include specific `resolve.alias` configurations, ensuring that Vite correctly locates and imports the necessary modules from `@material-ui/pickers`:

```typescript
resolve: {
  alias: [
    {
      find: /^@material-ui\/pickers\/(.+)/,
      replacement: resolve(__dirname, './node_modules/@material-ui/pickers/esm/$1'),
    },
    {
      find: /^@material-ui\/pickers$/,
      replacement: resolve(__dirname, './node_modules/@material-ui/pickers/esm'),
    },
  ],
},
```

This adjustment corrects the import paths, allowing the project to compile successfully with ViteJs.
