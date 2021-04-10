import logo from "./logo.svg";
import "./App.css";

import CircleVariableToGitlabVariables from "./circleVariableToGitlabVariables";

import js_yaml from "js-yaml";

let text = `
          DEBUG: True
          LOG_LEVEL: DEBUG
          PROJECT_DOMAIN: localhost:8000
          SECRET_KEY: secret
          AURORA_DATABASE_URL: postgres://ubuntu:@localhost:5432/circle_test
          SENTRY_DSN: https://id:pass@sentry.io/199884
          INTERNAL_AUTHENTICATION_API_URL: http://localhost:8001/v1/
          INTERNAL_AUTHENTICATION_API_TOKEN: token
          INTERNAL_AUTH_TIMEOUT: 2
          SELLER_AUTHENTICATION_API_URL: http://localhost:8003/v1/auth/
          TEST_SELLER_AUTHENTICATION_API_TOKEN: token
          SNS_DRY_RUN: False
          CACHE_URL: locmem://
          CACHED_SERIALIZER_TIMEOUT: 3600
          OIDC_ENDPOINT: http://localhost:8003/openid
          USERINFO_ENDPOINT: http://localhost:8003/v1/users/
          OIDC_AUDIENCES: belinha
          HTTPS_REQUIRED: false
          INTERNAL_ORIGINS: v1,v2api,catalog,spreadsheet
          PRICE_ENABLED_CHANNELS: amazon,b2w,carrefour,cnova,colombo,digitalweb,leroymerlin,luanet,madeiramadeira,mercadolivre,saraiva,zoom
          ELASTIC_APM_SERVICE_NAME: products-api
          ELASTIC_APM_SECRET_TOKEN: token
          ELASTIC_APM_SERVER_URL: http://localhost:8200
          ELASTIC_APM_DISABLE_SEND: True
          ELASTIC_APM_SERVER_TIMEOUT: 10
          ELASTIC_APM_TRANSACTION_MAX_SPANS: "20"
          ELASTIC_APM_TRANSACTION_SAMPLE_RATE: "0.1"

          OIDC_RSA_PUBLIC_KEY: OIDC_RSA_PUBLIC_KEY

          LOGENTRIES_TOKEN: token
`;

try {
  const doc = js_yaml.load(text);
  console.log(doc);
  //   for (const [key, value] of Object.entries(doc)) {
  //     console.log(`${key}: ${value}`);
  //   }
  const test = Array.from(doc);
  console.log(test);
  console.log(Array.from(doc));
  console.log(
    "teste",
    Object.entries(doc).reduce((accumulator, [key, value]) => {
      if (typeof value === "boolean") {
        value = value
          .toString()
          .replace("false", "False")
          .replace("true", "True");
      }

      accumulator[key] = value;
      return accumulator;
    }, {})
  );
} catch (e) {
  console.log(e);
}

function App() {
  return (
    <div className="container-fluid">
      <CircleVariableToGitlabVariables />
    </div>
  );
}

export default App;
