React 19<br>
`import { renderToReadableStream } from "react-dom/server.browser";`<br>
causes async_hooks context loss on Suspense.

With React 18, it didn't.

There is a new<br>
`import { renderToReadableStream } from "react-dom/server.edge";`<br>
import in React 19, which doesn't have the issue.