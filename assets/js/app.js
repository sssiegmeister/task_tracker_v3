
import "phoenix_html"
import jQuery from 'jquery';
window.jQuery = window.$ = jQuery;
import "bootstrap";
import _ from "lodash";

// Import local files
//
// Local files can be imported directly using relative paths, for example:
// import socket from "./socket"

import root_init from "./src";

$(() => {
  let node = $('#root')[0];
  root_init(node);
});
