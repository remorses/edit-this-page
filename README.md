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

```tsx
import { EditThisPageButton } from 'edit-this-page/src'

export function Page() {
    return (
        <MyApp>
            <EditThisPageButton />
        </MyApp>
    )
}
```
