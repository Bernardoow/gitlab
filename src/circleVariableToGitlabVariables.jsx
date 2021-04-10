import React, { useEffect, useState } from "react";
import js_yaml from "js-yaml";
import { variables as variablesExample } from "./exampleData";

class ErrorApp {
  constructor(message) {
    this.message = message;
  }
}
class Variable {
  constructor(key, value) {
    this.key = key;
    this.value = value;
    this.error = undefined;
  }
}

const CircleVariableToGitlabVariables = () => {
  const [variables, SetVariables] = useState(variablesExample);
  const [fixedVariables, SetFixedVariables] = useState();
  useEffect(() => {
    const createVariables = (obj) => {
      return Object.entries(obj).map(([key, value]) => {
        return new Variable(key, value);
      });
    };

    const fixBooleanValues = (arrayList) => {
      return arrayList.map((entry) => {
        if (typeof entry.value === "boolean") {
          entry.value = entry.value
            .toString()
            .replace("false", "False")
            .replace("true", "True");
        }
        return entry;
      });
    };

    const fixDatabaseUrl = (arrayList) => {
      return arrayList.map((entry) => {
        if (entry.key.toUpperCase().includes("DATABASE_URL")) {
          entry.value = entry.value.replace("localhost", "postgres");
        }
        return entry;
      });
    };

    const checkNullValue = (arrayList) => {
      return arrayList.map((entry) => {
        if (entry.value === null) {
          entry.error = new ErrorApp("This field is missing value");
        }
        return entry;
      });
    };

    const functions = [
      js_yaml.load,
      createVariables,
      fixBooleanValues,
      fixDatabaseUrl,
      checkNullValue,
    ];

    const variablesLoaded = functions.reduce((accumulator, func) => {
      return func(accumulator);
    }, variables);

    SetFixedVariables(variablesLoaded);
  }, [variables]);

  function createHtmlList() {
    if (fixedVariables) {
      console.log(fixedVariables);
      const htmlList = fixedVariables.map((entry) => {
        let className = "list-group-item";
        if (entry.error) {
          className += " list-group-item-danger";
        }
        return (
          <li className={className}>
            {entry.key}: {entry.value}{" "}
            {entry.error ? "(" + entry.error.message + ")" : ""}
          </li>
        );
      });
      return htmlList;
    }
  }

  return (
    <div className="row">
      <div className="col">
        <div class="mb-3">
          <label for="variables" class="form-label">
            Variables CI API
          </label>
          <textarea
            className="form-control"
            id="pyProjectToml"
            value={variables}
            // onChange={pyProjectFileHandleChange}
            rows="20"
          ></textarea>
        </div>
      </div>
      <div className="col">
        <div class="mb-3">
          <label class="form-label">Variables Gitlab</label>
          <ul className="list-group">{createHtmlList()}</ul>
        </div>
      </div>
    </div>
  );
};

export default CircleVariableToGitlabVariables;
