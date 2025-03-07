import { renderToReadableStream } from "react-dom/server.browser";
import express from "express";
import { Readable } from "stream";
import { Suspense } from "react";
import { AsyncLocalStorage } from "async_hooks";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const app = express();
const ctx = new AsyncLocalStorage();
const App = ({
  promise
}) => {
  use(promise);
  const id = ctx.getStore().id;
  console.log(`App id: ${id}`);
  return /*#__PURE__*/_jsx("h1", {
    children: "Hello World"
  });
};
const Wrapper = ({
  children
}) => {
  const id = ctx.getStore().id;
  console.log(`Wrapper id: ${id}`);
  return /*#__PURE__*/_jsxs("html", {
    children: [/*#__PURE__*/_jsx("head", {
      children: /*#__PURE__*/_jsx("title", {
        children: "React Server Side Rendering"
      })
    }), /*#__PURE__*/_jsx("body", {
      children: /*#__PURE__*/_jsx(Suspense, {
        fallback: /*#__PURE__*/_jsx("div", {
          children: "Loading..."
        }),
        children: children
      })
    })]
  });
};
app.use((req, res, next) => {
  const id = Math.random().toString(36).slice(2);
  ctx.run({
    id
  }, () => next());
});
app.get("/", async (req, res) => {
  const promise = new Promise(resolve => setTimeout(resolve, 200));
  const stream = await renderToReadableStream(/*#__PURE__*/_jsx(Wrapper, {
    children: /*#__PURE__*/_jsx(App, {
      promise: promise
    })
  }));
  Readable.fromWeb(stream).pipe(res);
});
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
function use(promise) {
  const status = promise._status || "pending";
  if (status === "fulfilled") {
    return promise._result;
  }
  if (status === "rejected") {
    throw promise._error;
  }
  if (!promise._status) {
    promise._status = "pending";
    promise.then(value => {
      promise._status = "fulfilled";
      promise._result = value;
    }, error => {
      promise._status = "rejected";
      promise._error = error;
    });
  }
  throw promise;
}

