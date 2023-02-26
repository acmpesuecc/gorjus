import Editor from "@monaco-editor/react";
import { Form } from "@remix-run/react";
import { useState } from "react";

export async function action({ request }) {
  const body = await request.formData();
  const data = Object.fromEntries(body);
  console.log(data);
  var data_final = { html_str: data.code, css_str: "" };
  return body;
}
export default function Index() {
  const [code, getCode] = useState("");
  function handleChange(value, event) {
    getCode(value);
    console.log(code);
  }

  return (
    <div className="container">
      <div>
        <Form method="post">
          <input type="text" name="code" value={code} hidden />
          <Editor
            height="90vh"
            width="50%"
            language="html"
            theme="vs-dark"
            value="<html></html>"
            onChange={handleChange}
            options={{
              scrollBeyondLastLine: false,
              fontSize: "20px",
            }}
          />
          <button type="submit">Submit</button>
        </Form>
      </div>
      <div>
        <h1>Output</h1>
      </div>
    </div>
  );
}
