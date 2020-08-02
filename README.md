<div align='center'>
    <br/>
    <br/>
    <!-- <img src='https://dokz.site/logo_full.svg' width='300px'> -->
    <h1>edit-this-page</h1>
    <br/>
    <br/>
    <h3>Make your website editable by your users
    </h3>
    <br/>
    <br/>
</div>

Import a button on your page to make any website editable, the button opens an overlay code editor that let you make changes and submit a pull request on github

### 1. Install

```
yarn add edit-this-page babel-plugin-edit-this-page @emotion/core @chakra-ui/core
```

### 2. Add the babel plugin

The babel plugin is necessary to inject the source code, github repo url to be used by the react component

```js
// babel.config.js
module.exports = {
    plugins: [['edit-this-page', { editableFiles: 'pages/**' }]],
}
```

### 3. Use the react component

The react component will open a modal to edit your page contents

```tsx
import EditThisPageButton from 'edit-this-page'

export function Page() {
    return (
        <MyApp>
            <EditThisPageButton />
            <EditThisPageButton unstyled>
                <MyButton>edit this page</MyButton>
            </EditThisPageButton>
        </MyApp>
    )
}
```



### Important notes

If you build your website in a ci environment you need to have the git config available during ci

Some platform like vercel ignore these files by default, to make this work with vercel you have to add the following to your `.vercelignore` file

```
# .vercelignore
!.git/config
```