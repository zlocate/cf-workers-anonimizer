addEventListener("fetch", (event) => {
    event.respondWith(
      handleRequest(event.request).catch(
        (err) => new Response(err.stack, { status: 500 })
      )
    );
  });
  
  async function handleRequest(request) {
    const url = getUrl(request)
    console.log(`${request.method} ${url}`)
    if (!url) {
      return new Response(
        Page,
        {
          headers: { "Content-Type": "text/html" },
          status: 404,
        }
      )
    }
    let response = await fetch(new Request(url, {
      body: request.body,
      headers: request.headers,
      method: request.method,
      redirect: "follow",
    }))
    let { readable, writable } = new TransformStream()
    response.body.pipeTo(writable)
    return new Response(
      readable, 
      {
        headers: response.headers,
        status: response.status,
      }
    )
  }
  
  const getUrl = (request) => {
      const { pathname, searchParams } = new URL(request.url)
      if (pathname.startsWith("/http")) {
          return pathname.slice(1).replace(/http:\/(?!\/)/, "http://",).replace(/https:\/(?!\/)/, "https://")
      }
      const searchParamsUrl = searchParams.get("url");
      if (searchParamsUrl?.startsWith("http")) {
          return searchParamsUrl
      }
  }
  
  const Page = `<!DOCTYPE html>
  <html>
  
  <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Proxy | Created by aber</title>
  </head>
  
  <body>
      <form>
          <div>
              <input name="url" type="url" />
              <button type="submit">→</button>
          </div>
      </form>
      <style>
          body {
              background-color: #fafafa;
          }
  
          form {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              margin-top: 100px;
          }
  
          div {
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: center;
              border: solid 1px #fafafa;
              box-shadow: 0 0 10px #eee;
          }
  
          input {
              width: calc(240px + 7vw);
              height: 40px;
              border-radius: 0px;
              border: none;
              outline: none;
              padding: 0 10px;
              flex: 1;
          }
  
          button {
              width: 50px;
              height: 40px;
              border-radius: 0px;
              border: none;
              background-color: #fff;
              color: #000;
              font-size: 16px;
              cursor: pointer;
          }
      </style>
  </body>
  
  </html>
  `