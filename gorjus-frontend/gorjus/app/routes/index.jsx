import axios from "axios";
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
  const [code, setCode] = useState("");
  const [imgsrc, setImgSrc] = useState("");

  function handleChange(value, event) {
    setCode(value);
    console.log(code);
  }

  function handleSubmit(value, event) {
    console.log("Submitting Code => ", value);
    axios
      .post(
        "http://localhost:9000/",
        { html_str: code, css_str: "" },
        { responseType: "arraybuffer" }
      )
      .then((response) => {
        console.log(response);
        return new Blob([response.data]);
      })
      .then((blob) => URL.createObjectURL(blob))
      .then((url) => console.log(setImgSrc(url)))
      .catch((err) => console.error(err));
  }

  return (
    <div
      className="container"
      style={{ display: "inline-flex", alignItems: "stretch" }}
    >
      <div style={{ display: "flex", minWidth: "50vw" }}>
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
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <button type="submit" onClick={handleSubmit}>
          Submit
        </button>
        <h1>Output</h1>
        <img src={imgsrc} alt="lol"></img>
      </div>
    </div>
  );
}
