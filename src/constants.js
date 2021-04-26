export const STATUS = {
  ON: "ON",
  OFF: "OFF",
  SILENT: "SILENT",
};

export const LOG_TYPE = {
  METHOD: "method",
  HANDLER: "handler",
  XHR: "xhr",
  WS: "ws",
  DEBUG: "debug",
  LIFECYCLE: "lifecycle",
  HOOK: "hook",
};

export const LOG_TYPE_COLOR = {
  method: "#3671d1",
  handler: "#33b752",
  xhr: "#f2db0c",
  ws: "#29b9f2",
  debug: "#afafaf",
  lifecycle: "#ffad3a",
};

export const DEFAULT_LOG = {
  label: "Global",
  message: "No message specified",
  type: "debug",
  trace: false,
};
