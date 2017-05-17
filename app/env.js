/**
 * Assign __env to the root window object.
 *
 * The goal of this file is to allow the deployment
 * process to pass in environment values into the application.
 *
 * The deployment process can overwrite this file to pass in
 * custom values:
 *
 * window.__env = window.__env || {};
 * window.__env.url = 'some-url';
 * window.__env.key = 'some-key';
 *
 * Keep the structure flat (one level of properties only) so
 * the deployment process can easily map environment keys to
 * properties.
 */

(function (window) {
    window.__env = window.__env || {};
    // API url
    /*window.__env.apiUrlNew = 'http://164.100.133.17:13060/api/';*/
    window.__env.apiUrlNew = 'https://www.mytrintrin.com:13070/api/';
    /*window.__env.apiUrlNew = 'https://www.mytrintrin.com:13060/api/';*/
   /* window.__env.apiUrlNew = 'http://43.251.80.79:13060/api/';*/
    window.__env.googleMapsUrl = 'https://www.google.com/maps/dir/Current+Location/';
    // Whether or not to enable debug mode
    // Setting this to false will disable console output
    window.__env.enableDebug = true;
}(this));
