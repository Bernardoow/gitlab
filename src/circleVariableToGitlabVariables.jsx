import React, { useEffect, useState } from "react";
import js_yaml from "js-yaml";
import copy from "copy-to-clipboard";
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
  const [circleCiSettings, SetCircleCiSettings] = useState(variablesExample);
  const [gitlabVariables, SetGitlabVariables] = useState([]);
  const [circleCiYamlStatus, SetCircleCiYamlStatus] = useState({
    hasProblem: false,
    message: undefined,
  });
  function circleCiSettingsChange(event) {
    SetCircleCiSettings(event.target.value);
  }

  function onClickCopy() {
    const textToClipboard = gitlabVariables.reduce((acc, currentValue) => {
      acc += `${currentValue.key}: ${currentValue.value}\n`;
      return acc;
    }, "");
    copy(textToClipboard);
  }

  useEffect(() => {
    const readYaml = (text) => {
      try {
        const doc = js_yaml.load(text);
        SetCircleCiYamlStatus({
          hasProblem: false,
          message: undefined,
        });
        return doc;
      } catch (e) {
        SetCircleCiYamlStatus({
          hasProblem: true,
          message: "Invalid Yaml Data",
        });
        return {};
      }
    };

    const searchEnvironmentEntries = (yamlData) => {
      try {
        yamlData.hasOwnProperty("jobs") &&
          yamlData.jobs.hasOwnProperty("build") &&
          yamlData.jobs.build.hasOwnProperty("docker");

        SetCircleCiYamlStatus({
          hasProblem: false,
          message: undefined,
        });
        const data = yamlData.jobs.build.docker;

        return data.reduce((acc, current) => {
          return { ...acc, ...current.environment };
        }, {});
      } catch {
        SetCircleCiYamlStatus({
          hasProblem: true,
          message: "Yaml Data is missing path jobs.build.docker",
        });
        return {};
      }
    };

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
            .toLowerCase()
            .replace("false", '"False"')
            .replace("true", '"True"');
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

    const addExtraVariables = (arrayList) => {
      arrayList.push(new Variable("key", "False"));

      return arrayList;
    };

    const functions = [
      readYaml,
      searchEnvironmentEntries,
      createVariables,
      fixBooleanValues,
      fixDatabaseUrl,
      checkNullValue,
      addExtraVariables,
    ];

    const result = functions.reduce((accumulator, func) => {
      return func(accumulator);
    }, circleCiSettings);

    SetGitlabVariables(result);
  }, [circleCiSettings]);

  function createHtmlList() {
    const htmlList = gitlabVariables.map((entry) => {
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

  return (
    <div className="row">
      <div className="col">
        {circleCiYamlStatus.hasProblem ? (
          <p className="alert alert-danger" role="alert">
            {circleCiYamlStatus.message}
          </p>
        ) : (
          ""
        )}
        <div class="mb-3">
          <label for="variables" class="form-label">
            Circle Ci Settings
          </label>
          <textarea
            className="form-control"
            id="circleCiSettings"
            value={circleCiSettings}
            onChange={circleCiSettingsChange}
            rows="20"
          ></textarea>
        </div>
      </div>
      {gitlabVariables.length > 0 && (
        <div className="col">
          <div className="mb-3">
            <label className="form-label">Variables Gitlab</label>
            <button
              type="button"
              className="btn btn-outline-primary"
              style={{ "margin-left": "10px" }}
              onClick={onClickCopy}
            >
              <i className="fa fa-copy" style={{ "padding-right": "5px" }}></i>
              Copy
            </button>
            <ul
              className="list-group"
              style={{ "max-height": "90vh", overflow: "scroll" }}
            >
              {createHtmlList()}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default CircleVariableToGitlabVariables;
